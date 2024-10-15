import Recommendation from '@/types/Recommendation';
import {
  BookIcon,
  MessageCircleQuestionIcon,
  SparklesIcon,
} from 'lucide-react';

export default function BookRecommendation({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div>
          <BookIcon size={26} />
        </div>
        <div>
          <span className="font-bold">{recommendation.title}</span>
          <span> by </span>
          <span className="font-bold">{recommendation.author}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <div>
          <SparklesIcon size={26} />
        </div>
        <div>
          <span className="font-bold">
            {Math.floor(recommendation.confidenceScore * 100)}%
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
