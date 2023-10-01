import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  PERMISSION_BACKOFFICE_CREATE_USER,
  PERMISSION_BACKOFFICE_DELETE_USER,
  PERMISSION_BACKOFFICE_DETAIL_USER,
  PERMISSION_BACKOFFICE_SHOW_USER,
  PERMISSION_BACKOFFICE_UPDATE_USER
} from '../../src/constants/permission';

const prisma = new PrismaClient();

const permissionKeys = [
  PERMISSION_BACKOFFICE_SHOW_USER,
  PERMISSION_BACKOFFICE_CREATE_USER,
  PERMISSION_BACKOFFICE_DELETE_USER,
  PERMISSION_BACKOFFICE_DETAIL_USER,
  PERMISSION_BACKOFFICE_UPDATE_USER
];

const createSuperAdmin = async () => {
  const adminRole = await prisma.role.create({ data: { name: 'Super Admin', key: 'superadmin' } });
  const adminUser = await prisma.user.create({
    data: {
      name: 'Super Admin',
      username: 'superadmin',
      email: 'superadmin@admin.com',
      password: bcrypt.hashSync('admin123', 10),
      phone_number: '1234567890'
    }
  });

  await prisma.roleUser.create({
    data: {
      role: {
        connect: {
          id: adminRole.id
        }
      },
      user: {
        connect: {
          id: adminUser.id
        }
      }
    }
  });

  const permissions = await prisma.permission.findMany({
    where: {
      key: {
        in: permissionKeys
      }
    }
  });

  for (const permission of permissions) {
    try {
      await prisma.rolePermission.create({
        data: {
          role: {
            connect: {
              id: adminRole.id
            }
          },
          permission: {
            connect: {
              id: permission.id
            }
          }
        }
      });
    } catch (error) {
      console.error(`Error creating rolePermission for permission ${permission.name}:`, error);
    }
  }
};

export default createSuperAdmin;
