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
    id: faker.string.nanoid(),
    promptGenreId: faker.string.nanoid(),
    promptSubgenreId: faker.string.nanoid(),
    promptText: faker.lorem.sentence({
      max: 20,
      min: 2,
    }),
    updatedAt: faker.date.past(),
    userId: faker.string.nanoid(),
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
