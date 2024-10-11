import ReviewStars from '@/components/ReviewStars';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta<typeof ReviewStars> = {
  component: ReviewStars,
};

export default meta;
type Story = StoryObj<typeof ReviewStars>;

function ReviewComponent() {
  const [score, setScore] = useState<number>();

  return (
    <ReviewStars onSetScore={async (num) => setScore(num)} score={score} />
  );
}

export const Default: Story = {
  render: () => <ReviewComponent />,
};
