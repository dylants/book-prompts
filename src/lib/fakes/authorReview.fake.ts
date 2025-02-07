import AuthorReview from '@/types/AuthorReview';
import { faker } from '@faker-js/faker';

export function fakeAuthorReview(): AuthorReview {
  return {
    authorId: faker.string.nanoid(),
    createdAt: faker.date.past(),
    id: faker.string.nanoid(),
    rating: faker.number.int({ max: 5, min: 0 }),
    updatedAt: faker.date.past(),
    userId: faker.string.nanoid(),
  };
}
