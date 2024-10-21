'use client';

import BookRecommendation from '@/components/recommendations/BookRecommendation';
import ReviewStars from '@/components/ReviewStars';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useBookReviews from '@/hooks/useBookReviews';
import useHandleError from '@/hooks/useHandleError';
import { postBookPrompt } from '@/lib/api';
import HydratedBookRecommendation from '@/types/HydratedBookRecommendation';
import { BookCopyIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<
    HydratedBookRecommendation[]
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
          {recommendations.map((recommendation) => {
            const bookReview = bookReviews.find(
              (review) => review.bookId === recommendation.book.id,
            );
            return (
              <div key={recommendation.id} className="grid gap-8">
                <div className="grid gap-4">
                  <BookRecommendation recommendation={recommendation} />
                  <div className="grid gap-1">
                    <p className="text-center italic text-sm">
                      Read this before? Provide a review to help improve the
                      recommendations.
                    </p>
                    <div className="flex justify-center gap-2">
                      <div>
                        <span className="font-bold">Your book rating:</span>
                      </div>
                      <ReviewStars
                        onSetScore={async (score) => {
                          if (bookReview) {
                            await updateBookReview({
                              id: bookReview.id,
                              updates: { rating: score },
                            });
                          } else {
                            await createBookReview({
                              bookReview: {
                                bookId: recommendation.book.id,
                                rating: score,
                              },
                            });
                          }
                        }}
                        score={bookReview?.rating}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
              </div>
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
