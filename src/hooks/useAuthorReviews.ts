'use client';

import useHandleError from '@/hooks/useHandleError';
import {
  getAuthorReviews,
  postAuthorReviews,
  putAuthorReview,
} from '@/lib/api';
import AuthorReview from '@/types/AuthorReview';
import AuthorReviewCreateInput from '@/types/AuthorReviewCreateInput';
import AuthorReviewUpdateInput from '@/types/AuthorReviewUpdateInput';
import { createId } from '@paralleldrive/cuid2';
import { useCallback, useState } from 'react';

export type UseAuthorReviewsResult = {
  authorReviews: AuthorReview[];
  createAuthorReview: ({
    authorReview,
  }: {
    authorReview: AuthorReviewCreateInput;
  }) => Promise<void>;
  loadAuthorReviews: () => Promise<void>;
  updateAuthorReview: ({
    id,
    updates,
  }: {
    id: AuthorReview['id'];
    updates: AuthorReviewUpdateInput;
  }) => Promise<void>;
};

type OptimisticAuthorReview = Pick<AuthorReview, 'rating'> & {
  id: string;
  authorId?: string;
};

export default function useAuthorReviews() {
  const [authorReviews, setAuthorReviews] = useState<AuthorReview[]>();
  const { handleError } = useHandleError();

  const loadAuthorReviews = useCallback(async () => {
    try {
      const reviews = await getAuthorReviews();
      setAuthorReviews(reviews);
    } catch (error) {
      /* istanbul ignore next */
      return handleError(error);
    }
  }, [handleError]);

  const updateAuthorReviews = useCallback(
    (optimisticAuthorReview: OptimisticAuthorReview) => {
      setAuthorReviews((existingReviews) => {
        /* istanbul ignore next */
        if (!existingReviews) {
          return undefined;
        }

        const existingAuthorReview = existingReviews.find(
          (review) => review.id === optimisticAuthorReview.id,
        );
        if (existingAuthorReview) {
          return [
            ...existingReviews.filter(
              (review) => review.id !== optimisticAuthorReview.id,
            ),
            {
              ...existingAuthorReview,
              ...optimisticAuthorReview,
            },
          ];
        } else if (optimisticAuthorReview.authorId) {
          const newAuthorReview: AuthorReview = {
            ...optimisticAuthorReview,
            authorId: optimisticAuthorReview.authorId,
            createdAt: new Date(), // replaced by the server code
            updatedAt: new Date(), // replaced by the server code
            userId: '', // replaced by the server code
          };
          return existingReviews.concat(newAuthorReview);
        }

        /* istanbul ignore next */
        return existingReviews;
      });
    },
    [],
  );

  const createAuthorReview = useCallback(
    async ({
      authorReview,
    }: Parameters<UseAuthorReviewsResult['createAuthorReview']>[0]) => {
      /* istanbul ignore next */
      if (!authorReviews) {
        return;
      }

      try {
        // optimistic update while we wait for the API
        const optimisticAuthorReview = {
          ...authorReview,
          id: createId(),
        };
        updateAuthorReviews(optimisticAuthorReview);

        const createdAuthorReview = await postAuthorReviews({
          authorReview: optimisticAuthorReview,
        });
        updateAuthorReviews(createdAuthorReview);
      } catch (error) {
        /* istanbul ignore next */
        return handleError(error);
      }
    },
    [authorReviews, handleError, updateAuthorReviews],
  );

  const updateAuthorReview = useCallback(
    async ({
      id,
      updates,
    }: Parameters<UseAuthorReviewsResult['updateAuthorReview']>[0]) => {
      try {
        // optimistic update while we wait for the API
        updateAuthorReviews({
          id,
          rating: updates.rating,
        });

        const updatedAuthorReview = await putAuthorReview({ id, updates });
        updateAuthorReviews(updatedAuthorReview);
      } catch (error) {
        /* istanbul ignore next */
        return handleError(error);
      }
    },
    [handleError, updateAuthorReviews],
  );

  return {
    authorReviews,
    createAuthorReview,
    loadAuthorReviews,
    updateAuthorReview,
  };
}
