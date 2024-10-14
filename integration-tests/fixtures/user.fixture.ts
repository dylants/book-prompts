import { Prisma } from '@prisma/client';

export const USER_WITH_REVIEWS_EMAIL = 'withReviews@fake.com';
export const USER_NO_REVIEWS_EMAIL = 'noReviews@fake.com';
export const USER_WITH_ONE_REVIEW_EMAIL = 'withOneReview@fake.com';

export const PASSWORD = 'password';

const userFixtures: Prisma.UserCreateInput[] = [
  {
    bookReviews: {
      createMany: {
        data: [
          { bookId: 1, rating: 5 },
          { bookId: 2, rating: 3 },
          { bookId: 3, rating: 2 },
          { bookId: 4, rating: 1 },
        ],
      },
    },
    email: USER_WITH_REVIEWS_EMAIL,
    password: PASSWORD,
  },
  {
    email: USER_NO_REVIEWS_EMAIL,
    password: PASSWORD,
  },
  {
    bookReviews: {
      createMany: {
        data: [{ bookId: 5, rating: 3 }],
      },
    },
    email: USER_WITH_ONE_REVIEW_EMAIL,
    password: PASSWORD,
  },
];

export default userFixtures;
