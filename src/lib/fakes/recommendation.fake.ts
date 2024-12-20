import { fakeBookHydrated } from '@/lib/fakes/book.fake';
import AIBookRecommendation from '@/types/AIBookRecommendation';
import BookRecommendationHydrated from '@/types/BookRecommendationHydrated';
import { faker } from '@faker-js/faker';
import { BookRecommendation, Prisma } from '@prisma/client';

export function fakeAIBookRecommendation(): AIBookRecommendation {
  return {
    authors:
      Math.random() > 0.9
        ? [faker.person.fullName(), faker.person.fullName()]
        : [faker.person.fullName()],
    confidenceScore: faker.number.float({ fractionDigits: 2, max: 1, min: 0 }),
    explanation: faker.lorem.paragraph(),
    title: faker.music.songName(),
  };
}

export function fakeBookRecommendation(): BookRecommendation {
  return {
    bookId: faker.string.nanoid(),
    bookPromptId: faker.string.nanoid(),
    confidenceScore: new Prisma.Decimal(faker.number.float()),
    createdAt: faker.date.past(),
    explanation: faker.lorem.paragraph(),
    id: faker.string.nanoid(),
    updatedAt: faker.date.past(),
  };
}

export function fakeBookRecommendationHydrated(): BookRecommendationHydrated {
  return {
    ...fakeBookRecommendation(),
    book: fakeBookHydrated(),
  };
}
