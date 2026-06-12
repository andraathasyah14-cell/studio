
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-display font-bold text-white tracking-tighter">404</h1>
        <p className="text-muted-foreground font-serif italic text-lg">
          ni g ada isinya
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button variant="outline" className="rounded-none border-border text-[0.65rem] uppercase tracking-widest px-8">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
