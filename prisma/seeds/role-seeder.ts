import { PrismaClient } from '@prisma/client';
import {
  PERMISSION_CATRA_CREATE_USER,
  PERMISSION_CATRA_DELETE_USER,
  PERMISSION_CATRA_DETAIL_USER,
  PERMISSION_CATRA_SHOW_USER,
  PERMISSION_CATRA_UPDATE_USER
} from '../../src/constants/permission';

const permissions = [
  PERMISSION_CATRA_SHOW_USER,
  PERMISSION_CATRA_CREATE_USER,
  PERMISSION_CATRA_DELETE_USER,
  PERMISSION_CATRA_DETAIL_USER,
  PERMISSION_CATRA_UPDATE_USER
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
