import { encryptPassword } from '@/lib/encryption';
import prisma from '@/lib/prisma';
import UserCreateInput from '@/types/UserCreateInput';
import { User } from '@prisma/client';

class UserService {
  private static instance: UserService;

  /* istanbul ignore next */
  public static getInstance(): UserService {
    if (!this.instance) {
      return new UserService();
    }

    return this.instance;
  }

  async addUser({ user }: { user: UserCreateInput }): Promise<User> {
    const { email, password } = user;

    return prisma.user.create({
      data: {
        email,
        password: await encryptPassword({ password }),
      },
    });
  }
}

export default UserService.getInstance();
