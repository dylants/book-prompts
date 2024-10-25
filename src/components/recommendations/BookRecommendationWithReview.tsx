import BookRecommendation from '@/components/recommendations/BookRecommendation';
import ReviewStars from '@/components/ReviewStars';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';
import BookRecommendationHydratedWithReview from '@/types/BookRecommendationHydratedWithReview';

export type BookRecommendationWithReviewProps = {
  isLoadingReview?: boolean;
  onSetRating: (rating: number) => Promise<void>;
  recommendationWithReview: BookRecommendationHydratedWithReview;
};

export default function BookRecommendationWithReview({
  isLoadingReview,
  recommendationWithReview,
  onSetRating,
}: BookRecommendationWithReviewProps) {
  const { bookReview } = recommendationWithReview;
  return (
    <div className="grid gap-8">
      <div className="grid gap-4">
        <BookRecommendation recommendation={recommendationWithReview} />
        <div className="grid gap-1 h-[50px]">
          {isLoadingReview ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <p className="text-center italic text-sm">
                {bookReview
                  ? 'Your review has been recorded!'
                  : 'Read this before? Provide a review to help improve the recommendations.'}
              </p>
              <div className="flex justify-center gap-2">
                <div>
                  <span className="font-bold">Your book rating:</span>
                </div>
                <ReviewStars
                  onSetScore={onSetRating}
                  score={bookReview?.rating}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Separator />
    </div>
  );
}
