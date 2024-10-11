import { Button } from '@/components/ui/button';
import { BookCopyIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';

function NavLink({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  const buttonContent = (
    <Button
      variant="outline"
      className="flex flex-col items-center py-0 h-[80px] w-[200px] text-lg"
    >
      {children}
    </Button>
  );

  return (
    <div className="flex items-center">
      <Link href={path}>{buttonContent}</Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col w-full items-center mt-[80px] gap-4">
      <h1>Book Prompts</h1>
      <p>Recommends books based off reading prompts</p>
      <div className="grid grid-cols-2 gap-8">
        <NavLink path="/recommendations">
          <BookCopyIcon size={18} />
          Recommendations
        </NavLink>
        <NavLink path="/reviews">
          <StarIcon size={18} />
          Reviews
        </NavLink>
      </div>
    </div>
  );
}
