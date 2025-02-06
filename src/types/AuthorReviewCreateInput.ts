import { AuthorReview, Prisma } from '@prisma/client';

type AuthorReviewCreateInput = Omit<
  Prisma.AuthorReviewCreateInput,
  'id' | 'createdAt' | 'updatedAt' | 'user' | 'author'
> & {
  authorId: AuthorReview['authorId'];
};

export default AuthorReviewCreateInput;
