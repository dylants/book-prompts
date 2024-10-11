'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Auth from '@/types/Auth';
import { LogInIcon, LogOutIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';

function UserNav({
  auth,
  handleAuthClick,
}: {
  auth: Auth;
  handleAuthClick: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = useCallback(() => {
    setIsOpen(false);

    handleAuthClick();
  }, [handleAuthClick]);

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent">
          {auth.isLoggedIn ? <div>{auth.email}</div> : <UserIcon size={18} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-slate-100 w-min h-min p-0">
        <Button variant="ghost" onClick={handleClick}>
          {auth.isLoggedIn ? (
            <div className="flex gap-4">
              <LogOutIcon size={18} />
              <div className="flex-2">Logout</div>
            </div>
          ) : (
            <div className="flex gap-4">
              <LogInIcon size={18} />
              <div className="flex-2">Login</div>
            </div>
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default function Nav({
  auth,
  handleAuthClick,
}: {
  auth: Auth;
  handleAuthClick: () => Promise<void>;
}) {
  return (
    <nav className="flex justify-between items-center w-full h-[50px] px-4 bg-slate-300">
      <div className="text-xl">
        <Link href="/">book prompts</Link>
      </div>
      <div className="flex gap-4 items-center">
        <UserNav auth={auth} handleAuthClick={handleAuthClick} />
      </div>
    </nav>
  );
}
