import logger from '@/lib/logger';
import { authMiddleware, handleMiddlewareError } from '@/lib/middleware';
import RecommendBooksPrompt from '@/lib/prompts/RecommendBooksPrompt';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import Recommendation from '@/types/Recommendation';
import { NextRequest, NextResponse } from 'next/server';

type ResponseBody = {
  data: Recommendation[];
};

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ResponseBody | NextResponseErrorBody>> {
  logger.trace({}, '/api/protected/recommendations POST');

  /* istanbul ignore next */
  try {
    await authMiddleware(request);
  } catch (error) {
    return handleMiddlewareError(error);
  }

  try {
    const prompt = new RecommendBooksPrompt();
    const recommendations = await prompt.execute();

    return NextResponse.json({ data: recommendations });
  } catch (error: unknown) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    logger.error({ errorMessage }, 'Error occurred in prompt');
    return NextResponse.json(
      { error: 'Error occurred in prompt' },
      { status: 500 },
    );
  }
}
