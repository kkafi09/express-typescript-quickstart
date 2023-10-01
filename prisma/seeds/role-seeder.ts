import { PrismaClient } from '@prisma/client';
import {
  PERMISSION_BACKOFFICE_CREATE_PERMISSION,
  PERMISSION_BACKOFFICE_CREATE_ROLE,
  PERMISSION_BACKOFFICE_CREATE_USER,
  PERMISSION_BACKOFFICE_DELETE_ROLE,
  PERMISSION_BACKOFFICE_DELETE_USER,
  PERMISSION_BACKOFFICE_DETAIL_ROLE,
  PERMISSION_BACKOFFICE_DETAIL_USER,
  PERMISSION_BACKOFFICE_SHOW_ROLE,
  PERMISSION_BACKOFFICE_SHOW_USER,
  PERMISSION_BACKOFFICE_UPDATE_ROLE,
  PERMISSION_BACKOFFICE_UPDATE_USER
} from '../../src/constants/permission';

const permissions = [
  PERMISSION_BACKOFFICE_SHOW_USER,
  PERMISSION_BACKOFFICE_CREATE_USER,
  PERMISSION_BACKOFFICE_DELETE_USER,
  PERMISSION_BACKOFFICE_DETAIL_USER,
  PERMISSION_BACKOFFICE_UPDATE_USER,

  PERMISSION_BACKOFFICE_SHOW_ROLE,
  PERMISSION_BACKOFFICE_CREATE_ROLE,
  PERMISSION_BACKOFFICE_DELETE_ROLE,
  PERMISSION_BACKOFFICE_DETAIL_ROLE,
  PERMISSION_BACKOFFICE_UPDATE_ROLE
];

const prisma = new PrismaClient();

const createPermission = async () => {
  for (const permission of permissions) {
    try {
      const name = permission.split('-').join(' ').toUpperCase();

      await prisma.permission.create({
        data: {
          name,
          key: permission
        }
      });
    } catch (error) {
      console.error(`Error creating permission ${permission}:`, error);
    }
  }
};

export default createPermission;
