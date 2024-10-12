import { Prisma } from '@prisma/client';

type BookReviewUpdateInput = Omit<
  Prisma.BookReviewUpdateInput,
  'createdAt' | 'updatedAt' | 'user'
>;

export default BookReviewUpdateInput;
