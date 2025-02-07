'use client';

import ProtectedContext, {
  ProtectedContextType,
} from '@/app/(protected)/ProtectedContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import useAuthorReviews from '@/hooks/useAuthorReviews';
import useBookReviews from '@/hooks/useBookReviews';
import { useEffect } from 'react';

export default function ProtectedContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    authorReviews,
    createAuthorReview,
    loadAuthorReviews,
    updateAuthorReview,
  } = useAuthorReviews();

  const { bookReviews, createBookReview, loadBookReviews, updateBookReview } =
    useBookReviews();

  useEffect(() => {
    loadAuthorReviews();
    loadBookReviews();
  }, [loadAuthorReviews, loadBookReviews]);

  if (!authorReviews || !bookReviews) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const protectedContext: ProtectedContextType = {
    authorReviews,
    bookReviews,
    createAuthorReview,
    createBookReview,
    updateAuthorReview,
    updateBookReview,
  };

  return (
    <ProtectedContext.Provider value={protectedContext}>
      {children}
    </ProtectedContext.Provider>
  );
}
