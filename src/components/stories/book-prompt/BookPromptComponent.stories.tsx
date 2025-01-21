import BookPromptComponent from '@/components/book-prompt/BookPromptComponent';
import { Separator } from '@/components/ui/separator';
import { fakeBookPromptHydrated } from '@/lib/fakes/bookPrompt.fake';
import BookPromptHydrated from '@/types/BookPromptHydrated';
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
  initialBookPrompt?: BookPromptHydrated;
}) {
  const [bookPrompt, setBookPrompt] = useState<BookPromptHydrated | undefined>(
    initialBookPrompt,
  );

  return (
    <div className="grid gap-1">
      <BookPromptComponent
        bookPrompt={bookPrompt}
        onRecommend={({ promptText }) => {
          setBookPrompt({
            ...(bookPrompt || fakeBookPromptHydrated()),
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
  render: () => (
    <WrapperComponent initialBookPrompt={fakeBookPromptHydrated()} />
  ),
};
