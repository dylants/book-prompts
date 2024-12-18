import { Genre } from '@/types/Genre';
import { faker } from '@faker-js/faker';

export function fakeGenre(): Genre {
  return {
    displayName: faker.lorem.word(),
    id: faker.string.nanoid(),
  };
}
