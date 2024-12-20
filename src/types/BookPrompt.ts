import { BookPrompt as PrismaBookPrompt } from '@prisma/client';

type BookPrompt = Omit<PrismaBookPrompt, 'aiModel'>;

export default BookPrompt;
