'use client';

import ReviewStar from '@/components/ReviewStar';
import _ from 'lodash';
import { useState } from 'react';

export type ReviewStarsProps = {
  score: number | undefined;
  onSetScore: (score: number) => Promise<void>;
};

export default function ReviewStars({ score, onSetScore }: ReviewStarsProps) {
  const [hoverStarNumber, setHoverStarNumber] = useState<number>();

  const stars = _.times(5, (num) => {
    const currentStarNum = num + 1;
    const isHovering: boolean = _.isNumber(hoverStarNumber);
    const hasScore: boolean = _.isNumber(score);

    const shouldBeFilled: boolean = hasScore && score! >= currentStarNum;

    const filled: boolean = isHovering
      ? hoverStarNumber! >= currentStarNum
      : shouldBeFilled;

    const filledFaded: boolean =
      isHovering && hoverStarNumber! < currentStarNum && shouldBeFilled;

    return (
      <div
        key={currentStarNum}
        onMouseEnter={() => {
          setHoverStarNumber(currentStarNum);
        }}
        onMouseLeave={() => {
          setHoverStarNumber(undefined);
        }}
      >
        <ReviewStar
          filled={filled}
          filledFaded={filledFaded}
          onClick={() => {
            if (score === currentStarNum) {
              // ignore, there is no change
            } else {
              onSetScore(currentStarNum);
            }
          }}
        />
      </div>
    );
  });

  return <div className="flex">{stars}</div>;
}
