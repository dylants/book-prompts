import { UnauthorizedError } from '@/lib/errors/UnauthorizedError';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import { NextResponse } from 'next/server';

export function handleErrorResponse(
  error: unknown,
): NextResponse<NextResponseErrorBody> {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } else {
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
