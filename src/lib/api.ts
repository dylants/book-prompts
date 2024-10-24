import { AuthPostRequestBody } from '@/app/api/auth/route';
import { PostRequestBody as BookPromptPostRequestBody } from '@/app/api/protected/book-prompts/route';
import UnauthorizedError from '@/lib/errors/UnauthorizedError';
import Auth from '@/types/Auth';
import BookPrompt from '@/types/BookPrompt';
import BookPromptHydrated from '@/types/BookPromptHydrated';
import BookReview from '@/types/BookReview';
import BookReviewCreateInput from '@/types/BookReviewCreateInput';
import BookReviewUpdateInput from '@/types/BookReviewUpdateInput';

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

// *************************************************************
// ************************* AUTH ******************************
// *************************************************************

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

// *************************************************************
// ********************** BOOK PROMPTS *************************
// *************************************************************

export async function getBookPrompts(): Promise<BookPrompt[]> {
  return api<BookPrompt[]>('/api/protected/book-prompts');
}

export async function postBookPrompt(
  body: BookPromptPostRequestBody,
): Promise<BookPromptHydrated> {
  return api<BookPromptHydrated>('/api/protected/book-prompts', {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}

// *************************************************************
// ********************** BOOK REVIEWS *************************
// *************************************************************

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
