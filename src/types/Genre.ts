import { Genre as PrismaGenre } from '@prisma/client';

export type Genre = Omit<PrismaGenre, 'createdAt' | 'updatedAt'>;
