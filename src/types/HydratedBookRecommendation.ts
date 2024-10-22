import { Book, BookRecommendation } from '@prisma/client';

type HydratedBookRecommendation = Omit<
  BookRecommendation,
  'bookPromptId' | 'bookId'
> & {
  book: Book;
};

export default HydratedBookRecommendation;
