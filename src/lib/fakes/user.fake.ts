import User from '@/types/User';
import { faker } from '@faker-js/faker';

export function fakeUser(): User {
  return {
    createdAt: faker.date.past(),
    email: faker.internet.email(),
    id: faker.string.nanoid(),
    updatedAt: faker.date.past(),
  };
}
