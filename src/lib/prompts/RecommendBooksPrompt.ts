import config from '@/config/index';
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
  promptText: string;
  user: User;
};

export default class RecommendBooksPrompt
  extends BasePrompt<AIBookRecommendation[]>
  implements Prompt<AIBookRecommendation[]>
{
  private promptText: string;
  private promptGenre: string | null;
  private promptSubgenre: string | null;
  private user: User;

  constructor({ promptText, user }: RecommendBooksPromptProps) {
    super();

    this.promptText = promptText;
    // TODO pull these from the UI
    this.promptGenre = null;
    this.promptSubgenre = null;
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
    const bookReviews = await prisma.bookReview.findMany({
      orderBy: { rating: 'desc' },
      select: {
        book: {
          select: {
            authors: {
              select: {
                name: true,
              },
            },
            title: true,
          },
        },
        rating: true,
      },
      where: { userId: this.user.id },
    });
    const authorReviews = await prisma.authorReview.findMany({
      orderBy: { rating: 'desc' },
      select: {
        author: { select: { name: true } },
        rating: true,
      },
      where: { userId: this.user.id },
    });

    const promptText = `- Recommend books that ${this.promptText}.`;
    const promptGenre = this.promptGenre
      ? `- The books must all be in the ${this.promptGenre} genre.`
      : '';
    const promptSubgenre = this.promptSubgenre
      ? `- The books must all be in the ${this.promptSubgenre} subgenre.`
      : '';

    // OBJECTIVE:
    // - Recommend 5 books with a Royal word in the title (such as "crown", "king", "court", etc).
    // - Recommend 5 books featuring vampires
    // - Recommend 5 books with gothic themes

    return Promise.resolve(`
OBJECTIVE:
- Recommend and return only 5 books
${promptText}
${promptGenre}
${promptSubgenre}

PROCESS:
- Think through the OBJECTIVE before coming up with a solution.
- Include all points in CONSIDERATIONS and INPUT when coming up with a solution.
- Outline a process for a solution, and document that process.
- Review and execute that process to arrive at a solution which includes a list
of twice as many books than necessary to satisfy the OBJECTIVE.
- Make sure ALL books in the list satisfy the OBJECTIVE. If any do not, remove them.
- Review the list, and determine if there's any improvements that could be made,
and document those improvements.
- Review and execute those improvements to come up with an improved list.
- Make sure ALL books in this improved list satisfy the OBJECTIVE. If any do not,
remove them.
- Sort the books in descending order based on how closely they match the OBJECTIVE.
- Select the top books from that sorted list that match the OBJECTIVE.
- Submit the solution, limiting the recommendations to the amount stated in OBJECTIVE.

CONSIDERATIONS:
- INPUT includes a list of books which I have previously read. Each previously read
book has a 1-5 rating from me, 1 being lowest rating, and 5 being highest rating.
- INPUT includes a list of authors which I have previously read. Each previously read
author has a 1-5 rating from me, 1 being lowest rating, and 5 being highest rating.
- Do not recommend books that have been previously read.
- Use the book and author ratings to predict books that I would enjoy, and which
satisfy the OBJECTIVE.
- Emphasize books which are highly reviewed or highly rated online.
- Emphasize books which have more reviews or more ratings online.
- Emphasize books which appear to be more popular online.

INPUT:
- Previously read books: ${JSON.stringify(bookReviews)}
- Previously read authors: ${JSON.stringify(authorReviews)}
`);
  }

  async execute(): Promise<AIBookRecommendation[]> {
    if (config.prompts.shouldUseFakeResponses) {
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
