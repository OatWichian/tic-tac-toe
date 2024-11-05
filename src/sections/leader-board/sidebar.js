import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// material
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  Avatar,
  Drawer,
  Typography,
  Tabs,
  Tab,
  Divider,
  CardHeader,
} from '@mui/material';
// hooks
import useCollapseDrawer from '../../hooks/use-collapse-drawer';
// components
import TabElements from '@components/survey/tabs/elements';
import TabSections from '@components/survey/tabs/sections';
//icons
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import PaletteIcon from '@mui/icons-material/Palette';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useTheme } from '@emotion/react';
import TabFormConfig from '@components/survey/tabs/form-config';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 356;
const COLLAPSE_WIDTH = 102;

const RootStyle = styled('div')(({ theme }) => ({
  // [theme.breakpoints.up('lg')]: {
  //   flexShrink: 0,
  //   transition: theme.transitions.create('width', {
  //     duration: theme.transitions.duration.complex,
  //   }),
  // },
}));

// ----------------------------------------------------------------------
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export default function DashboardSidebar({ control, isOpenSidebar, onCloseSidebar }) {
  const theme = useTheme();
  const { pathname } = useRouter();
  const { user } = useMockedUser();
  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <RootStyle
      sx={{
        width: DRAWER_WIDTH + 50,
      }}
    >
      {/* <MHidden width="lgDown"> */}
      <Drawer
        open={true}
        variant="persistent"
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            bgcolor: 'background.default',
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ mt: 9 }}>
          <Tabs
            sx={{ p: 1 }}
            variant="fullWidth"
            textColor="primary"
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{
              style: { backgroundColor: theme.palette.primary.main },
            }}
          >
            <Tab
              icon={<QuestionAnswerIcon fontSize="small" />}
              label={<Typography variant="button">คำถาม</Typography>}
              {...a11yProps(0)}
            />
            <Tab
              icon={<GridViewSharpIcon fontSize="small" />}
              label={<Typography variant="button">เนื้อหา</Typography>}
              {...a11yProps(1)}
            />
            <Tab
              icon={<PaletteIcon fontSize="small" />}
              label={<Typography variant="button">ตกแต่ง</Typography>}
              {...a11yProps(2)}
            />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            <CardHeader title="คำถาม" titleTypographyProps={{ variant: 'h6' }} />
            <TabElements control={control} section="question" />
            <Divider sx={{ marginTop: 4 }} />
            <CardHeader title="หัวข้อ" titleTypographyProps={{ variant: 'h6' }} />
            <TabElements control={control} section="title" />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TabSections control={control} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <TabFormConfig />
          </CustomTabPanel>
        </Box>
      </Drawer>
      {/* </MHidden> */}
    </RootStyle>
  );
}
