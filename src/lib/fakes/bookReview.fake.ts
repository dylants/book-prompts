import { faker } from '@faker-js/faker';
import { BookReview } from '@prisma/client';

export function fakeBookReview(): BookReview {
  return {
    bookId: faker.number.int(),
    createdAt: faker.date.past(),
    id: faker.number.int(),
    rating: faker.number.int({ max: 5, min: 0 }),
    updatedAt: faker.date.past(),
    userId: faker.number.int(),
  };
}
