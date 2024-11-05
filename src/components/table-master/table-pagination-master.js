import { useBoolean } from '@hooks/use-boolean';
import { Card, Table, TableContainer } from '@mui/material';
import { usePopover } from 'src/components/custom-popover';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom, TablePaginationCustom } from 'src/components/table';
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

// ----------------------------------------------------------------------

const TablePaginationMaster = ({
  header = HEADER_DEFAULT,
  list,
  more,
  isLoading = false,
  countAllData,
  table,
}) => {
  const confirm = useBoolean();
  const popover = usePopover();

  const notFound = !list.length;

  return (
    <>
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom headLabel={[...header, { id: '', width: 50 }]} />
              <TableBodyComp
                isLoading={isLoading}
                header={header}
                more={more}
                dataList={list}
                rowsPerPage={table.rowsPerPage}
              />
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={countAllData}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </>
  );
};

export default TablePaginationMaster;
