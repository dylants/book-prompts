'use client';

import BookRecommendationWithReview from '@/components/recommendations/BookRecommendationWithReview';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useBookReviews from '@/hooks/useBookReviews';
import useHandleError from '@/hooks/useHandleError';
import { postBookPrompt } from '@/lib/api';
import BookRecommendationHydrated from '@/types/BookRecommendationHydrated';
import BookRecommendationHydratedWithReview from '@/types/BookRecommendationHydratedWithReview';
import { BookCopyIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<
    BookRecommendationHydrated[]
  >([]);
  const [recommendationsWithReviews, setRecommendationsWithReviews] = useState<
    BookRecommendationHydratedWithReview[]
  >([]);
  const { handleError } = useHandleError();
  const { bookReviews, createBookReview, updateBookReview } = useBookReviews();

  const generateRecommendations = useCallback(async () => {
    // TODO gather this from form input
    const promptText = 'feature witches (but not necessarily in the title)';
    try {
      const bookPrompt = await postBookPrompt({ promptText });
      setRecommendations(bookPrompt.bookRecommendations);
    } catch (error) {
      return handleError(error);
    }
  }, [handleError]);

  useEffect(() => {
    const recommendationsWithReviews = recommendations.map((recommendation) => {
      const bookReview = bookReviews.find(
        (review) => review.bookId === recommendation.book.id,
      );
      return { ...recommendation, bookReview };
    });
    setRecommendationsWithReviews(recommendationsWithReviews);
  }, [bookReviews, recommendations]);

  return (
    <div>
      <h1 className="flex gap-2 items-center">
        <BookCopyIcon size={18} />
        Recommendations
      </h1>
      {recommendations.length === 0 ? (
        <div className="flex flex-col w-full items-center mt-[80px] gap-3">
          <p>Generate personalized book recommendations</p>
          <Button variant="default" onClick={() => generateRecommendations()}>
            Generate
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-8">
          <Separator />
          {recommendationsWithReviews.map((recommendation) => {
            return (
              <BookRecommendationWithReview
                key={recommendation.id}
                onSetRating={async (rating: number) => {
                  if (recommendation.bookReview) {
                    await updateBookReview({
                      id: recommendation.bookReview.id,
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
                recommendationWithReview={recommendation}
              />
            );
          })}
          <div className="flex mt-4 w-full justify-center">
            <Button variant="default" onClick={() => generateRecommendations()}>
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
