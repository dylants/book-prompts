import Author from '@/types/Author';
import Book from '@/types/Book';

type BookHydrated = Book & {
  authors: Author[];
};

export default BookHydrated;
