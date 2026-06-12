
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

/**
 * Halaman rute /admin sekarang berfungsi sebagai pengalih (redirector)
 * ke dashboard spesifik pengguna.
 */
export default function AdminRootPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Alihkan ke dashboard utama jika sudah login
        router.push('/admin/AndraNgelantur99');
      } else {
        // Alihkan ke login jika belum login
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-[0.6rem] uppercase tracking-widest text-muted-foreground">
        Mengarahkan ke Workspace...
      </div>
    </div>
  );
}
