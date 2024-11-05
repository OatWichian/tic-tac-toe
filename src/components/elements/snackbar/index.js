import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

const SnackBar = ({ error }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    const key = enqueueSnackbar(`${error.msg}`, {
      variant: `${error.status ? 'error' : 'success'}`,
    });

    return () => closeSnackbar(key);
  }, [enqueueSnackbar, closeSnackbar, error]);

  return null;
};

export default SnackBar;
