import { AuthPostRequestBody } from '@/app/api/auth/route';
import UnauthorizedError from '@/lib/errors/UnauthorizedError';
import Auth from '@/types/Auth';
import Recommendation from '@/types/Recommendation';

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

export async function postRecommendations(): Promise<Recommendation[]> {
  return api<Recommendation[]>('/api/protected/recommendations', {
    method: 'POST',
  });
}
