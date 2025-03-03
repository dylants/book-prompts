'use client';

import BookReviewsTable from '@/components/book-reviews/BookReviewsTable';
import useProtectedContext from '@/hooks/useProtectedContext';

export default function BookReviewsPage() {
  const { bookReviews, updateBookReview } = useProtectedContext();

  return (
    <div className="grid gap-4">
      <h1>Your Book Reviews</h1>
      <BookReviewsTable
        bookReviews={bookReviews}
        onSetBookReviewRating={async ({ id, rating }) => {
          await updateBookReview({
            id,
            updates: { rating },
          });
        }}
      />
    </div>
  );
}
