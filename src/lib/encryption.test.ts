import { comparePassword, encryptPassword } from '@/lib/encryption';

describe('encryption lib', () => {
  const password = 'my password';

  it('should encrypt and compare password correctly', async () => {
    expect(
      await comparePassword({
        hash: await encryptPassword({ password }),
        password,
      }),
    ).toEqual(true);
  });

  it('should return false when passwords mismatch', async () => {
    expect(
      await comparePassword({
        hash: await encryptPassword({ password: 'bad' }),
        password,
      }),
    ).toEqual(false);
  });
});
