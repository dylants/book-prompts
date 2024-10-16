import { Book, BookRecommendation } from '@prisma/client';

type HydratedBookRecommendation = Omit<
  BookRecommendation,
  'userId' | 'bookId' | 'aiModel'
> & {
  book: Book;
};

export default HydratedBookRecommendation;
