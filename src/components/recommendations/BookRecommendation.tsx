import HydratedBookRecommendation from '@/types/HydratedBookRecommendation';
import {
  BookIcon,
  MessageCircleQuestionIcon,
  SparklesIcon,
} from 'lucide-react';
import Image from 'next/image';

export default function BookRecommendation({
  recommendation,
}: {
  recommendation: HydratedBookRecommendation;
}) {
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
          <div>
            <span className="font-bold">{book.title}</span>
            <span> by </span>
            <span className="font-bold">{book.author}</span>
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
    </div>
  );
}
