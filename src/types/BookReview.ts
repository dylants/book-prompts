import { BookReview as PrismaBookReview } from '@prisma/client';

type BookReview = Omit<PrismaBookReview, 'userId'>;

export default BookReview;
