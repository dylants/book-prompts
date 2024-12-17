import { faker } from '@faker-js/faker';
import { Book } from '@prisma/client';
import _ from 'lodash';

const randomImage = (): string =>
  `https://picsum.photos/id/${_.random(1, 500)}/128/192`;

export function fakeBook(): Book {
  return {
    authors:
      Math.random() > 0.9
        ? [faker.person.fullName(), faker.person.fullName()]
        : [faker.person.fullName()],
    confirmedExists: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    id: faker.string.nanoid(21),
    imageUrl: randomImage(),
    isbn13: faker.string.nanoid(),
    title: faker.music.songName(),
    updatedAt: faker.date.past(),
  };
}
