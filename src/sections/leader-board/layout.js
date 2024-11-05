'use client';

// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
//components
import Nav from './nav';
import Sidebar from './sidebar';
//react
import { useState } from 'react';
//lib
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SidebarPreview from './sidebar-preview';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 38;
const APP_BAR_DESKTOP = 38;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  backgroundColor: '#f4f6f8',
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  // paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
  },
}));

export default function Layout({ model, control, preview, setPreview, previewType, setPreviewType, children }) {
  const theme = useTheme();
  // const { collapseClick } = useCollapseDrawer();
  const [open, setOpen] = useState(false);
  

  return (
    <RootStyle>
      <Nav model={model} {...{ preview, setPreview }} onOpenSidebar={() => setOpen(true)} />
      {!preview ? (
        <Sidebar control={control} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      ) : (
        <SidebarPreview {...{ previewType, setPreviewType }} />
      )}
      <MainStyle
        sx={{
          padding: '5rem 5rem 5rem 10rem',
          // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        }}
      >
        {children}
      </MainStyle>
    </RootStyle>
  );
}
