import { Prisma } from '@prisma/client';

const bookPromptFixtures: Prisma.BookPromptCreateInput[] = [
  {
    aiModel: 'gpt-4o',
    bookRecommendations: {
      createMany: {
        data: [
          { bookId: 1, confidenceScore: 0.75, explanation: 'Explanation 1' },
          { bookId: 2, confidenceScore: 0.5, explanation: 'Explanation 2' },
          { bookId: 7, confidenceScore: 0.25, explanation: 'Explanation 3' },
        ],
      },
    },
    promptText: 'feature witches',
    user: { connect: { id: 1 } },
  },
  {
    aiModel: 'gpt-4o',
    bookRecommendations: {
      createMany: {
        data: [
          { bookId: 4, confidenceScore: 0.75, explanation: 'Explanation 1' },
          { bookId: 5, confidenceScore: 0.5, explanation: 'Explanation 2' },
        ],
      },
    },
    promptText: 'include gothic themes',
    user: { connect: { id: 1 } },
  },
];

export default bookPromptFixtures;
