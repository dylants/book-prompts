import Recommendation from '@/types/Recommendation';
import { faker } from '@faker-js/faker';

export function fakeRecommendation(): Recommendation {
  return {
    author: faker.person.fullName(),
    confidenceScore: faker.number.float({ fractionDigits: 2, max: 1, min: 0 }),
    explanationToReader: faker.lorem.paragraph(),
    title: faker.music.songName(),
  };
}
