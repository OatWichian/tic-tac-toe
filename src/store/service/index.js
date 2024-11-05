import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const BACKEND_ENDPOINT = publicRuntimeConfig.config.backendEndpoint;

export default {
  signUp: `${BACKEND_ENDPOINT}/v1/api/auth/firebase/sign-up`,
  generateToken: `${BACKEND_ENDPOINT}/v1/api/auth/service/token`,
  createAccount: `${BACKEND_ENDPOINT}/v1/api/auth/register`,
  profile: `${BACKEND_ENDPOINT}/v1/api/profile`,
  game: `${BACKEND_ENDPOINT}/v1/api/game`,
};
