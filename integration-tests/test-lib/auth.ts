import config from '@/config/index';
import User from '@/types/User';
import { NextRequest } from 'next/server';

export function establishAuth({
  request,
  user,
}: {
  request: NextRequest;
  user: User;
}): void {
  request.cookies.set(config.auth.cookieName, user.id);
}
