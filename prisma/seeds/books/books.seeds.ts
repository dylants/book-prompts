import prisma from '@/lib/prisma';
import BOOKS_SEED_DATA from './books.seed-data';

export async function generateBooks() {
  for (const book of BOOKS_SEED_DATA) {
    await prisma.book.create({
      data: book,
    });
  }
}
