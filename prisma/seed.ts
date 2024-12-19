import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const hashedPassword = await bcryptjs.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'USER',
      notificationPreference: {
        create: {
          emailEnabled: true,
          emailFrequency: 'IMMEDIATE',
          emailDigestDay: null,
          emailDigestTime: null,
        },
      },
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
