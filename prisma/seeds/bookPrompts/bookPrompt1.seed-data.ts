import { Prisma } from '@prisma/client';
import { TEST_USER_EMAIL } from '../users/users.seeds';

const BOOK_PROMPT_1: Prisma.BookPromptCreateInput = {
  aiModel: 'gpt-4o-2024-08-06',
  promptText: 'are by Brandon Sanderson',
  user: {
    connect: {
      email: TEST_USER_EMAIL,
    },
  },
};

export default BOOK_PROMPT_1;
