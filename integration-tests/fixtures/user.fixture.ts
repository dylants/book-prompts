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
          { author: 'Roosevelt Hackett', rating: 5, title: 'Again' },
          { author: 'Jacob Schiller', rating: 5, title: 'Sunday' },
          { author: 'Troy Hayes', rating: 4, title: 'Roses Are Red' },
          { author: 'Megan Jacobs', rating: 3, title: 'Temperature' },
          { author: 'Fernando Beatty', rating: 2, title: 'Dreamer' },
          { author: 'Mamie Walsh', rating: 2, title: 'Eve of Destruction' },
          { author: 'Alexis Bergstrom', rating: 1, title: 'Too Close' },
          { author: "Antoinette O'Connell", rating: 1, title: 'Be Wild' },
          { author: 'Kendra Ortiz', rating: 1, title: 'Look Away' },
          { author: 'Kristie Boyer', rating: 1, title: 'My Story' },
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
        data: [{ author: 'Troy Raynor', rating: 3, title: 'Buttons & Bows' }],
      },
    },
    email: USER_WITH_ONE_REVIEW_EMAIL,
    password: PASSWORD,
  },
];

export default userFixtures;
