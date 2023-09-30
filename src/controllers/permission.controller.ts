import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import wrapper from '../helpers/wrapper';

const prisma = new PrismaClient();

const createPermission = async (req: Request, res: Response) => {
  const { name, key } = req.body;

  try {
    const permission = await prisma.permission.create({
      data: {
        name,
        key
      }
    });
    const result = wrapper.data(permission);

    return wrapper.response(res, 'success', result, 'Permission created successfully', 201);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to create permission', 500);
  }
};

const updatePermission = async (req: Request, res: Response) => {
  const permissionId = parseInt(req.params.id);
  const { name, key } = req.body;

  try {
    const permission = await prisma.permission.update({
      where: { id: permissionId },
      data: {
        name,
        key
      }
    });
    const result = wrapper.data(permission);

    return wrapper.response(res, 'success', result, 'Permission updated successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to update permission', 500);
  }
};

const deletePermission = async (req: Request, res: Response) => {
  try {
    const permissionId = parseInt(req.params.id);

    await prisma.permission.delete({
      where: { id: permissionId }
    });

    return wrapper.response(res, 'success', null, 'Permission deleted successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to delete permission', 500);
  }
};

const getPermissionById = async (req: Request, res: Response) => {
  try {
    const permissionId = parseInt(req.params.id);
    const permission = await prisma.permission.findUnique({
      where: { id: permissionId }
    });
    const result = wrapper.data(permission);

    return wrapper.response(res, 'success', result, 'Permission retrieved successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to retrieve permission', 500);
  }
};

const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission.findMany();

    const result = wrapper.data(permissions);

    return wrapper.response(res, 'success', result, 'Permissions retrieved successfully', 200);
  } catch (error: any) {
    return wrapper.response(res, 'fail', error, 'Failed to retrieve permissions', 500);
  }
};

export default { createPermission, updatePermission, deletePermission, getPermissionById, getAllPermissions };
