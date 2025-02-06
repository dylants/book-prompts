import { GET, GetResponseBody } from '@/app/api/protected/author-reviews/route';
import prisma from '@/lib/prisma';
import AuthorReview from '@/types/AuthorReview';
import User from '@/types/User';
import { NextRequest } from 'next/server';
import { USER_WITH_REVIEWS_EMAIL } from '../../fixtures/user.fixture';
import { establishAuth } from '../../test-lib/auth';

const url = 'https://localhost';

describe('/author-reviews GET', () => {
  let user: User & { authorReviews: AuthorReview[] };
  let existingAuthorReviews: AuthorReview[];

  beforeAll(async () => {
    user = await prisma.user.findFirstOrThrow({
      include: {
        authorReviews: true,
      },
      where: { email: USER_WITH_REVIEWS_EMAIL },
    });

    existingAuthorReviews = user.authorReviews;
  });

  it('should return the author reviews', async () => {
    const request = new NextRequest(url, {
      method: 'GET',
    });
    establishAuth({ request, user });

    const response = await GET(request);

    expect(response.status).toEqual(200);

    const responseBody: GetResponseBody = await response.json();
    expect(responseBody.data).toEqual(
      JSON.parse(JSON.stringify(existingAuthorReviews)),
    );
  });

  it('should fail when unauthorized', async () => {
    const request = new NextRequest(url);

    const response = await GET(request);

    expect(response.status).toEqual(401);
    expect(await response.json()).toEqual({
      error: 'Unauthorized',
    });
  });
});
