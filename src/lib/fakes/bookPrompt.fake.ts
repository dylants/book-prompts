import { fakeGenre } from '@/lib/fakes/genre.fake';
import { fakeBookRecommendationHydrated } from '@/lib/fakes/recommendation.fake';
import BookPromptHydrated from '@/types/BookPromptHydrated';
import { BookPromptTable } from '@/types/BookPromptTable';
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

export function fakeBookPromptHydrated(): BookPromptHydrated {
  return {
    ...fakeBookPrompt(),
    bookRecommendations: [fakeBookRecommendationHydrated()],
  };
}

export function fakeBookPromptTable(): BookPromptTable {
  return {
    ...fakeBookPrompt(),
    promptGenre: fakeGenre(),
    promptSubgenre: fakeGenre(),
  };
}
