import { generateBookPrompts } from './bookPrompts/bookPrompt.seeds';
import { generateBooks } from './books/books.seeds';
import { generateUsers } from './users/users.seeds';

export default async function generateSeeds() {
  await generateUsers();
  await generateBooks();
  await generateBookPrompts();
}
