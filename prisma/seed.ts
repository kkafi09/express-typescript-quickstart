import { PrismaClient } from '@prisma/client';
import createSuperAdmin from './seeds/admin-user-seeder';

const prisma = new PrismaClient();

async function seed() {
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
