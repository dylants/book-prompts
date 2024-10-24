import { BookRecommendation as PrismaBookRecommendation } from '@prisma/client';

type BookRecommendation = Omit<
  PrismaBookRecommendation,
  'bookPromptId' | 'bookId'
>;

export default BookRecommendation;
