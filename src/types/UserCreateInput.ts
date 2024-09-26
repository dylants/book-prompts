import { User } from '@prisma/client';

type UserCreateInput = Pick<User, 'email' | 'password'>;

export default UserCreateInput;
