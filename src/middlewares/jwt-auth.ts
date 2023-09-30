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

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // If not found in the header, check the accessToken cookie
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    // If still not found, return unauthorized
    if (!token) {
      return wrapper.response(res, 'fail', null, 'Unauthorized', 401);
    }

    // Verify the token
    const decoded = jwt.verify(token, jwt_secret) as JwtPayload;
    (req as RequestWithUser).userId = decoded.userId;

    // Fetch user data using Prisma
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId
      }
    });
    (req as RequestWithUser).user = user;

    next();
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Unauthorized', 401);
  }
};

export default { generateToken, verifyToken };
