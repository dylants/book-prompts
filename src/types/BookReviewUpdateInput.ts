import { Prisma } from '@prisma/client';

type BookReviewUpdateInput = Omit<
  Prisma.BookReviewUpdateInput,
  'id' | 'createdAt' | 'updatedAt' | 'user' | 'book'
>;

export default BookReviewUpdateInput;
