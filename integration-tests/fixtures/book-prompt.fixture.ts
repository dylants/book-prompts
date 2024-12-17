import { Prisma } from '@prisma/client';

const bookPromptFixtures: Prisma.BookPromptCreateInput[] = [
  {
    aiModel: 'gpt-4o',
    bookRecommendations: {
      createMany: {
        data: [
          { bookId: 'one', confidenceScore: 0.75, explanation: 'Text 1' },
          { bookId: 'two', confidenceScore: 0.5, explanation: 'Text 2' },
          { bookId: 'seven', confidenceScore: 0.25, explanation: 'Text 3' },
        ],
      },
    },
    promptText: 'feature witches',
    user: { connect: { id: 'user-with-reviews' } },
  },
  {
    aiModel: 'gpt-4o',
    bookRecommendations: {
      createMany: {
        data: [
          { bookId: 'four', confidenceScore: 0.75, explanation: 'Text 1' },
          { bookId: 'five', confidenceScore: 0.5, explanation: 'Text 2' },
        ],
      },
    },
    promptText: 'include gothic themes',
    user: { connect: { id: 'user-with-reviews' } },
  },
  {
    aiModel: 'gpt-4o',
    bookRecommendations: {
      createMany: {
        data: [
          { bookId: 'five', confidenceScore: 0.75, explanation: 'Text 1' },
          { bookId: 'six', confidenceScore: 0.5, explanation: 'Text 2' },
        ],
      },
    },
    promptText: 'features ghosts',
    user: { connect: { id: 'user-with-one-review' } },
  },
];

export default bookPromptFixtures;
