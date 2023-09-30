import {
  PERMISSION_CATRA_CREATE_USER,
  PERMISSION_CATRA_DETAIL_USER,
  PERMISSION_CATRA_SHOW_USER,
  PERMISSION_CATRA_UPDATE_USER
} from '../constants/permission';

export interface RoutePermissionConfig {
  [method: string]: {
    permission: string;
    requiredRoles: string[];
  };
}

const routePermissions: Record<string, RoutePermissionConfig> = {
  '/user': {
    GET: {
      permission: PERMISSION_CATRA_SHOW_USER,
      requiredRoles: ['superadmin', 'admin-school', 'admin-dudi']
    },
    POST: {
      permission: PERMISSION_CATRA_CREATE_USER,
      requiredRoles: ['superadmin', 'admin-school', 'admin-dudi']
    }
  },
  '/user/:userId': {
    GET: {
      permission: PERMISSION_CATRA_DETAIL_USER,
      requiredRoles: ['superadmin', 'admin-school', 'admin-dudi']
    },
    PUT: {
      permission: PERMISSION_CATRA_UPDATE_USER,
      requiredRoles: ['superadmin', 'admin-school', 'admin-dudi']
    },
    DELETE: {
      permission: PERMISSION_CATRA_UPDATE_USER,
      requiredRoles: ['superadmin', 'admin-school', 'admin-dudi']
    }
  }
};

export default routePermissions;
