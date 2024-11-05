import { alpha, styled, useTheme } from '@mui/material/styles';
//icon
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
//
import { Box, Stack, Button } from '@mui/material';

const SidebarPreview = ({ previewType, setPreviewType }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        mt: 12,
      }}
    >
      <Stack direction="row" gap={1} sx={{ ml: 3, backgroundColor: '#FFF', p: 1, borderRadius: 1 }}>
        <ButtonPreview active={previewType == 'DESKTOP'} onClick={() => setPreviewType('DESKTOP')}>
          <PersonalVideoIcon />
        </ButtonPreview>
        <ButtonPreview active={previewType == 'MOBILE'} onClick={() => setPreviewType('MOBILE')}>
          <PhoneIphoneIcon />
        </ButtonPreview>
      </Stack>
    </Box>
  );
};

const ButtonPreview = styled(Button)(({ theme, active }) => ({
  minWidth: 'auto',
  ...(active && {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  }),
}));

export default SidebarPreview;
