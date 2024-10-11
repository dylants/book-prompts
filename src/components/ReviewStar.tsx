import { cn } from '@/lib/tailwind-utils';
import { LucideProps, StarIcon } from 'lucide-react';

type ReviewStarProps = Omit<LucideProps, 'ref'> & {
  filled?: boolean;
  filledFaded?: boolean;
};

const ReviewStar = ({
  className,
  filled,
  filledFaded,
  onClick,
  size,
  strokeWidth,
}: ReviewStarProps) => (
  <StarIcon
    onClick={onClick}
    size={size || 48}
    strokeWidth={strokeWidth || 1}
    className={cn(
      'fill-slate-100',
      filled
        ? 'fill-yellow-300'
        : 'hover:fill-yellow-300 transition-[fill] duration-200',
      filledFaded && 'fill-yellow-100',
      onClick && 'cursor-pointer',
      className,
    )}
  />
);
ReviewStar.displayName = 'ReviewStar';

export default ReviewStar;
