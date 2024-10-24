import useHandleError from '@/hooks/useHandleError';
import { getBookReviews, postBookReviews, putBookReview } from '@/lib/api';
import BookReview from '@/types/BookReview';
import BookReviewCreateInput from '@/types/BookReviewCreateInput';
import BookReviewUpdateInput from '@/types/BookReviewUpdateInput';
import { useCallback, useEffect, useState } from 'react';

export type UseBookReviewsResult = {
  bookReviews: BookReview[];
  createBookReview: ({
    bookReview,
  }: {
    bookReview: BookReviewCreateInput;
  }) => Promise<void>;
  isLoading: boolean;
  updateBookReview: ({
    id,
    updates,
  }: {
    id: BookReview['id'];
    updates: BookReviewUpdateInput;
  }) => Promise<void>;
};

export default function useBookReviews() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookReviews, setBookReviews] = useState<BookReview[]>([]);
  const { handleError } = useHandleError();

  const loadBookReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const reviews = await getBookReviews();
      setBookReviews(reviews);
    } catch (error) {
      /* istanbul ignore next */
      return handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    loadBookReviews();
  }, [loadBookReviews]);

  const replaceBookReview = useCallback(
    (bookReview: BookReview) => {
      setBookReviews([
        ...bookReviews.filter((review) => review.id !== bookReview.id),
        bookReview,
      ]);
    },
    [bookReviews],
  );

  const createBookReview = useCallback(
    async ({
      bookReview,
    }: Parameters<UseBookReviewsResult['createBookReview']>[0]) => {
      try {
        const createdBookReview = await postBookReviews({ bookReview });
        setBookReviews(bookReviews.concat(createdBookReview));
      } catch (error) {
        /* istanbul ignore next */
        return handleError(error);
      }
    },
    [bookReviews, handleError],
  );

  const updateBookReview = useCallback(
    async ({
      id,
      updates,
    }: Parameters<UseBookReviewsResult['updateBookReview']>[0]) => {
      try {
        const updatedBookReview = await putBookReview({ id, updates });
        replaceBookReview(updatedBookReview);
      } catch (error) {
        /* istanbul ignore next */
        return handleError(error);
      }
    },
    [handleError, replaceBookReview],
  );

  return {
    bookReviews,
    createBookReview,
    isLoading,
    updateBookReview,
  };
}
