import Author from '@/types/Author';
import { faker } from '@faker-js/faker';

export function fakeAuthor(): Author {
  return {
    createdAt: faker.date.past(),
    id: faker.string.nanoid(),
    name: faker.person.fullName(),
    updatedAt: faker.date.past(),
  };
}
