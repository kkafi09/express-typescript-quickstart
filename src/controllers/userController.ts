import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import wrapper from '../helpers/wrapper';
import jwtAuth from '../middlewares/jwtAuth';

dotenv.config();

const prisma = PrismaClient();

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: 'Invalid Credentials'
      });
    }

    const token = jwtAuth.generateToken(user.id);

    return res.status(200).json({
      status: true,
      data: { user, token },
      message: 'Successfully login'
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

const register = async (req: Request, res: Response) => {
  const { name, username, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      const error = new Error('User with this email already exists');
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role
      }
    });

    const token = jwtAuth.generateToken(user.id);

    const result = {
      data: {
        user,
        token
      }
    };

    return wrapper.response(res, 'success', result, 'Success register', 201);
  } catch (error) {
    return wrapper.errorResponse(res, error, 'Error register', 500);
  }
};

export default { login, register };
