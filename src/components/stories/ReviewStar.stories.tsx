import ReviewStar from '@/components/ReviewStar';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ReviewStar> = {
  component: ReviewStar,
  render: (args) => (
    <div className="w-[18px]">
      <ReviewStar {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof ReviewStar>;

export const Default: Story = {
  args: {},
};

export const Clickable: Story = {
  args: {
    onClick: () => {},
  },
};

export const FilledNotClickable: Story = {
  args: {
    filled: true,
  },
};

export const FilledClickable: Story = {
  args: {
    filled: true,
    onClick: () => {},
  },
};

export const FilledFadedNoClickable: Story = {
  args: {
    filled: true, // works with or without this set
    filledFaded: true,
  },
};
