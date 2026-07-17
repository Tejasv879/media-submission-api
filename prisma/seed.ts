import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Assessment Admin', email: 'admin@example.com', password, role: Role.ADMIN },
  });
  console.log('Admin ready: admin@example.com / Admin@123');
}

main().finally(() => prisma.$disconnect());
