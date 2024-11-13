'use client';

import BookPromptComponent, {
  BookPromptFormInput,
} from '@/components/book-prompt/BookPromptComponent';
import BookRecommendationWithReview from '@/components/recommendations/BookRecommendationWithReview';
import { Separator } from '@/components/ui/separator';
import useBookPromptContext from '@/hooks/useBookPromptContext';
import useBookReviews from '@/hooks/useBookReviews';
import BookRecommendationHydratedWithReview from '@/types/BookRecommendationHydratedWithReview';
import { BookCopyIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

export default function RecommendationPage({
  params: { bookPromptId },
}: {
  params: { bookPromptId: string };
}) {
  const { bookPrompt, createBookPrompt, loadBookPrompt } =
    useBookPromptContext();
  const router = useRouter();
  const [recommendationsWithReviews, setRecommendationsWithReviews] = useState<
    BookRecommendationHydratedWithReview[]
  >([]);
  const { bookReviews, createBookReview, updateBookReview } = useBookReviews();

  // either load or redirect to the correct page (to load)
  useEffect(() => {
    if (!bookPrompt) {
      loadBookPrompt(Number(bookPromptId));
    } else if (bookPrompt.id !== Number(bookPromptId)) {
      router.replace(`/recommendations/${bookPrompt.id}`);
    }
  }, [bookPrompt, bookPromptId, loadBookPrompt, router]);

  useEffect(() => {
    if (bookPrompt) {
      const recommendationsWithReviews = bookPrompt.bookRecommendations.map(
        (recommendation) => {
          const bookReview = bookReviews.find(
            (review) => review.bookId === recommendation.book.id,
          );
          return { ...recommendation, bookReview };
        },
      );
      setRecommendationsWithReviews(recommendationsWithReviews);
    }
  }, [bookPrompt, bookReviews]);

  const onRecommend: SubmitHandler<BookPromptFormInput> = useCallback(
    async (formInput) => {
      const { promptText } = formInput;
      await createBookPrompt({ promptText });
    },
    [createBookPrompt],
  );

  if (!bookPrompt) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className="flex gap-2 items-center mb-10">
        <BookCopyIcon size={18} />
        Recommendations
      </h1>
      <div className="grid gap-4">
        <BookPromptComponent
          bookPrompt={bookPrompt}
          onRecommend={onRecommend}
        />
        <div className="grid gap-8">
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
        </div>
      </div>
    </div>
  );
}
