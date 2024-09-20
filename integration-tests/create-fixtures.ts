import { PrismaClient } from '@prisma/client';
import bookReviewFixtures from './fixtures/book-review.fixture';
const prisma = new PrismaClient();

async function createFixtures() {
  await prisma.bookReview.createMany({
    data: bookReviewFixtures,
  });
}

createFixtures()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
