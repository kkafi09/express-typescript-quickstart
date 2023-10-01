import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import wrapper from '../helpers/wrapper';

const prisma = new PrismaClient();

const createRole = async (req: Request, res: Response) => {
  const { name, key } = req.body;
  try {
    const role = await prisma.role.create({
      data: {
        name,
        key
      }
    });
    const result = wrapper.data(role);

    return wrapper.response(res, 'success', result, 'Role created successfully', 201);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to create role', 500);
  }
};

const updateRole = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId);
  const { name, key } = req.body;

  try {
    const role = await prisma.role.update({
      where: { id: roleId },
      data: {
        name,
        key
      }
    });
    const result = wrapper.data(role);

    return wrapper.response(res, 'success', result, 'Role updated successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to update role', 500);
  }
};

const deleteRole = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId);

  try {
    await prisma.role.delete({
      where: { id: roleId }
    });

    return wrapper.response(res, 'success', null, 'Role deleted successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to delete role', 500);
  }
};

const getRoleById = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId);

  try {
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });
    const result = wrapper.data(role);

    return wrapper.response(res, 'success', result, 'Role retrieved successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to retrieve role', 500);
  }
};

const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany();
    const result = wrapper.data(roles);

    return wrapper.response(res, 'success', result, 'Roles retrieved successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to retrieve roles', 500);
  }
};

export default { createRole, updateRole, deleteRole, getRoleById, getAllRoles };
