import { encryptPassword } from '@/lib/encryption';
import { PrismaClient } from '@prisma/client';
import bookFixtures from './fixtures/book.fixture';
import userFixtures from './fixtures/user.fixture';
const prisma = new PrismaClient();

async function createFixtures() {
  await prisma.book.createMany({ data: bookFixtures });

  for (const user of userFixtures) {
    await prisma.user.create({
      data: {
        ...user,
        password: await encryptPassword({ password: user.password }),
      },
    });
  }
}

createFixtures()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
