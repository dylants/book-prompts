import { User as PrismaUser } from '@prisma/client';

type User = Omit<PrismaUser, 'password'>;

export default User;
