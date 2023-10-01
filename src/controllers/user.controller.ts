import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import wrapper from '../helpers/wrapper';
import jwtAuth, { RequestWithUser } from '../middlewares/jwt-auth';

const prisma = new PrismaClient();

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return wrapper.response(res, 'fail', null, 'Invalid username and password', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return wrapper.response(res, 'fail', null, 'Invalid username and password', 400);
    }

    const token = jwtAuth.generateToken(user.id);
    const result = wrapper.data({ user, token });

    res.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000
    });

    return wrapper.response(res, 'success', result, 'Success Login', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to login', 500);
  }
};

const register = async (req: Request, res: Response) => {
  const { name, username, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return wrapper.response(res, 'fail', null, 'User with this username already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        roles: {
          create: role.map((roleId: number) => ({
            roleId
          }))
        }
      }
    });

    const token = jwtAuth.generateToken(user.id);
    const result = wrapper.data({ user, token });

    return wrapper.response(res, 'success', result, 'Success register', 201);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Error register', 500);
  }
};

const whoAmI = async (req: RequestWithUser, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return wrapper.response(res, 'fail', null, 'Token not provided', 500);
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      include: {
        roles: true
      }
    });
    const result = wrapper.data({ user });
    return wrapper.response(res, 'success', result, 'Success get User Auth', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Error get user Auth', 500);
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, phone_number } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password,
        phone_number
      }
    });
    return wrapper.response(res, 'success', { data: user }, 'User created successfully', 201);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to create user', 500);
  }
};

const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  try {
    const { name, username, email, password, phone_number } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        email,
        password,
        phone_number
      }
    });
    return wrapper.response(res, 'success', { data: user }, 'User updated successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to update user', 500);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    return wrapper.response(res, 'success', null, 'User deleted successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to delete user', 500);
  }
};

const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    const result = wrapper.data(user);

    return wrapper.response(res, 'success', result, 'User retrieved successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to retrieve user', 500);
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return wrapper.response(res, 'success', { data: users }, 'Users retrieved successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to retrieve users', 500);
  }
};

export default { login, register, whoAmI, createUser, updateUser, deleteUser, getAllUsers, getUserById };
