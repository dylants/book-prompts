import AppContextProvider from '@/app/AppContextProvider';
import NavContainer from '@/app/NavContainer';
import type { Metadata } from 'next';
import './globals.css';

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
      <body className="min-h-screen min-w-screen flex flex-col">
        <AppContextProvider>
          <div className="flex flex-col gap-4">
            <NavContainer />
            <div className="flex flex-1">
              <main className="flex flex-col flex-1 md:items-center mb-12">
                <div className="w-full h-full px-4 md:w-[768px] md:px-0">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AppContextProvider>
      </body>
    </html>
  );
}
