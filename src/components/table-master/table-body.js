import { ConfirmDialog } from '@components/custom-dialog';
import { useBoolean } from '@hooks/use-boolean';
import {
  Avatar,
  Button,
  ListItemText,
  MenuItem,
  Stack,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { fNumber } from '@utils/format-number';
import { sentenceCase } from 'change-case';
import { format } from 'date-fns';
import _get from 'lodash/get';
import getConfig from 'next/config';
import { Fragment } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { TableNoData, TableSkeleton } from 'src/components/table';

const { publicRuntimeConfig } = getConfig();

const TableBodyComp = ({
  isLoading = false,
  header = [],
  more,
  dataList = [],
  rowsPerPage,
  selectedChildren,
}) => {
  const confirm = useBoolean();
  const popover = usePopover();

  const notFound = !dataList.length;

  return (
    <>
      <TableBody>
        {isLoading
          ? [...Array(rowsPerPage)].map((i, index) => <TableSkeleton key={index} />)
          : dataList.map((row, index) => (
              <TableRow key={index} hover>
                {selectedChildren && selectedChildren(row)}

                {header.map((head, idx) => (
                  <Fragment key={idx}>
                    {idx === 0 ? (
                      <TableCell
                        sx={
                          head?.type == 'img' && {
                            display: 'flex',
                            alignItems: 'center',
                          }
                        }
                      >
                        <Avatar
                          alt={row[head.id]}
                          src={`${_get(row, [head.id])}`}
                          variant="circular"
                          sx={{ width: 64, height: 64, mr: 1 }}
                        />
                      </TableCell>
                    ) : head?.type == 'number' ? (
                      <TableCell>{fNumber(_.get(row, head.id, 0))}</TableCell>
                    ) : head.type === 'status' ? (
                      <TableCell>
                        <Label
                          variant="soft"
                          color={
                            (row[head.id] === 1 && 'success') ||
                            (row[head.id] === 0 && 'error') ||
                            (row[head.id] === 'draft' && 'error') ||
                            (row[head.id] === 'publish' && 'success') ||
                            'default'
                          }
                        >
                          {typeof row[head.id] === 'number'
                            ? sentenceCase(row[head.id] === 0 ? 'unavailable' : 'available')
                            : row[head.id]}
                        </Label>
                      </TableCell>
                    ) : head.type === 'date' ? (
                      <TableCell>
                        <ListItemText
                          primary={format(new Date(row[head.id]), 'dd MMM yyyy')}
                          secondary={format(new Date(row[head.id]), 'p')}
                          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                          secondaryTypographyProps={{
                            mt: 0.5,
                            component: 'span',
                            typography: 'caption',
                          }}
                        />
                      </TableCell>
                    ) : head.type === 'custom' ? (
                      <TableCell>{head.component(row)}</TableCell>
                    ) : (
                      <TableCell>{_.get(row, head.id)}</TableCell>
                    )}
                  </Fragment>
                ))}

                {more && (
                  <TableCell align="right">
                    <Stack direction="row" gap={1}>
                      {more.list &&
                        more.list.map((data, idx) => (
                          <IconButton
                            key={idx}
                            disabled={data.disabled && data.disabled(row)}
                            onClick={(e) => data.onClick && data.onClick(e, row)}
                          >
                            {data.icon}
                          </IconButton>
                        ))}
                      {more.select && (
                        <IconButton onClick={(e) => popover.onOpen(e, row)}>
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
        <TableNoData notFound={notFound} />
      </TableBody>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {more.select &&
          more.select.map((item, index) => (
            <Fragment key={index}>
              {item?.act === 'delete' ? (
                <MenuItem
                  key={index}
                  onClick={() => {
                    confirm.onTrue();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  {item.name || 'Delete'}
                </MenuItem>
              ) : (
                <MenuItem
                  key={index}
                  onClick={() => {
                    item.onClick && item.onClick(popover?.data);
                    popover.onClose();
                  }}
                >
                  <Iconify icon={item?.icon} />
                  {item?.name}
                </MenuItem>
              )}

              <ConfirmDialog
                style="error"
                open={confirm.value}
                onClose={() => {
                  confirm.onFalse();
                  popover.onClose();
                }}
                title={item.dialog?.title(popover?.data) || 'Delete'}
                content={item.dialog?.content(popover?.data) || 'Are you sure want to delete?'}
                action={
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      item.onClick && item.onClick(popover?.data);
                      confirm.onFalse();
                      popover.onClose();
                    }}
                  >
                    ลบ
                  </Button>
                }
              />
            </Fragment>
          ))}
      </CustomPopover>
    </>
  );
};

export default TableBodyComp;
