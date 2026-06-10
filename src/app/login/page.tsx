
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, Key, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/AndraNgelantur99');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/admin/AndraNgelantur99');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Google Gagal",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-[400px] w-full space-y-10">
        <header className="text-center space-y-4">
          <h1 className="font-display text-4xl font-bold tracking-tighter text-white">Akses Admin</h1>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">Personal Knowledge Publication</p>
        </header>

        <form onSubmit={handleEmailLogin} className="space-y-4 p-8 border border-border bg-card">
          <div className="space-y-2">
            <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email
            </label>
            <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-border text-xs rounded-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Key className="w-3 h-3" /> Kata Sandi
            </label>
            <Input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 border-border text-xs rounded-none"
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-bold uppercase text-[0.65rem] tracking-widest h-11 rounded-none hover:bg-silver transition-all"
          >
            {loading ? 'Memproses...' : 'Masuk ke Workspace'}
          </Button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[0.5rem] uppercase tracking-widest">
              <span className="bg-card px-2 text-muted-foreground">Atau</span>
            </div>
          </div>

          <Button 
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full border-border text-white font-bold uppercase text-[0.65rem] tracking-widest h-11 rounded-none hover:bg-white/5 transition-all"
          >
            Login dengan Google
          </Button>
        </form>

        <footer className="text-center">
          <p className="text-[0.55rem] text-muted-foreground italic">
            Hanya administrator terdaftar yang dapat mengakses area ini.
          </p>
        </footer>
      </div>
    </div>
  );
}
