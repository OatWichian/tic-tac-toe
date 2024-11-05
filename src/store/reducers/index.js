import getConfig from 'next/config';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { reducer as gameReducer } from './game';
import { reducer as userInfoReducer } from './user-info';

const { publicRuntimeConfig } = getConfig();

const userInfoPersistConfig = {
  key: 'userInfo',
  storage,
};

const rootReducer = {
  userInfo: publicRuntimeConfig.config.reduxPersist
    ? persistReducer(userInfoPersistConfig, userInfoReducer)
    : userInfoReducer,
  game: gameReducer,
};

export default rootReducer;
