import HydratedBookRecommendation from '@/types/HydratedBookRecommendation';
import {
  BookIcon,
  MessageCircleQuestionIcon,
  SparklesIcon,
} from 'lucide-react';

export default function BookRecommendation({
  recommendation,
}: {
  recommendation: HydratedBookRecommendation;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div>
          <BookIcon size={26} />
        </div>
        <div>
          <span className="font-bold">{recommendation.book.title}</span>
          <span> by </span>
          <span className="font-bold">{recommendation.book.author}</span>
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
        <div>
          <span className="font-bold">Why:</span> {recommendation.explanation}
        </div>
      </div>
    </div>
  );
}
