import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  txtClose,
  onClose,
  style,
  ...other
}) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      sx={{ '.MuiModal-backdrop': { backgroundColor: 'rgb(22 28 36 / 40%)' } }}
      {...other}
    >
      <DialogTitle
        sx={(theme) => ({
          pb: 2,
          ...(style == 'error' && { backgroundColor: theme.palette.error.main, color: '#FFFFFF' }),
        })}
      >
        {title}
      </DialogTitle>

      {!!style && <br />}
      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {txtClose || 'ยกเลิก'}
        </Button>
        {action}
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  action: PropTypes.node,
  content: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};
