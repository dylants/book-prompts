import { AuthorReview, Prisma } from '@prisma/client';

type AuthorReviewCreateInput = Omit<
  Prisma.AuthorReviewCreateInput,
  'createdAt' | 'updatedAt' | 'user' | 'author'
> & {
  authorId: AuthorReview['authorId'];
};

export default AuthorReviewCreateInput;
