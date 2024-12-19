import { fakeAuthor } from '@/lib/fakes/author.fake';
import Book from '@/types/Book';
import BookHydrated from '@/types/BookHydrated';
import { faker } from '@faker-js/faker';
import _ from 'lodash';

const randomImage = (): string =>
  `https://picsum.photos/id/${_.random(1, 500)}/128/192`;

export function fakeBook(): Book {
  return {
    confirmedExists: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    id: faker.string.nanoid(),
    imageUrl: randomImage(),
    isbn13: faker.string.nanoid(),
    title: faker.music.songName(),
    updatedAt: faker.date.past(),
  };
}

export function fakeBookHydrated(): BookHydrated {
  return {
    ...fakeBook(),
    authors:
      Math.random() > 0.9 ? [fakeAuthor(), fakeAuthor()] : [fakeAuthor()],
  };
}
