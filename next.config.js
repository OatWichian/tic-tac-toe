// const withTM = require('next-transpile-modules')([
//   '@fullcalendar/common',
//   '@fullcalendar/daygrid',
//   '@fullcalendar/interaction',
//   '@fullcalendar/list',
//   '@fullcalendar/react',
//   '@fullcalendar/timegrid',
//   '@fullcalendar/timeline',
// ]);
const _ = require('lodash');
const { v1: UuidV1 } = require('uuid');
const Moment = require('moment');
const config = require('./config');
const { TRACE_STATUS } = config.diagnostic;
const CONFIG_ENV = (process.env.CONFIG_ENV || process.env.NODE_ENV).toLowerCase();
let isDev = true;
console.log('CONFIG_ENV', CONFIG_ENV);
if (['jnzdev', 'predev', 'stg', 'staging', 'uat', 'loadtest', 'prod', 'production'].includes(CONFIG_ENV)) {
  isDev = false;
}

TRACE_STATUS(true, `next.config: NODE_ENV=${process.env.NODE_ENV}, CONFIG_ENV=${process.env.CONFIG_ENV}, isDev=${isDev}`);

const baseConfig = {
  IS_DEV: isDev,
  IS_DEBUG: (config.isDebug || !['predev', 'stg', 'staging', 'uat', 'loadtest', 'prod', 'production'].includes(CONFIG_ENV)),
  NODE_ENV: process.env.NODE_ENV,
  CONFIG_ENV: CONFIG_ENV,
  APP_NAME: config.packageName,
  APP_VERSION: config.packageVersion,
  APP_UUID: UuidV1(),
  APP_START: Moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
};

/*Line Notify*/
if (process.env.CONFIG_ENV && config.isLineNotify && process.env.LINE_NOTIFY && process.env.LINE_NOTIFY.length > 0) {
  const LineAPI = require('line-api');
  const Notify = new LineAPI.Notify({ token: process.env.LINE_NOTIFY });
  const MemoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
  let msgStart =
    `SERVER_START: ${baseConfig.APP_NAME}
APP_NAME: ${baseConfig.APP_NAME}
APP_VERSION: ${baseConfig.APP_VERSION}
APP_UUID: ${baseConfig.APP_UUID}
APP_START: ${baseConfig.APP_START}
NODE_ENV: ${baseConfig.NODE_ENV}
CONFIG_ENV: ${baseConfig.CONFIG_ENV}
MEMORY_USED: ${Math.round(MemoryUsed * 100) / 100} MB
`;
  Notify.send({
    message: msgStart,
  }).then((_status) => {
    TRACE_STATUS(true, 'notify.send server status', JSON.stringify(_status));
  }).catch((ex) => {
    ERROR('Error notify.send', ex);
  });
}

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: false,
  jsconfigPaths: true,
  trailingSlash: true,
  env: Object.assign({}, _.pick(baseConfig, ['isDev', 'CONFIG_ENV', 'APP_NAME', 'APP_VERSION', 'APP_UUID', 'APP_START', 'IS_DEBUG'])),
  serverRuntimeConfig: Object.assign({}, baseConfig, { config: config }),
  publicRuntimeConfig: Object.assign({}, baseConfig, { config: config.nextPublic }),
  generateBuildId: async () => {
    return config.packageVersion;
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  async rewrites() {
    return [
      { source: '/ssr/info', destination: '/api/ssr/info' },
    ];
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=30, must-revalidate',
          },
        ],
      },
      {
        source: '/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache no-store',
          },
        ],
      },
    ];
  },
};

module.exports =  nextConfig;
    

