'use strict';

const _ = require('lodash');
const CONFIG_ENV = ((process || {}).env || {}).CONFIG_ENV || ((process || {}).env || {}).NODE_ENV;
const packageJson = require('../package.json');

let config = {
  packageName: packageJson.name,
  packageVersion: packageJson.version,
  port: 3000,
  isDev: true,
  isDebug: true,
  isLoadTest: false,
  isNextDev: true,
  diagnostic: require('./diagnostic'),
  nextPublic: {
    reduxPersist: true,
    backendEndpoint: '',
    xApiKey: '',
    firebase: {
      apiKey: 'AIzaSyBTQsaISHF7XliHsHZnqMmu_138uIYpXWk',
      authDomain: 'extreme-studio-3234f.firebaseapp.com',
      projectId: 'extreme-studio-3234f',
      storageBucket: 'extreme-studio-3234f.firebasestorage.app',
      messagingSenderId: '1048056868146',
      appId: '1:1048056868146:web:b8a21d4272f8a1a0233b2b',
    },
  },
};

const { DEBUG, TRACE, TRACE_STATUS, ERROR } = config.diagnostic;

function MapData(objConfig) {
  if (process.env.IS_DEV)
    objConfig.isDev = process.env.IS_DEV === 'true' || process.env.IS_DEV === true;
  if (process.env.IS_DEBUG)
    objConfig.isDebug = process.env.IS_DEBUG === 'true' || process.env.IS_DEBUG === true;
  if (process.env.IS_LOADTEST)
    objConfig.isLoadTest = process.env.IS_LOADTEST === 'true' || process.env.IS_LOADTEST === true;
  if (process.env.IS_NEXT_DEV)
    objConfig.isNextDev = process.env.IS_NEXT_DEV === 'true' || process.env.IS_NEXT_DEV === true;

  if (process.env.PUBLIC_BACKEND_URL)
    objConfig.nextPublic.backendEndpoint = process.env.PUBLIC_BACKEND_URL;
  if (process.env.API_KEY) objConfig.nextPublic.xApiKey = process.env.API_KEY;

  // firebase config
  if (process.env.PUBLIC_FIREBASE_API_KEY)
    objConfig.nextPublic.firebase.apiKey = process.env.PUBLIC_FIREBASE_API_KEY;
  if (process.env.PUBLIC_FIREBASE_AUTH_DOMAIN)
    objConfig.nextPublic.firebase.authDomain = process.env.PUBLIC_FIREBASE_AUTH_DOMAIN;
  if (process.env.PUBLIC_FIREBASE_PROJECT_ID)
    objConfig.nextPublic.firebase.projectId = process.env.PUBLIC_FIREBASE_PROJECT_ID;
  if (process.env.PUBLIC_FIREBASE_STORAGE_BUCKET)
    objConfig.nextPublic.firebase.storageBucket = process.env.PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID)
    objConfig.nextPublic.firebase.messagingSenderId =
      process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  if (process.env.PUBLIC_FIREBASE_APPID)
    objConfig.nextPublic.firebase.storageBucket = process.env.PUBLIC_FIREBASE_APPID;

  return objConfig;
}

switch (CONFIG_ENV) {
  case 'dev':
  case 'develop':
  case 'development': {
    config.port = 3442;
    config.isNextDev = true;
    require('dotenv').config({ path: 'config/.env' });
    config = MapData(config);
    break;
  }
  default: {
    ERROR(`########## Error :: NODE_ENV='${CONFIG_ENV}' No config value! ##########`);
    // process.exit(1);
    config.port = 3000;
    config = MapData(config);
  }
}

TRACE_STATUS(true, 'config: package version', config.packageVersion);
TRACE_STATUS(true, `config: NODE_ENV=${process.env.NODE_ENV}, CONFIG_ENV=${CONFIG_ENV}`);

Object.assign(global, { config });

module.exports = config;
