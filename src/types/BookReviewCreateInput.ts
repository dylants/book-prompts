import { BookReview, Prisma } from '@prisma/client';

type BookReviewCreateInput = Omit<
  Prisma.BookReviewCreateInput,
  'id' | 'createdAt' | 'updatedAt' | 'user' | 'book'
> & {
  bookId: BookReview['bookId'];
};

export default BookReviewCreateInput;
