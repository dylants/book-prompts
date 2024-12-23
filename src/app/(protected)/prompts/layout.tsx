import BookPromptContextProvider from '@/app/(protected)/prompts/BookPromptContextProvider';

export default function RecommendationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BookPromptContextProvider>{children}</BookPromptContextProvider>;
}
