import { Prisma } from '@prisma/client';

type BookCreateInput = Pick<
  Prisma.BookCreateInput,
  'confirmedExists' | 'isbn13' | 'title' | 'imageUrl'
> & {
  authors: string[];
};

export default BookCreateInput;
