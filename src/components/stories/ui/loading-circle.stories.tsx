import {
  LoadingCircle,
  LoadingCircleOverlay,
} from '@/components/ui/loading-circle';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LoadingCircle> = {
  component: LoadingCircle,
};

export default meta;
type Story = StoryObj<typeof LoadingCircle>;

export const Small: Story = {
  args: { size: 'small' },
};

export const Large: Story = {
  args: { size: 'large' },
};

export const ExtraLarge: Story = {
  args: { size: 'xLarge' },
};

export const DifferentColor: Story = {
  args: { color: '#0044ff', size: 'xLarge' },
};

export const InDialog: Story = {
  render: () => {
    return (
      <LoadingCircleOverlay isOpen>
        <p className="text-lg text-slate-300">Generating recommendations...</p>
      </LoadingCircleOverlay>
    );
  },
};
