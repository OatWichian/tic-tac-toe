import { Dialog, DialogContent, DialogTitle } from '@mui/material';

const DialogLayoutComp = ({ open, title, children }) => {
  return (
    <Dialog open={open} sx={{ '.MuiPaper-root': { width: '100%' } }}>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: '#ffffff' }}>{title}</DialogTitle>
      <DialogContent>
        <br />
        {children}
        <br />
      </DialogContent>
    </Dialog>
  );
};

export default DialogLayoutComp;
