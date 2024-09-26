import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';

export function fakeUser(): User {
  return {
    createdAt: faker.date.past(),
    email: faker.internet.email(),
    id: faker.number.int(),
    password: faker.string.nanoid(),
    updatedAt: faker.date.past(),
    uuid: faker.string.uuid(),
  };
}
