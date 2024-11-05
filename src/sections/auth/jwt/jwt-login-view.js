'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Divider, useTheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FirebaseGuard from '@root/src/auth/guard/firebase-guard';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { auth } from 'src/firebase';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

const SOCIAL_LIST = ['gmail'];
const AUTH_PROVIDER = {
  gmail: new GoogleAuthProvider(),
  facebook: new FacebookAuthProvider(),
};

export default function JwtLoginView() {
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      console.error(error);
      onSnackbarAction('error', 'Invalid User Password.');
    }
  });

  const handelSigninSocial = async (provider) => {
    try {
      await signInWithPopup(auth, AUTH_PROVIDER[provider]);
    } catch (error) {
      console.error(error);
      onSnackbarAction('error', 'Invalid User Password.');
    }
  };

  const onSnackbarAction = (color, message) => {
    enqueueSnackbar(`${message}`, {
      variant: color,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      action: () => (
        <IconButton
          aria-label="close"
          onClick={() => closeSnackbar()}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[900],
          }}
        >
          <CloseIcon />
        </IconButton>
      ),
    });
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <FirebaseGuard>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHead}
        {renderForm}
        <br />
        <Stack gap={2}>
          <Divider>
            <Typography color={theme.palette.text.disabled} fontWeight={500}>
              Continue with Social
            </Typography>
          </Divider>
          <Stack gap={1} justifyContent="center" alignItems="center">
            {SOCIAL_LIST.map((val, idx) => (
              <Button
                key={idx}
                variant="outlined"
                onClick={() => handelSigninSocial(val)}
                sx={{ px: 2, borderRadius: 5, width: 230 }}
              >
                <Stack gap={1} direction="row" alignItems="center">
                  <img src={`/assets/images/social/${val}-logo.png`} width={16} />
                  <Typography variant="body2">Login with {_.capitalize(val)}</Typography>
                </Stack>
              </Button>
            ))}
          </Stack>
        </Stack>
      </FormProvider>
    </FirebaseGuard>
  );
}
