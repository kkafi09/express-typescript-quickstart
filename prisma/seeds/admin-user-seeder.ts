import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createSuperAdmin = async () => {
  await prisma.user.create({
    data: {
      name: 'Super Admin',
      username: 'superadmin',
      email: 'superadmin@admin.com',
      role: 'SUPERADMIN',
      password: bcrypt.hashSync('admin123', 10),
      phone_number: '1234567890'
    }
  });
};

export default createSuperAdmin;
