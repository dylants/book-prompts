// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

import { Prisma, PrismaClient } from '@prisma/client';

const omitConfig = {
  bookPrompt: {
    aiModel: true,
  },
  user: {
    password: true,
  },
} satisfies Prisma.GlobalOmitConfig;

const prismaClientSingleton = () => {
  return new PrismaClient({
    // https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields
    omit: omitConfig,
  });
};

export type ExtendedPrismaClient = ReturnType<typeof prismaClientSingleton>;

declare const globalThis: {
  prismaGlobal: ExtendedPrismaClient;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
