import { useCallback, useState } from 'react';

// ----------------------------------------------------------------------

export default function usePopover() {
  const [open, setOpen] = useState(null);
  const [data, setData] = useState(null);

  const onOpen = useCallback((event, data) => {
    setOpen(event.currentTarget);
    if (data) setData(data);
  }, []);

  const onClose = useCallback(() => {
    setOpen(null);
    setData(null);
  }, []);

  return {
    open,
    onOpen,
    onClose,
    data,
    setOpen,
  };
}
