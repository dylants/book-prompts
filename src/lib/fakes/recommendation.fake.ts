import { fakeBook } from '@/lib/fakes/book.fake';
import AIBookRecommendation from '@/types/AIBookRecommendation';
import HydratedBookRecommendation from '@/types/HydratedBookRecommendation';
import { faker } from '@faker-js/faker';
import { BookRecommendation, Prisma } from '@prisma/client';

export function fakeAIBookRecommendation(): AIBookRecommendation {
  return {
    author: faker.person.fullName(),
    confidenceScore: faker.number.float({ fractionDigits: 2, max: 1, min: 0 }),
    explanation: faker.lorem.paragraph(),
    title: faker.music.songName(),
  };
}

export function fakeBookRecommendation(): BookRecommendation {
  return {
    aiModel: faker.lorem.word(),
    bookId: faker.number.int(),
    confidenceScore: new Prisma.Decimal(faker.number.float()),
    createdAt: faker.date.past(),
    explanation: faker.lorem.paragraph(),
    id: faker.number.int(),
    updatedAt: faker.date.past(),
    userId: faker.number.int(),
  };
}

export function fakeHydratedBookRecommendation(): HydratedBookRecommendation {
  const { confidenceScore, createdAt, explanation, id, updatedAt } =
    fakeBookRecommendation();

  return {
    book: fakeBook(),
    confidenceScore,
    createdAt,
    explanation,
    id,
    updatedAt,
  };
}
