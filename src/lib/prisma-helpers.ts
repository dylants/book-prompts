import prisma, { ExtendedPrismaClient } from '@/lib/prisma';
import { ITXClientDenyList } from '@prisma/client/runtime/library';

export type ExtendedTransactionClient = Omit<
  ExtendedPrismaClient,
  ITXClientDenyList
>;

export function prismaTransaction<R>(
  args: (prisma: ExtendedTransactionClient) => Promise<R>,
  options?: Parameters<ExtendedPrismaClient['$transaction']>[1],
) {
  return prisma.$transaction(args, options);
}

export type PrismaOptions = {
  tx?: ExtendedTransactionClient;
};

export function getPrismaClient(
  options?: PrismaOptions,
): ExtendedTransactionClient {
  return options?.tx ?? prisma;
}
