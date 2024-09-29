import userService from '@/lib/services/user.service';
import UserCreateInput from '@/types/UserCreateInput';

export const USERS: UserCreateInput[] = [
  { email: 'test@fake.com', password: 'password' },
];

export async function generateUsers() {
  for (const user of USERS) {
    await userService.addUser({ user });
  }
}
