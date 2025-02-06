import { cn } from '@/lib/tailwind-utils';
import { motion, useAnimate } from 'framer-motion';
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
}: ReviewStarProps) => {
  const [scope, animate] = useAnimate();

  return (
    <motion.div
      onTap={() => {
        animate(scope.current, { scale: 0.4 });
        setTimeout(() => {
          animate(scope.current, { scale: 1 });
        }, 100);
      }}
      whileHover={{ scale: 1.5 }}
      whileTap={{ scale: 0.8 }}
    >
      <StarIcon
        ref={scope}
        onClick={onClick}
        size={size || 18}
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
    </motion.div>
  );
};
ReviewStar.displayName = 'ReviewStar';

export default ReviewStar;
