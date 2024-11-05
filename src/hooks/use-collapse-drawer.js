import { useContext } from 'react';
import { CollapseDrawerContext } from '../contexts/collapse-drawer-context';

// ----------------------------------------------------------------------

const useCollapseDrawer = () => useContext(CollapseDrawerContext);

export default useCollapseDrawer;
