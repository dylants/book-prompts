'use client';

import AppContext, { AppContextType } from '@/app/AppContext';
import { getAuth } from '@/lib/api';
import Auth from '@/types/Auth';
import { useCallback, useEffect, useState } from 'react';

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState<Auth>();

  const loadAuth = useCallback(async () => {
    const auth = await getAuth();
    setAuth(auth);
  }, []);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  if (!auth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const appContext: AppContextType = {
    auth,
    setAuth,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}
