import * as Actions from '@actions';
import { SplashScreen } from '@root/src/components/loading-screen';
import { onAuthStateChanged } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SESSION_STORAGE_ITEMS } from 'src/config-global';
import { auth } from 'src/firebase';
import { paths } from 'src/routes/paths';
import services from 'src/store/service';
import { method_POST } from 'src/store/service/request-management';

export default function FirebaseGuard({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [init, setInit] = useState(false);

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
      console.log('pathname :>> ', pathname);
      console.log('user :>> ', user);

      const firebaseToken = user?._delegate?.accessToken || (await user?.getIdToken());
      let actionTo = '';
      if (firebaseToken) {
        const dataToken = await generateToken(`Bearer ${firebaseToken}`);

        if (dataToken?.accessToken) {
          sessionStorage.setItem(SESSION_STORAGE_ITEMS.accessToken, dataToken.accessToken);
        } else {
          sessionStorage.removeItem(SESSION_STORAGE_ITEMS.accessToken);
        }

        if (dataToken?.action) {
          actionTo = dataToken.action;
        }

        if (dataToken?.authorizationCode) {
          authorizationCode = dataToken.authorizationCode;
        }
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_ITEMS.accessToken);
      }

      // validate
      const accessToken = sessionStorage.getItem(SESSION_STORAGE_ITEMS.accessToken);
      const validate = accessToken && !!user;
      if (validate) {
        if (actionTo === 'create_user') {
          router.replace(paths.auth.jwt.createUser);
        } else {
          router.push(paths.dashboard.game.ticTacToe);
        }
        dispatch(Actions.fetchUserInfo());
      } else if (!validate && !pathname.startsWith(paths.auth.jwt.register)) {
        router.replace('/');
      }

      setTimeout(() => {
        setInit(true);
      }, 1000);
    });

    return () => unsubscribe();
  }, []);

  return <>{!init ? <SplashScreen /> : children}</>;
}
