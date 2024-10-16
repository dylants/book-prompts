import { fakeAIBookRecommendation } from '@/lib/fakes/recommendation.fake';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import BasePrompt from '@/lib/prompts/BasePrompt';
import bookRecommendationsSchema from '@/lib/schemas/book-recommendations.schema';
import aiService from '@/lib/services/ai.service';
import AIBookRecommendation from '@/types/AIBookRecommendation';
import Prompt from '@/types/Prompt';
import User from '@/types/User';
import _ from 'lodash';

export type RecommendBooksPromptProps = {
  user: User;
};

export default class RecommendBooksPrompt
  extends BasePrompt<AIBookRecommendation[]>
  implements Prompt<AIBookRecommendation[]>
{
  private user: User;

  constructor({ user }: RecommendBooksPromptProps) {
    super();

    this.user = user;
  }

  async getSystemPrompt(): Promise<string> {
    return Promise.resolve(`
IDENTITY:
You are an avid book reader, very knowledgeable about books, and enjoy helping others
by recommending books. You've been known to dig deeper, scan through hundreds of
titles, just to find that perfect book recommendation.
`);
  }

  async getUserPrompt(): Promise<string> {
    const books = await prisma.bookReview.findMany({
      orderBy: {
        rating: 'desc',
      },
      select: {
        book: {
          select: {
            author: true,
            title: true,
          },
        },
        rating: true,
      },
      where: { userId: this.user.id },
    });

    // OBJECTIVE:
    // - Recommend 5 books with a Royal word in the title (such as "crown", "king", "court", etc).
    // - Recommend 5 books featuring vampires
    // - Recommend 5 books with gothic themes

    return Promise.resolve(`
OBJECTIVE:
- Recommend and return only 5 books
- The books should all feature witches (but not necessarily in the title).
- The books should be all in the Romantic genre.
- The books should be all in the Comedy subgenre.

PROCESS:
- Think through the OBJECTIVE before coming up with a solution.
- Include all points in CONSIDERATIONS and INPUT when coming up with a solution.
- Outline a process for a solution, and document that process.
- Review and execute that process to arrive at a solution which includes a list
of twice as many books than necessary to satisfy the OBJECTIVE.
- Review the list, and determine if there's any improvements that could be made,
and document those improvements.
- Review and execute those improvements to come up with an improved list.
- Sort the books in descending order based on how closely they match the OBJECTIVE.
- Select the top books from that sorted list that match the OBJECTIVE.
- Submit the solution, limiting the recommendations to the amount stated in OBJECTIVE.

CONSIDERATIONS:
- INPUT includes a list of books which I have previously read.
- Each previously read book has a 1-5 rating from me, 1 being lowest rating,
and 5 being highest rating.
- Do not recommend books that have been previously read, but instead use these
books to predict books that I would enjoy.
- Emphasize books which are highly rated online.
- Emphasize books which have more reviews online.

INPUT:
- Previously read books: ${JSON.stringify(books)}
`);
  }

  async execute(): Promise<AIBookRecommendation[]> {
    if (this.shouldUseFakeResponses()) {
      return _.orderBy(
        _.times(5, () => fakeAIBookRecommendation()),
        ['confidenceScore'],
        ['desc'],
      );
    }

    const response = await aiService.createMessage({
      messages: [
        { content: await this.getSystemPrompt(), role: 'system' },
        { content: await this.getUserPrompt(), role: 'user' },
      ],
      schema: bookRecommendationsSchema,
    });

    const message = response.choices[0]?.message;
    if (message?.parsed) {
      return message.parsed.recommendations;
    } else if (message?.refusal) {
      logger.error({ refusal: message.refusal }, 'AIService refused to parse');
      throw new Error('AIService refused to parse');
    }

    logger.error({ message }, 'Unable to parse response from AIService');
    throw new Error('Unable to process response from AIService');
  }
}
