import BookPromptComponent from '@/components/book-prompt/BookPromptComponent';
import { Separator } from '@/components/ui/separator';
import { fakeBookPrompt } from '@/lib/fakes/bookPrompt.fake';
import BookPrompt from '@/types/BookPrompt';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta<typeof BookPromptComponent> = {
  component: BookPromptComponent,
};

export default meta;
type Story = StoryObj<typeof BookPromptComponent>;

function WrapperComponent({
  initialBookPrompt,
}: {
  initialBookPrompt?: BookPrompt;
}) {
  const [bookPrompt, setBookPrompt] = useState<BookPrompt | undefined>(
    initialBookPrompt,
  );

  return (
    <div className="grid gap-1">
      <BookPromptComponent
        bookPrompt={bookPrompt}
        onRecommend={({ promptText }) => {
          setBookPrompt({
            ...(bookPrompt || fakeBookPrompt()),
            promptText,
          });
        }}
      />
      <Separator />
    </div>
  );
}

export const NoBookPrompt: Story = {
  render: () => <WrapperComponent />,
};

export const WithBookPrompt: Story = {
  render: () => <WrapperComponent initialBookPrompt={fakeBookPrompt()} />,
};
