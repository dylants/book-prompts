import { BookReview, Prisma } from '@prisma/client';

type BookReviewCreateInput = Omit<
  Prisma.BookReviewCreateInput,
  'createdAt' | 'updatedAt' | 'user' | 'book'
> & {
  bookId: BookReview['bookId'];
};

export default BookReviewCreateInput;
