'use client';

import BookPromptComponent, {
  BookPromptFormInput,
} from '@/components/book-prompt/BookPromptComponent';
import BookRecommendationComponent from '@/components/recommendations/BookRecommendationComponent';
import { LoadingCircleOverlay } from '@/components/ui/loading-circle';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';
import useBookReviews from '@/hooks/useBookReviews';
import useHandleError from '@/hooks/useHandleError';
import { getBookPrompt, postBookPrompt } from '@/lib/api';
import BookPromptHydrated from '@/types/BookPromptHydrated';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

export default function PromptPage({
  params: { bookPromptId },
}: {
  params: { bookPromptId: string };
}) {
  const isNew = bookPromptId === 'new';
  const [bookPrompt, setBookPrompt] = useState<BookPromptHydrated | null>(null);
  const { handleError } = useHandleError();
  const router = useRouter();
  const { bookReviews, createBookReview, updateBookReview } = useBookReviews();
  const [isGeneratingBookPrompt, setIsGeneratingBookPrompt] = useState(false);

  const loadBookPrompt = useCallback(
    async (bookPromptId: string) => {
      try {
        const loadedBookPrompt = await getBookPrompt({ bookPromptId });
        setBookPrompt(loadedBookPrompt);
      } catch (error) {
        return handleError(error);
      }
    },
    [handleError],
  );

  useEffect(() => {
    if (isNew) {
      // no book prompt to load, we're in create new
    } else if (!bookPrompt) {
      loadBookPrompt(bookPromptId);
    }
  }, [bookPrompt, bookPromptId, isNew, loadBookPrompt, router]);

  const onRecommend: SubmitHandler<BookPromptFormInput> = useCallback(
    async (formInput) => {
      const { promptText } = formInput;
      try {
        setIsGeneratingBookPrompt(true);
        // TODO improve performance here by using the book prompt returned
        const { id } = await postBookPrompt({ promptText });
        router.push(`/prompts/${id}`);
      } catch (error) {
        return handleError(error);
      } finally {
        setIsGeneratingBookPrompt(false);
      }
    },
    [handleError, router],
  );

  if (!isNew && !bookPrompt) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4">
        <BookPromptComponent
          bookPrompt={bookPrompt}
          onRecommend={onRecommend}
        />
        {bookPrompt && (
          <div className="grid gap-8">
            <Separator />
            {bookPrompt.bookRecommendations.map((recommendation) => {
              const bookReview = bookReviews.find(
                (review) => review.bookId === recommendation.book.id,
              );
              return (
                <div className="grid gap-8" key={recommendation.id}>
                  <BookRecommendationComponent
                    bookReview={bookReview}
                    onSetBookReviewRating={async (rating: number) => {
                      if (bookReview) {
                        await updateBookReview({
                          id: bookReview.id,
                          updates: { rating },
                        });
                      } else {
                        await createBookReview({
                          bookReview: {
                            bookId: recommendation.book.id,
                            rating,
                          },
                        });
                      }
                    }}
                    recommendation={recommendation}
                  />
                  <Separator />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <LoadingCircleOverlay isOpen={isGeneratingBookPrompt}>
        <p className="text-lg text-slate-300">Generating recommendations...</p>
      </LoadingCircleOverlay>
    </div>
  );
}
