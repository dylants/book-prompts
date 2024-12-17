import { comparePassword } from '@/lib/encryption';
import prisma from '@/lib/prisma';
import userService from '@/lib/services/user.service';

const USER_EMAIL = 'createUserIntegrationTest@fake.com';
const USER_PASSWORD = 'my password';

describe('Create User Integration Test', () => {
  afterEach(async () => {
    // cleanup users created
    await prisma.user.deleteMany({
      where: {
        email: USER_EMAIL,
      },
    });
  });

  it('addUser should return a user and add it to the database', async () => {
    const createdUser = await userService.addUser({
      user: {
        email: USER_EMAIL,
        password: USER_PASSWORD,
      },
    });

    const { email, id } = createdUser;
    expect(email).toEqual(USER_EMAIL);
    expect(id).toBeDefined();

    const foundUser = await prisma.user.findFirst({
      select: {
        email: true,
        id: true,
        password: true,
      },
      where: { email: USER_EMAIL },
    });
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toEqual(USER_EMAIL);
    expect(
      await comparePassword({
        hash: foundUser?.password || '',
        password: USER_PASSWORD,
      }),
    ).toEqual(true);
    expect(foundUser?.id).toEqual(id);
  });

  it('should disallow creating a user with the same email twice', async () => {
    await userService.addUser({
      user: {
        email: USER_EMAIL,
        password: USER_PASSWORD,
      },
    });

    await expect(
      userService.addUser({
        user: {
          email: USER_EMAIL,
          password: USER_PASSWORD,
        },
      }),
    ).rejects.toThrow(/Unique constraint failed on the fields: \(`email`\)/);
  });
});
