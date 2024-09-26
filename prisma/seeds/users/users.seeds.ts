import userService from '@/lib/services/user.service';
import { User } from '@prisma/client';

export const USERS: Pick<User, 'email' | 'password'>[] = [
  { email: 'test@fake.com', password: 'password' },
];

export async function generateUsers() {
  for (const user of USERS) {
    await userService.addUser({ user });
  }
}
