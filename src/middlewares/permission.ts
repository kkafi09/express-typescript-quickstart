import { Permission } from '@prisma/client';
import { NextFunction, Response } from 'express';
import routePermissions, { RoutePermissionConfig } from '../config/route.permission';
import wrapper from '../helpers/wrapper';
import { RequestWithUser } from './jwt-auth';

const permissionMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const route = req.originalUrl;
  const config = (routePermissions as unknown as Record<string, RoutePermissionConfig>)[route];

  if (!config) {
    return next();
  }

  const userRoles = (req.user as any).roles || [];
  const hasPermission = userRoles.some((role: any) =>
    role.permissions.some((permission: Permission) => permission.key === config.permission)
  );

  if (!hasPermission || !config.requiredRoles.some((role) => userRoles.includes(role))) {
    return wrapper.response(res, 'fail', null, 'Not allowed', 403);
  }

  next();
};

export default permissionMiddleware;
