import AIBookRecommendation from '@/types/AIBookRecommendation';
import Recommendation from '@/types/Recommendation';
import { faker } from '@faker-js/faker';

export function fakeAIBookRecommendation(): AIBookRecommendation {
  return {
    author: faker.person.fullName(),
    confidenceScore: faker.number.float({ fractionDigits: 2, max: 1, min: 0 }),
    explanation: faker.lorem.paragraph(),
    title: faker.music.songName(),
  };
}

// TODO delete this once we finish the migration
export function fakeRecommendation(): Recommendation {
  return {
    author: faker.person.fullName(),
    confidenceScore: faker.number.float({ fractionDigits: 2, max: 1, min: 0 }),
    explanation: faker.lorem.paragraph(),
    title: faker.music.songName(),
  };
}
