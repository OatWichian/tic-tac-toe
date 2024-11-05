'use client';

import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import axios, { endpoints } from 'src/utils/axios';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

import * as Actions from '@actions';
import { useDispatch } from 'react-redux';
// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const dispatchRedux = useDispatch();
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        const headers = {
          'Content-Type': 'application/json',
          'x-api-key': publicRuntimeConfig.config.xApiKey,
          'x-auth-admin-signature': publicRuntimeConfig.config.xAuthAdminSignature,
          'x-streaming-signature': accessToken,
          'x-auth-admin-signature': accessToken
        };
        const response = await axios.get(`${publicRuntimeConfig.config.backendEndpoint}/api/!admin/v1/auth/profile`, {
          headers,
        });

        const { data } = response.data;
        const user = { ...data, token: accessToken };

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
        dispatchRedux(Actions.intiUserInfo(user));
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': publicRuntimeConfig.config.xApiKey,
      'x-auth-admin-signature': publicRuntimeConfig.config.xAuthAdminSignature,
    };
    const response = await axios.post(
      `${publicRuntimeConfig.config.backendEndpoint}/api/auth/login`,
      { email, password },
      { headers }
    );

    const user = response.data.data;

    setSession(user.token);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
    dispatchRedux(Actions.intiUserInfo(user));
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
    dispatchRedux(Actions.clearUserInfo());
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
