import prisma from '@/lib/prisma';
import userService from '@/lib/services/user.service';
import { Prisma } from '@prisma/client';

export const TEST_USER_EMAIL = 'test@fake.com';

export const USERS: Prisma.UserCreateInput[] = [
  { email: TEST_USER_EMAIL, id: 'test_user_id', password: 'password' },
];

export async function generateUsers() {
  for (const user of USERS) {
    await userService.addUser({ user });

    // set the ID for these seed users so our auth credentials persist across seed runs
    await prisma.user.update({
      data: { id: user.id },
      where: { email: user.email },
    });
  }
}
