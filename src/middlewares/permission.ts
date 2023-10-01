import { NextFunction, Response } from 'express';
import wrapper from '../helpers/wrapper';
import { RequestWithUser } from './jwt-auth';

const authGuard = (permission: string) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userRoles = req.user || [];

    const hasPermission = userRoles.roles.some((userRole: any) => {
      return userRole.permissions.some((p: any) => p.key === permission);
    });

    if (!hasPermission) {
      return wrapper.response(res, 'fail', null, 'Forbidden access', 403);
    }
  };
};

export default authGuard;
