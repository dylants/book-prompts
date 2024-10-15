import { Prisma } from '@prisma/client';

type BookCreateInput = Pick<
  Prisma.BookCreateInput,
  'confirmedExists' | 'isbn13' | 'title' | 'author' | 'imageUrl'
>;

export default BookCreateInput;
