import { BookPrompt as PrismaBookPrompt } from '@prisma/client';

type BookPrompt = Omit<PrismaBookPrompt, 'userId' | 'aiModel'>;

export default BookPrompt;
