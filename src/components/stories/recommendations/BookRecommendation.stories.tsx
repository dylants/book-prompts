import BookRecommendation from '@/components/recommendations/BookRecommendation';
import { fakeRecommendation } from '@/lib/fakes/recommendation.fake';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BookRecommendation> = {
  component: BookRecommendation,
};

export default meta;
type Story = StoryObj<typeof BookRecommendation>;

export const Default: Story = {
  args: {
    recommendation: fakeRecommendation(),
  },
};
