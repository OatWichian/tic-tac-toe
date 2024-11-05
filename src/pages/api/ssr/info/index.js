import getConfig from 'next/config';

const { serverRuntimeConfig/*, publicRuntimeConfig */} = getConfig();
/*console.info(`(api/ssr/info) serverRuntimeConfig:`, serverRuntimeConfig);
console.info('(api/ssr/info) publicRuntimeConfig', publicRuntimeConfig);*/

export default function handler(req, res) {
  const MemoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
  let resData = {
    APP_NAME: serverRuntimeConfig.APP_NAME,
    APP_VERSION: serverRuntimeConfig.APP_VERSION,
    APP_UUID: serverRuntimeConfig.APP_UUID,
    APP_START: serverRuntimeConfig.APP_START,
    NODE_ENV: serverRuntimeConfig.NODE_ENV,
    CONFIG_ENV: serverRuntimeConfig.CONFIG_ENV,
    MEMORY_USED: `${Math.round(MemoryUsed * 100) / 100} MB`,
  };
  res.status(200).json(resData);
}
