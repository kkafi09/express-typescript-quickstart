import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwt_secret = 'secret';

export interface CustomRequest extends Request {
  userId: string | JwtPayload;
}

function generateToken(userId: Number) {
  const token = jwt.sign({ userId }, jwt_secret, { expiresIn: '3h' });
  return token;
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, jwt_secret);
    (req as CustomRequest).userId = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Please Authenticate' });
  }
}

export default { generateToken, verifyToken };
