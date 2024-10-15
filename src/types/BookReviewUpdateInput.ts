import { Prisma } from '@prisma/client';

type BookReviewUpdateInput = Omit<
  Prisma.BookReviewUpdateInput,
  'createdAt' | 'updatedAt' | 'user' | 'book'
>;

export default BookReviewUpdateInput;
