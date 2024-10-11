'use client';

import Nav from '@/components/Nav';
import useAppContext from '@/hooks/useAppContext';
import { deleteAuth } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function NavContainer() {
  const { auth, setAuth } = useAppContext();
  const router = useRouter();

  const handleAuthClick = useCallback(async () => {
    if (auth.isLoggedIn) {
      const updatedAuth = await deleteAuth();
      setAuth(updatedAuth);
    }

    // either way we end up at login
    return router.push('/login');
  }, [auth.isLoggedIn, router, setAuth]);

  return <Nav auth={auth} handleAuthClick={handleAuthClick} />;
}
