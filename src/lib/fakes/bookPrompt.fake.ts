import { faker } from '@faker-js/faker';
import { BookPrompt } from '@prisma/client';

export function fakeBookPrompt(): BookPrompt {
  return {
    aiModel: faker.lorem.word(),
    createdAt: faker.date.past(),
    id: faker.number.int(),
    promptGenreId: faker.number.int(),
    promptSubgenreId: faker.number.int(),
    promptText: faker.lorem.sentence(),
    updatedAt: faker.date.past(),
    userId: faker.number.int(),
  };
}
