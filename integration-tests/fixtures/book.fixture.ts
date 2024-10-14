import { isbnHash } from '@/lib/hash';
import { Book, Prisma } from '@prisma/client';

const books: Pick<Book, 'author' | 'title'>[] = [
  { author: 'Jacob Schiller', title: 'Sunday' },
  { author: 'Troy Hayes', title: 'Roses Are Red' },
  { author: 'Kendra Ortiz', title: 'Look Away' },
  { author: 'Kristie Boyer', title: 'My Story' },
  { author: 'Troy Ray', title: 'Buttons & Bows' },
];

const bookFixtures: Prisma.BookCreateManyInput[] = books.map((book) => ({
  ...book,
  confirmedExists: false,
  isbn13: isbnHash({ author: book.author, title: book.title }),
}));

export default bookFixtures;
