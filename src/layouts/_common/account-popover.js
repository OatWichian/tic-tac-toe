import { m } from 'framer-motion';
// @mui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// routes
import { useRouter } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { SESSION_STORAGE_ITEMS } from 'src/config-global';
import { auth } from 'src/firebase';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  // {
  //   label: 'Profile',
  //   linkTo: '/#1',
  // },
  // {
  //   label: 'Settings',
  //   linkTo: '/#2',
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const { userData } = useSelector((state) => state?.userInfo);
  const { user } = useMockedUser();

  const { logout } = useAuthContext();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      signOut(auth)
        .then(() => {
          sessionStorage.removeItem(SESSION_STORAGE_ITEMS.accessToken);
          router.push('/');
          console.log('User signed out successfully');
        })
        .catch((error) => {
          console.error('Error logging out:', error);
        });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleClickItem = (path) => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={userData?.imageUrl}
          alt={userData?.name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5, justifyItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            {`${userData?.firstName} ${userData?.lastName}`}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData?.email}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Button
          sx={{ width: '100%', fontSize: '12px', margin: '8px 0', color: 'error.main' }}
          variant="text"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </CustomPopover>
    </>
  );
}
