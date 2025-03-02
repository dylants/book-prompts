import { fakeBookHydrated } from '@/lib/fakes/book.fake';
import BookReview from '@/types/BookReview';
import BookReviewHydrated from '@/types/BookReviewHydrated';
import { faker } from '@faker-js/faker';

export function fakeBookReview(): BookReview {
  return {
    bookId: faker.string.nanoid(),
    createdAt: faker.date.past(),
    id: faker.string.nanoid(),
    rating: faker.number.int({ max: 5, min: 0 }),
    updatedAt: faker.date.past(),
    userId: faker.string.nanoid(),
  };
}

export function fakeBookReviewHydrated(): BookReviewHydrated {
  return {
    ...fakeBookReview(),
    book: fakeBookHydrated(),
  };
}
