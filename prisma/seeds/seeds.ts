import { generateUsers } from './users/users.seeds';

export default async function generateSeeds() {
  await generateUsers();
}
