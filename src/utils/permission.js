import { paths } from '@routes/paths';
import _ from 'lodash';

const defalutPermissions = [
  // { url: paths.dashboard.crm.surveyList, permission: 'read' },
];

export const hasPermission = (url, permissions = defalutPermissions, action = 'read') => {
  if (!url || _.isEmpty(permissions)) {
    return false;
  }

  return !!permissions.some((permissionObj) => {
    if (!permissionObj?.url || !permissionObj?.permission) {
      return false;
    }

    if (permissionObj.url === '/dashboard' || permissionObj.url === '/dashboard/') {
      return url === permissionObj.url;
    }

    return url.includes(permissionObj.url) && permissionObj.permission === action;
  });
};

export const replaceBindingUrlByKey = (url, key, value) => {
  if (!url || typeof url !== 'string' || !key) return url;

  if (url.includes(key)) {
    return url.replaceAll(key, value);
  }

  return url;
};
