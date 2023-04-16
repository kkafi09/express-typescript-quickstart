import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwt_secret = 'secret';

export interface RequestWithUser extends Request {
  user?: number;
}

function generateToken(userId: Number) {
  const token = jwt.sign({ userId }, jwt_secret, { expiresIn: '3h' });
  return token;
}

function verifyToken(req: RequestWithUser, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, jwt_secret as string) as JwtPayload;
    (req as RequestWithUser).user = decoded.userId;

    console.log('decoded', decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Please Authenticate' });
  }
}

export default { generateToken, verifyToken };
