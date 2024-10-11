import handleErrorResponse from '@/lib/errors/handleErrorResponse';
import logger from '@/lib/logger';
import { authMiddleware } from '@/lib/middleware';
import RecommendBooksPrompt from '@/lib/prompts/RecommendBooksPrompt';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import Recommendation from '@/types/Recommendation';
import Session from '@/types/Session';
import { NextRequest, NextResponse } from 'next/server';

type ResponseBody = {
  data: Recommendation[];
};

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ResponseBody | NextResponseErrorBody>> {
  logger.trace({}, '/api/protected/recommendations POST');

  let session: Session;

  /* istanbul ignore next */
  try {
    session = await authMiddleware(request);
  } catch (error) {
    return handleErrorResponse(error);
  }

  try {
    const prompt = new RecommendBooksPrompt({ user: session.user });
    const recommendations = await prompt.execute();

    return NextResponse.json({ data: recommendations });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
