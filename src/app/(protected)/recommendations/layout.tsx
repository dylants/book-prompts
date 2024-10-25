import BookPromptContextProvider from '@/app/(protected)/recommendations/BookPromptContextProvider';

export default function RecommendationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BookPromptContextProvider>{children}</BookPromptContextProvider>;
}
