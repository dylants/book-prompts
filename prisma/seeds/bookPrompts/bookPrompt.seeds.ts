import prisma from '@/lib/prisma';
import BOOK_PROMPT_1 from './bookPrompt1.seed-data';
import BOOK_PROMPT_1_RECOMMENDATIONS from './bookPrompt1Recommendations.seed-data';

export async function generateBookPrompts() {
  const bookPrompt1 = await prisma.bookPrompt.create({
    data: BOOK_PROMPT_1,
  });

  for (const bookRecommendation of BOOK_PROMPT_1_RECOMMENDATIONS) {
    await prisma.bookRecommendation.create({
      data: {
        ...bookRecommendation,
        bookPrompt: {
          connect: {
            id: bookPrompt1.id,
          },
        },
      },
    });
  }
}
