import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import wrapper from '../helpers/wrapper';
import jwtAuth, { RequestWithUser } from '../middlewares/jwtAuth';

const prisma = new PrismaClient();

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return wrapper.errorResponse(res, user, 'Invalid username and password', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return wrapper.errorResponse(res, user, 'Invalid username and password', 400);
    }

    const token = jwtAuth.generateToken(user.id);
    const result = wrapper.data({ user, token });

    return wrapper.response(res, 'success', result, 'Success Login', 200);
  } catch (error) {
    return wrapper.errorResponse(res, error, 'Failed to login', 500);
  }
};

const register = async (req: Request, res: Response) => {
  const { name, username, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return wrapper.errorResponse(res, existingUser, 'User with this username already exists', 409);
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
    if (!user) {
      return wrapper.errorResponse(res, user, 'Failed to register user', 400);
    }

    const token = jwtAuth.generateToken(user.id);
    const result = wrapper.data({ user, token });

    return wrapper.response(res, 'success', result, 'Success register', 201);
  } catch (error) {
    return wrapper.errorResponse(res, error, 'Error register', 500);
  }
};

const getUser = async (req: RequestWithUser, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return wrapper.errorResponse(res, null, 'token not provided', 500);
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });
    const result = {
      data: {
        user
      }
    };
    return wrapper.response(res, 'success', result, 'Success get User Auth', 201);
  } catch (error) {
    return wrapper.errorResponse(res, error, 'Error get user Auth', 500);
  }
};

export default { login, register, getUser };