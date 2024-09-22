import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: '',
  title: 'Book Prompts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
