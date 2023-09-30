import { NextFunction, Response } from 'express';
import routePermissions from '../config/route.permission';
import wrapper from '../helpers/wrapper';
import { RequestWithUser } from './jwt-auth';

const permissionMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const route = req.originalUrl;
  const method = req.method;

  const config = (routePermissions as any)[route]?.[method];

  if (!config) {
    return next();
  }

  const userRoles = req.user || [];
  const hasPermission = userRoles.roles.some((userRole: any) => {
    return userRole.permissions.some((permission: any) => permission.key === config.permission);
  });

  if (
    !hasPermission ||
    !config.requiredRoles.some((requiredRoleKey: string) =>
      userRoles.roles.some((userRole: any) => userRole.key === requiredRoleKey)
    )
  ) {
    return wrapper.response(res, 'fail', null, 'Not allowed', 403);
  }
  next();
};

export default permissionMiddleware;
