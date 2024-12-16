'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <h2>Something went wrong!</h2>
      <Button onClick={() => router.push('/')}>Try again</Button>
    </div>
  );
}
