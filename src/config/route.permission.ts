export interface RoutePermissionConfig {
  permission: string;
  requiredRoles: string[];
}

const routePermissions: Record<string, RoutePermissionConfig> = {
  '/secured': {
    permission: 'some_permission_key',
    requiredRoles: ['admin', 'user']
  }
};

export default routePermissions;
