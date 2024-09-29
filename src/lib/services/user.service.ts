import { encryptPassword } from '@/lib/encryption';
import prisma from '@/lib/prisma';
import User from '@/types/User';
import UserCreateInput from '@/types/UserCreateInput';

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
