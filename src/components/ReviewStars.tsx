'use client';

import ReviewStar from '@/components/ReviewStar';
import _ from 'lodash';
import { useState } from 'react';

export type ReviewStarsProps = {
  score: number | undefined;
  onSetScore: (score: number | undefined) => Promise<void>;
};

export default function ReviewStars({ score, onSetScore }: ReviewStarsProps) {
  const [hoverStarNumber, setHoverStarNumber] = useState<number>();

  const stars = _.times(5, (num) => {
    const isHovering: boolean = _.isNumber(hoverStarNumber);
    const hasScore: boolean = _.isNumber(score);

    const shouldBeFilled: boolean = hasScore && score! >= num;

    const filled: boolean = isHovering
      ? hoverStarNumber! >= num
      : shouldBeFilled;

    const filledFaded: boolean =
      isHovering && hoverStarNumber! < num && shouldBeFilled;

    return (
      <div
        key={num}
        onMouseEnter={() => {
          setHoverStarNumber(num);
        }}
        onMouseLeave={() => {
          setHoverStarNumber(undefined);
        }}
      >
        <ReviewStar
          filled={filled}
          filledFaded={filledFaded}
          onClick={() => {
            if (score === num) {
              onSetScore(undefined);
            } else {
              onSetScore(num);
            }
          }}
        />
      </div>
    );
  });

  return <div className="flex">{stars}</div>;
}
