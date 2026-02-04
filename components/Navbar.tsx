'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-[#1A4A28] flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#1A4A28]">
                  ARA Group
                </span>
                <span className="text-xs text-gray-600">SDAI Intake (CVE)</span>
              </div>
            </Link>

            <div className="flex gap-1">
              <Link href="/">
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  size="sm"
                  className={
                    isActive('/')
                      ? 'bg-[#1A4A28] hover:bg-[#1A4A28]/90'
                      : ''
                  }
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/intakes">
                <Button
                  variant={
                    pathname?.startsWith('/intakes') ? 'default' : 'ghost'
                  }
                  size="sm"
                  className={
                    pathname?.startsWith('/intakes')
                      ? 'bg-[#1A4A28] hover:bg-[#1A4A28]/90'
                      : ''
                  }
                >
                  Intakes
                </Button>
              </Link>
              <Link href="/admin">
                <Button
                  variant={isActive('/admin') ? 'default' : 'ghost'}
                  size="sm"
                  className={
                    isActive('/admin')
                      ? 'bg-[#1A4A28] hover:bg-[#1A4A28]/90'
                      : ''
                  }
                >
                  Admin
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Internal Tool</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
