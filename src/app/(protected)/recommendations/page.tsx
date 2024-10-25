'use client';

import { Button } from '@/components/ui/button';
import { BookCopyIcon } from 'lucide-react';
import Link from 'next/link';

export default function RecommendationsPage() {
  return (
    <div>
      <h1 className="flex gap-2 items-center mb-10">
        <BookCopyIcon size={18} />
        Recommendations
      </h1>
      <Link href="/recommendations/new">
        <Button>New</Button>
      </Link>
    </div>
  );
}
