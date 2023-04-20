import { PrismaClient, User } from '@prisma/client';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import wrapper from '../helpers/wrapper';

dotenv.config();

const jwt_secret = process.env.JWT_SECRET ?? 'secret';
const prisma = new PrismaClient();

export interface RequestWithUser extends Request {
  userId?: number;
  user?: User | null;
}

const generateToken = (userId: Number) => {
  const token = jwt.sign({ userId }, jwt_secret, { expiresIn: '3h' });
  return token;
};

const verifyToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, jwt_secret as string) as JwtPayload;
    (req as RequestWithUser).userId = decoded.userId;

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId
      }
    });
    (req as RequestWithUser).user = user;

    next();
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Please Authenticate', 401);
  }
};

export default { generateToken, verifyToken };
