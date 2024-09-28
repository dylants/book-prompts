import userService from '@/lib/services/user.service';
import { PrismaClient } from '@prisma/client';
import bookReviewFixtures from './fixtures/book-review.fixture';
import userFixtures from './fixtures/user.fixture';
const prisma = new PrismaClient();

async function createFixtures() {
  // use user service to make sure we add user's correctly
  for (const user of userFixtures) {
    await userService.addUser({ user });
  }

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
