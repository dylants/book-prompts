'use client';

import useAppContext from '@/hooks/useAppContext';
import useLoginError from '@/hooks/useLoginError';
import LoginError from '@/types/LoginError';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    auth: { isLoggedIn },
  } = useAppContext();
  const router = useRouter();
  const { buildLoginErrorUrl } = useLoginError();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(buildLoginErrorUrl(LoginError.UNAUTHORIZED));
    }
  }, [isLoggedIn, router, buildLoginErrorUrl]);

  if (!isLoggedIn) {
    return <></>;
  }

  return <>{children}</>;
}
