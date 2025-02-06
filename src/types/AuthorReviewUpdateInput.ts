import { Prisma } from '@prisma/client';

type AuthorReviewUpdateInput = Omit<
  Prisma.AuthorReviewUpdateInput,
  'id' | 'createdAt' | 'updatedAt' | 'user' | 'author'
>;

export default AuthorReviewUpdateInput;
