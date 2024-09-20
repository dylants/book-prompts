import { Prisma } from '@prisma/client';

type BookReviewCreateInput = Omit<
  Prisma.BookReviewCreateInput,
  'id' | 'createdAt' | 'updatedAt'
>;

export default BookReviewCreateInput;
