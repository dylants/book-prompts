import { z } from 'zod';

const bookRecommendationsSchema = z.object({
  recommendations: z.array(
    z.object({
      author: z.string({
        description: 'The author of the book',
      }),
      confidenceScore: z.string({
        description:
          'How confident you are in this recommendation using a score from 0 (low) to 1 (high)',
      }),
      explanationToReader: z.string({
        description:
          'Explain why you think this would be a good book for me to read. ' +
          'Focus on the details of the recommended book, and how it matches the OBJECTIVE. ' +
          'Only include references to previously read books if you are certain ' +
          "you understand the book's themes, otherwise do not.",
      }),
      title: z.string({
        description: 'The title of the book',
      }),
    }),
  ),
});

export default bookRecommendationsSchema;
