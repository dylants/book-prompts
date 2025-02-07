'use client';

import ProtectedContext, {
  ProtectedContextType,
} from '@/app/(protected)/ProtectedContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import useBookReviews from '@/hooks/useBookReviews';
import { useEffect } from 'react';

export default function ProtectedContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { bookReviews, createBookReview, loadBookReviews, updateBookReview } =
    useBookReviews();

  useEffect(() => {
    loadBookReviews();
  }, [loadBookReviews]);

  if (!bookReviews) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const protectedContext: ProtectedContextType = {
    bookReviews,
    createBookReview,
    updateBookReview,
  };

  return (
    <ProtectedContext.Provider value={protectedContext}>
      {children}
    </ProtectedContext.Provider>
  );
}
