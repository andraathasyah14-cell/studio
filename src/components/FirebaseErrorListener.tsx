
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // Log error internally for debugging
      console.error("Firebase Security Error:", error);
      
      toast({
        variant: 'destructive',
        title: 'Akses Ditolak',
        description: 'Anda tidak memiliki izin untuk menyimpan data ini. Pastikan akun Anda memiliki flag admin.',
      });

      // Show NextJS overlay in dev mode to help track down the mismatch
      if (process.env.NODE_ENV === 'development') {
        // throw error; // Temporarily commented out to not crash the UI while debugging
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
