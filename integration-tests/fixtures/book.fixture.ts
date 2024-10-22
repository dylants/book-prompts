import { isbnHash } from '@/lib/hash';
import { Book, Prisma } from '@prisma/client';

const books: Pick<Book, 'authors' | 'title'>[] = [
  { authors: ['Jacob Schiller'], title: 'Sunday' },
  { authors: ['Troy Hayes'], title: 'Roses Are Red' },
  { authors: ['Kendra Ortiz'], title: 'Look Away' },
  { authors: ['Kristie Boyer'], title: 'My Story' },
  { authors: ['Troy Ray', 'Megan Jacobs'], title: 'Buttons & Bows' },
];

const bookFixtures: Prisma.BookCreateManyInput[] = books.map((book) => ({
  ...book,
  confirmedExists: false,
  isbn13: isbnHash({ authors: book.authors, title: book.title }),
}));

export default bookFixtures;
