import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import createPermission from './seeds/role-seeder';
import createSuperAdmin from './seeds/admin-user-permission';

const prisma = new PrismaClient();

async function seed() {
  createPermission();
  createSuperAdmin();

  console.log('Database seeded successfully');
}

seed()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
