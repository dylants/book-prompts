import BookReviewCreateInput from '@/types/BookReviewCreateInput';
import { faker } from '@faker-js/faker';
import { BookReview } from '@prisma/client';

export function fakeBookReviewCreateInput(): BookReviewCreateInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, id, updatedAt, ...createInput } = fakeBookReview();

  return createInput;
}

export function fakeBookReview(): BookReview {
  return {
    author: faker.person.fullName(),
    createdAt: faker.date.past(),
    id: faker.number.int(),
    rating: faker.number.int({
      max: 5,
      min: 1,
    }),
    title: faker.music.songName(),
    updatedAt: faker.date.past(),
  };
}
