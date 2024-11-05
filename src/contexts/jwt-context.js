import { createContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '@actions/index';

// mui
import LoadingScreen from '@components/loading-screen';

// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import getConfig from 'next/config';

// libs
import _ from 'lodash';
import useSettings from '../hooks/use-settings';

// ----------------------------------------------------------------------

const { publicRuntimeConfig } = getConfig();
const BACKEND_ENDPOINT = publicRuntimeConfig.config.backendEndpoint;
const headers = {
  'Content-Language': 'th',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'x-api-key': publicRuntimeConfig.config.xApiKey,
};
const timeout = 60000;
const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  isSessionDestroy: false,
  user: null,
};
const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    isSessionDestroy: true,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { userData } = useSelector(({ userInfo }) => userInfo);
  const [isReady, setIsReady] = useState(false);
  const dispatchRedux = useDispatch();
  const { setColor } = useSettings();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        console.log("accessToken: ", accessToken);
        if (accessToken && isValidToken(accessToken)) {
          if (!_.isEmpty(userData)) {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user: userData,
              },
            });
            // dispatchRedux(Actions.intiUserInfo({ ...userData }));
            setIsReady(true);
            return;
          }

          headers['x-streaming-signature'] = accessToken;
          headers['x-auth-admin-signature'] = accessToken;
          const response = await axios({
            url: `${BACKEND_ENDPOINT}/api/!admin/v1/auth/profile`,
            method: 'GET',
            headers,
            timeout,
            dataType: 'json',
          });

          const { data } = response.data;
          delete data.id;
          const user = { ...data, token: accessToken };
          // dispatchRedux(Actions.intiUserInfo(user));
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          console.log("in::");
          setSession(null);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        setSession(null);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
      setIsReady(true);
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': publicRuntimeConfig.config.xApiKey,
      'x-auth-admin-signature': publicRuntimeConfig.config.xAuthAdminSignature,
    };
    const response = await axios.post(
      `${publicRuntimeConfig.config.backendEndpoint}/api/auth/login`,
      { email, password },
      { headers },
    );

    const { token, themeLand } = response.data.data;
    setSession(token);
    dispatch({
      type: 'LOGIN',
      payload: {
        user: response.data.data,
      },
    });

    // dispatchRedux(Actions.intiUserInfo(response.data.data));
    // if (themeLand?.theme_detail) {
    //   setColor({
    //     lighter: '',
    //     light: '',
    //     main: themeLand.theme_detail.primary,
    //     dark: '',
    //     darker: '',
    //     contrastText: '',
    //     name: '',
    //   });
    // }
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    // dispatchRedux(Actions.clearUserInfo());
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = () => {};

  const updateProfile = () => {};

  return !isReady ? (
    <LoadingScreen isLoading={!isReady} />
  ) : (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
