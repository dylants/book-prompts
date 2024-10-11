import { AuthPostRequestBody } from '@/app/api/auth/route';
import Auth from '@/types/Auth';

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
  // TODO handle failed login
  return api<Auth>('/api/auth', {
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
}
