'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FirebaseGuard from '@root/src/auth/guard/firebase-guard';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { auth } from 'src/firebase';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import services from 'src/store/service';
import { method_POST } from 'src/store/service/request-management';
import * as Yup from 'yup';
// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();
  const confirmPassword = useBoolean();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const watchAllField = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      try {
        await method_POST({
          url: `${services.signUp}`,
          data: {
            email: data.email,
            password: data.password,
          },
        });
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } catch (error) {
        console.error(error);
        onSnackbarAction(
          'error',
          error?.error?.data?.msg || error?.error?.data?.err || 'Register Fail.',
        );
      }
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

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

  return (
    <FirebaseGuard>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Register</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>
      <FormProvider methods={methods} onSubmit={onSubmit}>
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

          <RHFTextField
            name="confirmPassword"
            label="Confirm Password"
            type={confirmPassword.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={confirmPassword.onToggle} edge="end">
                    <Iconify
                      icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={
              !watchAllField.email ||
              !watchAllField.password ||
              !watchAllField.confirmPassword ||
              watchAllField.password !== watchAllField.confirmPassword
            }
          >
            Continue
          </LoadingButton>
        </Stack>
      </FormProvider>
    </FirebaseGuard>
  );
}
