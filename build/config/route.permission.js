"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permission_1 = require("../constants/permission");
const routePermissions = {
  '/user': {
    GET: {
      permission: permission_1.PERMISSION_BACKOFFICE_SHOW_USER,
      requiredRoles: ['superadmin', 'admin-school', 'admin-dudi']
    },
    POST: {
      permission: permission_1.PERMISSION_BACKOFFICE_CREATE_USER,
      requiredRoles: ['superadmin', 'admin-school', 'admin-dudi']
    }
  },
  '/user/:userId': {
    GET: {
      permission: permission_1.PERMISSION_BACKOFFICE_DETAIL_USER,
      requiredRoles: ['superadmin', 'admin-school', 'admin-dudi']
    },
    PUT: {
      permission: permission_1.PERMISSION_BACKOFFICE_UPDATE_USER,
      requiredRoles: ['superadmin', 'admin-school', 'admin-dudi']
    },
    DELETE: {
      permission: permission_1.PERMISSION_BACKOFFICE_UPDATE_USER,
      requiredRoles: ['superadmin', 'admin-school', 'admin-dudi']
    }
  }
};
exports.default = routePermissions;
//# sourceMappingURL=route.permission.js.map