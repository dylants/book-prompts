import { Prisma } from '@prisma/client';

export const USER_WITH_REVIEWS_EMAIL = 'withReviews@fake.com';
export const USER_NO_REVIEWS_EMAIL = 'noReviews@fake.com';
export const USER_WITH_ONE_REVIEW_EMAIL = 'withOneReview@fake.com';

export const PASSWORD = 'password';

const userFixtures: Prisma.UserCreateInput[] = [
  {
    authorReviews: {
      createMany: {
        data: [
          { authorId: 'authorOne', rating: 2 },
          { authorId: 'authorTwo', rating: 4 },
          { authorId: 'authorThree', rating: 1 },
          { authorId: 'authorFour', rating: 5 },
        ],
      },
    },
    bookReviews: {
      createMany: {
        data: [
          { bookId: 'one', rating: 5 },
          { bookId: 'two', rating: 3 },
          { bookId: 'three', rating: 2 },
          { bookId: 'four', rating: 1 },
        ],
      },
    },
    email: USER_WITH_REVIEWS_EMAIL,
    id: 'user-with-reviews',
    password: PASSWORD,
  },
  {
    email: USER_NO_REVIEWS_EMAIL,
    id: 'user-no-reviews',
    password: PASSWORD,
  },
  {
    authorReviews: {
      createMany: {
        data: [{ authorId: 'authorFive', rating: 4 }],
      },
    },
    bookReviews: {
      createMany: {
        data: [{ bookId: 'five', rating: 3 }],
      },
    },
    email: USER_WITH_ONE_REVIEW_EMAIL,
    id: 'user-with-one-review',
    password: PASSWORD,
  },
];

export default userFixtures;
