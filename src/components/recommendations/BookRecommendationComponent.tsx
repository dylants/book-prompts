import ReviewStars from '@/components/ReviewStars';
import AuthorReview from '@/types/AuthorReview';
import BookRecommendationHydrated from '@/types/BookRecommendationHydrated';
import BookReview from '@/types/BookReview';
import {
  BookIcon,
  MessageCircleQuestionIcon,
  SparklesIcon,
} from 'lucide-react';
import Image from 'next/image';

export type BookRecommendationComponentProps = {
  authorReview?: AuthorReview;
  bookReview?: BookReview;
  onSetAuthorReviewRating: (rating: number) => Promise<void>;
  onSetBookReviewRating: (rating: number) => Promise<void>;
  recommendation: BookRecommendationHydrated;
};

export default function BookRecommendationComponent({
  authorReview,
  bookReview,
  onSetAuthorReviewRating,
  onSetBookReviewRating,
  recommendation,
}: BookRecommendationComponentProps) {
  const { book } = recommendation;
  return (
    <div className="flex gap-4">
      <div className="flex min-w-[128px] h-[192px]">
        {book.imageUrl ? (
          <Image
            alt={book.title}
            src={book.imageUrl}
            width={128}
            height={192}
          />
        ) : (
          <div className="border rounded-sm border-customPalette-300 w-[128px] h-[192px] flex justify-center items-center">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div>
            <BookIcon size={26} />
          </div>
          <div className="grid gap-1 mt-[-5px]">
            <div className="flex gap-2 items-center">
              <div className="font-bold">{book.title}</div>
              <ReviewStars
                onSetScore={onSetBookReviewRating}
                score={bookReview?.rating}
              />
            </div>
            <div className="flex gap-2 items-center">
              <div>
                by{' '}
                <span className="font-bold">
                  {book.authors.map((a) => a.name).join(', ')}
                </span>
              </div>
              <ReviewStars
                onSetScore={onSetAuthorReviewRating}
                score={authorReview?.rating}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div>
            <SparklesIcon size={26} />
          </div>
          <div>
            <span className="font-bold">
              {Math.floor(Number(recommendation.confidenceScore) * 100)}%
            </span>
            <span> match</span>
          </div>
        </div>
        <div className="flex gap-2 min-w-fit">
          <div>
            <MessageCircleQuestionIcon size={26} />
          </div>
          <div className="mt-[-2px]">
            <span className="font-bold">Why:</span> {recommendation.explanation}
          </div>
        </div>
      </div>
    </div>
  );
}
