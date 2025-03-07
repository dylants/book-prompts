import { encryptPassword } from '@/lib/encryption';
import { PrismaClient } from '@prisma/client';
import authorFixtures from './fixtures/author.fixture';
import bookPromptFixtures from './fixtures/book-prompt.fixture';
import bookFixtures from './fixtures/book.fixture';
import userFixtures from './fixtures/user.fixture';
const prisma = new PrismaClient();

async function createFixtures() {
  for (const author of authorFixtures) {
    await prisma.author.create({
      data: author,
    });
  }

  for (const book of bookFixtures) {
    await prisma.book.create({
      data: book,
    });
  }

  for (const user of userFixtures) {
    await prisma.user.create({
      data: {
        ...user,
        password: await encryptPassword({ password: user.password }),
      },
    });
  }

  for (const bookPrompt of bookPromptFixtures) {
    await prisma.bookPrompt.create({ data: bookPrompt });
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
