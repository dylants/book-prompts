import projectConfig from '@/config/index';
import bcrypt from 'bcrypt';

const saltRounds = projectConfig.auth.saltRounds;

export async function encryptPassword({
  password,
}: {
  password: string;
}): Promise<string> {
  const hash: string = await bcrypt.hash(password, saltRounds);

  return hash;
}

export async function comparePassword({
  hash,
  password,
}: {
  hash: string;
  password: string;
}): Promise<boolean> {
  const matches = await bcrypt.compare(password, hash);

  return matches;
}
