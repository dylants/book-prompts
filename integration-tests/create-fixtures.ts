import { PrismaClient } from '@prisma/client';
import bookReviewFixtures from './fixtures/book-review.fixture';
import userFixtures from './fixtures/user.fixture';
const prisma = new PrismaClient();

async function createFixtures() {
  await prisma.user.createMany({
    data: userFixtures,
  });

  // the first user gets the book reviews
  const user = await prisma.user.findFirstOrThrow();
  const bookReviewData = bookReviewFixtures.map((b) => ({
    ...b,
    userId: user.id,
  }));
  await prisma.bookReview.createMany({
    data: bookReviewData,
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
