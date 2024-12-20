import { isbnHash } from '@/lib/hash';
import BookCreateInput from '@/types/BookCreateInput';
import { Prisma } from '@prisma/client';

type BookFixture = Pick<BookCreateInput, 'authors' | 'title'> & {
  id: string;
};

const books: BookFixture[] = [
  { authors: ['Jacob Schiller'], id: 'one', title: 'Sunday' },
  { authors: ['Troy Hayes'], id: 'two', title: 'Roses Are Red' },
  { authors: ['Kendra Ortiz'], id: 'three', title: 'Look Away' },
  { authors: ['Kristie Boyer'], id: 'four', title: 'My Story' },
  { authors: ['Troy Ray', 'Megan Jacobs'], id: 'five', title: 'Buttons' },
  { authors: ['John Doe'], id: 'six', title: 'The End' },
  { authors: ['John Doe'], id: 'seven', title: 'The Beginning' },
];

const bookFixtures: Prisma.BookCreateInput[] = books.map((book) => ({
  ...book,
  authors: {
    connectOrCreate: book.authors.map((author) => ({
      create: { name: author },
      where: { name: author },
    })),
  },
  confirmedExists: false,
  isbn13: isbnHash({ authors: book.authors, title: book.title }),
}));

export default bookFixtures;
