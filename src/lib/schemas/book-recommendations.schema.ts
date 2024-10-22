import { z } from 'zod';

const bookRecommendationsSchema = z.object({
  recommendations: z.array(
    z.object({
      authors: z.array(
        z.string({
          description:
            'The author or authors of the book. If there is a first and last name, specify first then last name.',
        }),
      ),
      confidenceScore: z.number({
        description:
          'How confident you are in this recommendation using a score from 0 (low) to 1 (high)',
      }),
      explanation: z.string({
        description:
          'Explain why you think this would be a good book for me to read. ' +
          'Focus on the details of the recommended book, and how it matches the OBJECTIVE. ' +
          'Only include references to previously read books if you are certain ' +
          "you understand the book's themes, otherwise do not.",
      }),
      title: z.string({
        description:
          'The title of the book. If there is a title and subtitle, only include the title.',
      }),
    }),
  ),
});

export default bookRecommendationsSchema;
