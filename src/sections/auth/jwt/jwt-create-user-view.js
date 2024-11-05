'use client';

import * as Actions from '@actions';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { SESSION_STORAGE_ITEMS } from 'src/config-global';
import { auth } from 'src/firebase';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import services from 'src/store/service';
import { method_POST } from 'src/store/service/request-management';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function CreateUserView() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [firebaseToken, setFirebaseToken] = useState('');

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    imageUrl: Yup.string().optional(),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    imageUrl: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const resp = await method_POST({
        url: `${services.createAccount}`,
        token: `Bearer ${sessionStorage.getItem(SESSION_STORAGE_ITEMS.accessToken)}`,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          imageUrl: data.imageUrl,
        },
      });

      if (resp.success) {
        router.push(paths.dashboard.game.ticTacToe);
      }
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    } finally {
      const dataToken = await generateToken(firebaseToken);
      if (dataToken?.accessToken) {
        sessionStorage.setItem(SESSION_STORAGE_ITEMS.accessToken, dataToken.accessToken);

        dispatch(Actions.fetchUserInfo());
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_ITEMS.accessToken);
      }
    }
  });

  const generateToken = async (token) => {
    const resp = await method_POST({
      url: `${services.generateToken}`,
      token,
      data: {},
    });
    return resp.success ? resp.data : null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user.displayName) {
        setValue('firstName', user.displayName.split(' ')?.[0] || '');
        setValue('lastName', user.displayName.split(' ')?.[1] || '');
      }
      if (user.photoURL) {
        setValue('imageUrl', user.photoURL);
      }
      setValue('email', user.email);
      setFirebaseToken(await user?.getIdToken());
    });

    return () => unsubscribe();
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Create User</Typography>
      </Stack>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email address" disabled={true} />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Create account
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
