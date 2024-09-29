import { User as PrismaUser } from '@prisma/client';

type UserCreateInput = Pick<PrismaUser, 'email' | 'password'>;

export default UserCreateInput;
