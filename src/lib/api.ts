import { AuthPostRequestBody } from '@/app/api/auth/route';
import UnauthorizedError from '@/lib/errors/UnauthorizedError';
import Auth from '@/types/Auth';
import BookReviewCreateInput from '@/types/BookReviewCreateInput';
import BookReviewUpdateInput from '@/types/BookReviewUpdateInput';
import HydratedBookRecommendation from '@/types/HydratedBookRecommendation';
import { BookReview } from '@prisma/client';

/**
 * Wrapper around fetch, expecting and returning a JSON typed response
 * within the `data` field.
 *
 * @param path The fetch path
 * @param fetchOptions The fetch options
 * @returns Typed response.json().data
 */
async function api<T>(path: string, fetchOptions?: RequestInit): Promise<T> {
  const response = await fetch(path, fetchOptions);

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return (await response.json()).data as T;
}

export async function getAuth(): Promise<Auth> {
  return api<Auth>('/api/auth');
}

export async function postAuth({
  email,
  password,
}: AuthPostRequestBody): Promise<Auth> {
  return api<Auth>('/api/auth', {
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

export async function deleteAuth(): Promise<Auth> {
  return api<Auth>('/api/auth', {
    method: 'DELETE',
  });
}

export async function postBookRecommendations(): Promise<
  HydratedBookRecommendation[]
> {
  return api<HydratedBookRecommendation[]>(
    '/api/protected/book-recommendations',
    {
      method: 'POST',
    },
  );
}

export async function getBookReviews(): Promise<BookReview[]> {
  return api<BookReview[]>('/api/protected/book-reviews');
}

export async function postBookReviews({
  bookReview,
}: {
  bookReview: BookReviewCreateInput;
}): Promise<BookReview> {
  return api<BookReview>('/api/protected/book-reviews', {
    body: JSON.stringify(bookReview),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

export async function putBookReview({
  id,
  updates,
}: {
  id: BookReview['id'];
  updates: BookReviewUpdateInput;
}): Promise<BookReview> {
  return api<BookReview>(`/api/protected/book-reviews/${id}`, {
    body: JSON.stringify(updates),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}
