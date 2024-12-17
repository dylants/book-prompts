import { isbnHash } from '@/lib/hash';
import { Book, Prisma } from '@prisma/client';

const books: Pick<Book, 'authors' | 'id' | 'title'>[] = [
  { authors: ['Jacob Schiller'], id: 'one', title: 'Sunday' },
  { authors: ['Troy Hayes'], id: 'two', title: 'Roses Are Red' },
  { authors: ['Kendra Ortiz'], id: 'three', title: 'Look Away' },
  { authors: ['Kristie Boyer'], id: 'four', title: 'My Story' },
  { authors: ['Troy Ray', 'Megan Jacobs'], id: 'five', title: 'Buttons' },
  { authors: ['John Doe'], id: 'six', title: 'The End' },
  { authors: ['Jane Doe'], id: 'seven', title: 'The Beginning' },
];

const bookFixtures: Prisma.BookCreateManyInput[] = books.map((book) => ({
  ...book,
  confirmedExists: false,
  isbn13: isbnHash({ authors: book.authors, title: book.title }),
}));

export default bookFixtures;
