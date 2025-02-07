'use client';

import useHandleError from '@/hooks/useHandleError';
import { getBookReviews, postBookReviews, putBookReview } from '@/lib/api';
import BookReview from '@/types/BookReview';
import BookReviewCreateInput from '@/types/BookReviewCreateInput';
import BookReviewUpdateInput from '@/types/BookReviewUpdateInput';
import { createId } from '@paralleldrive/cuid2';
import { useCallback, useState } from 'react';

export type UseBookReviewsResult = {
  bookReviews: BookReview[];
  createBookReview: ({
    bookReview,
  }: {
    bookReview: BookReviewCreateInput;
  }) => Promise<void>;
  loadBookReviews: () => Promise<void>;
  updateBookReview: ({
    id,
    updates,
  }: {
    id: BookReview['id'];
    updates: BookReviewUpdateInput;
  }) => Promise<void>;
};

type OptimisticBookReview = Pick<BookReview, 'rating'> & {
  id: string;
  bookId?: string;
};

export default function useBookReviews() {
  const [bookReviews, setBookReviews] = useState<BookReview[]>();
  const { handleError } = useHandleError();

  const loadBookReviews = useCallback(async () => {
    try {
      const reviews = await getBookReviews();
      setBookReviews(reviews);
    } catch (error) {
      /* istanbul ignore next */
      return handleError(error);
    }
  }, [handleError]);

  const updateBookReviews = useCallback(
    (optimisticBookReview: OptimisticBookReview) => {
      setBookReviews((existingReviews) => {
        /* istanbul ignore next */
        if (!existingReviews) {
          return undefined;
        }

        const existingBookReview = existingReviews.find(
          (review) => review.id === optimisticBookReview.id,
        );
        if (existingBookReview) {
          return [
            ...existingReviews.filter(
              (review) => review.id !== optimisticBookReview.id,
            ),
            {
              ...existingBookReview,
              ...optimisticBookReview,
            },
          ];
        } else if (optimisticBookReview.bookId) {
          const newBookReview: BookReview = {
            ...optimisticBookReview,
            bookId: optimisticBookReview.bookId,
            createdAt: new Date(), // replaced by the server code
            updatedAt: new Date(), // replaced by the server code
            userId: '', // replaced by the server code
          };
          return existingReviews.concat(newBookReview);
        }

        /* istanbul ignore next */
        return existingReviews;
      });
    },
    [],
  );

  const createBookReview = useCallback(
    async ({
      bookReview,
    }: Parameters<UseBookReviewsResult['createBookReview']>[0]) => {
      /* istanbul ignore next */
      if (!bookReviews) {
        return;
      }

      try {
        // optimistic update while we wait for the API
        const optimisticBookReview = {
          ...bookReview,
          id: createId(),
        };
        updateBookReviews(optimisticBookReview);

        const createdBookReview = await postBookReviews({
          bookReview: optimisticBookReview,
        });
        updateBookReviews(createdBookReview);
      } catch (error) {
        /* istanbul ignore next */
        return handleError(error);
      }
    },
    [bookReviews, handleError, updateBookReviews],
  );

  const updateBookReview = useCallback(
    async ({
      id,
      updates,
    }: Parameters<UseBookReviewsResult['updateBookReview']>[0]) => {
      try {
        // optimistic update while we wait for the API
        updateBookReviews({
          id,
          rating: updates.rating,
        });

        const updatedBookReview = await putBookReview({ id, updates });
        updateBookReviews(updatedBookReview);
      } catch (error) {
        /* istanbul ignore next */
        return handleError(error);
      }
    },
    [handleError, updateBookReviews],
  );

  return {
    bookReviews,
    createBookReview,
    loadBookReviews,
    updateBookReview,
  };
}
