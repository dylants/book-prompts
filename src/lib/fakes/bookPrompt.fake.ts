import { fakeGenre } from '@/lib/fakes/genre.fake';
import { fakeBookRecommendationHydrated } from '@/lib/fakes/recommendation.fake';
import BookPrompt from '@/types/BookPrompt';
import BookPromptHydrated from '@/types/BookPromptHydrated';
import BookPromptTable from '@/types/BookPromptTable';
import { faker } from '@faker-js/faker';

export function fakeBookPrompt(): BookPrompt {
  return {
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
