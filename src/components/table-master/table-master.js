import { ConfirmDialog } from '@components/custom-dialog';
import { useBoolean } from '@hooks/use-boolean';
import { Button, Card, Checkbox, Table, TableCell, TableContainer } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  TableFiltersResult,
  TableHeadCustom,
  TablePaginationCustom,
  TableSelectedAction,
  TableToolbar,
  getComparator,
  useTable,
} from 'src/components/table';
import TableBodyComp from './table-body';

// ----------------------------------------------------------------------

/**
 * img : image param of object Ex. 'item.thumbnail'
 * type : cell type
 */
const HEADER_DEFAULT = [
  { id: 'name', label: 'Name' },
  { id: 'status', label: 'Status', type: 'status' },
  { id: 'updated_at', label: 'Update', type: 'date' },
];

const FILTER_OPTION_DEFAULT = {
  findBy: 'name',
};

const SELECT_OPTION_DEFAULT = {
  selectBy: 'uuid',
};

const FILTERS_DEFAULT = {
  name: '',
  publish: [],
  stock: [],
};

// ----------------------------------------------------------------------

const TableMaster = ({
  header = HEADER_DEFAULT,
  filterOption = FILTER_OPTION_DEFAULT,
  list,
  more,
  isLoading = false,
  selectOption = SELECT_OPTION_DEFAULT,
  onBulkDelete,
}) => {
  const table = useTable();

  const confirmBulk = useBoolean();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(FILTERS_DEFAULT);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table],
  );

  const dataFiltered = applyFilter(
    {
      inputData: tableData,
      comparator: getComparator(table.order, table.orderBy),
      filters,
    },
    filterOption,
  );

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  const canReset = !isEqual(FILTERS_DEFAULT, filters);

  const handleDeleteRows = useCallback(() => {
    onBulkDelete(table.selected);

    const deleteRows = tableData.filter((row) => !table.selected.includes(row.uuid));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(FILTERS_DEFAULT);
  }, []);

  useEffect(() => {
    if (list) {
      setTableData(list);
    } else {
      setTableData([]);
    }
  }, [list]);

  return (
    <>
      <Card>
        <TableToolbar filters={filters} onFilters={handleFilters} />
        {canReset && (
          <TableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={list?.length || 0}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => _.get(row, selectOption.selectBy)),
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirmBulk.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={[...header, { id: '', width: 50 }]}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => _.get(row, selectOption.selectBy)),
                  )
                }
              />

              <TableBodyComp
                isLoading={isLoading}
                header={header}
                more={more}
                dataList={dataFiltered.slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage,
                )}
                rowsPerPage={table.rowsPerPage}
                selectedChildren={(row) => (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={table.selected.includes(_.get(row, selectOption.selectBy))}
                      onClick={() => table.onSelectRow(_.get(row, selectOption.selectBy))}
                    />
                  </TableCell>
                )}
              />
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <ConfirmDialog
        open={confirmBulk.value}
        onClose={confirmBulk.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmBulk.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
};

export default TableMaster;

function applyFilter({ inputData, comparator, filters }, option) {
  const { name, stock, publish } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((row) => {
      return _.get(row, option.findBy)?.toLowerCase().indexOf(name.toLowerCase()) !== -1;
    });
  }

  if (stock.length) {
    inputData = inputData.filter((row) => stock.includes(row.inventoryType));
  }

  if (publish.length) {
    inputData = inputData.filter((row) => publish.includes(row.publish));
  }

  return inputData;
}
