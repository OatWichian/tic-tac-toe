import axios from 'axios';
import getConfig from 'next/config';
import { SESSION_STORAGE_ITEMS } from 'src/config-global';

const { publicRuntimeConfig } = getConfig();

const headers = {
  'Content-Language': 'th',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'x-api-key': publicRuntimeConfig.config.xApiKey,
  'x-company': publicRuntimeConfig.config.jnzAuthConfig?.jnzCompanyToken,
  'x-web-token': publicRuntimeConfig.config.jnzAuthConfig?.jnzWebXToken,
};
const timeout = 60000;

export const method_GET = async ({ url, params, token, land_uuid }) => {
  if (token) {
    headers['authorization'] = token;
  }

  if (land_uuid) {
    headers.land_uuid = land_uuid;
  }

  const request = axios.get(url, { headers, params, timeout });

  return request
    .then((response) => successHandler(response))
    .catch((error) => {
      console.error('[API] GET Failure', errorHandler(error));
      throw errorHandler(error);
    });
};

export const method_POST = async ({ url, data, token, land_uuid, upload = false }) => {
  if (token) {
    headers['authorization'] = token;
  }
  if (upload) headers['Content-Type'] = 'multipart/form-data';

  if (land_uuid) {
    headers.land_uuid = land_uuid;
  }

  const request = axios.post(url, data, { headers, timeout });

  return request
    .then((response) => successHandler(response))
    .catch((error) => {
      console.error('[API] POST Failure', { error });
      throw errorHandler(error);
    });
};

export const method_PUT = async ({ url, data, token, land_uuid }) => {
  if (token) {
    headers['authorization'] = token;
  }

  if (land_uuid) {
    headers.land_uuid = land_uuid;
  }

  const request = axios.put(url, data, { headers, timeout });

  return request
    .then((response) => successHandler(response))
    .catch((error) => {
      console.error('[API] PUT Failure', error);
      throw errorHandler(error);
    });
};

export const method_DELETE = async ({ url, token, params, land_uuid }) => {
  if (token) {
    headers['authorization'] = token;
  }

  if (land_uuid) {
    headers.land_uuid = land_uuid;
  }

  const request = axios.delete(url, { headers, params, timeout });

  return request
    .then((response) => successHandler(response))
    .catch((error) => {
      console.error('[API] DELETE Failure', error);
      throw errorHandler(error);
    });
};

function successHandler(result) {
  const { status, data: innerData } = result;
  const { code, msg, data } = innerData;

  return {
    success: true,
    data: data || innerData,
    status,
    code,
    msg,
  };
}

function errorHandler(error) {
  const { response, message } = error;

  return {
    error: {
      success: false,
      status: response?.status,
      data: response?.data,
      err: message,
    },
  };
}

const getIdToken = async () => {
  const token = sessionStorage.getItem(SESSION_STORAGE_ITEMS.accessToken);
  return `Bearer ${token}`;
};

export default { method_GET, method_POST, method_PUT, method_DELETE, getIdToken };
