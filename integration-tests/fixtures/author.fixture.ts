import { Prisma } from '@prisma/client';

const authorFixtures: Prisma.AuthorCreateInput[] = [
  { id: 'authorOne', name: 'Jacob Schiller' },
  { id: 'authorTwo', name: 'Troy Hayes' },
  { id: 'authorThree', name: 'Kendra Ortiz' },
  { id: 'authorFour', name: 'Kristie Boyer' },
  { id: 'authorFive', name: 'Troy Ray' },
  { id: 'authorSix', name: 'Megan Jacobs' },
  { id: 'authorSeven', name: 'John Doe' },
];

export default authorFixtures;
