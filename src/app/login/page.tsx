'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, Mail, ShieldCheck, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: 'Admin User',
          admin: true,
          createdAt: new Date().toISOString()
        });
      }

      const userData = userDoc.data();
      if (userData?.admin === true || !userDoc.exists()) {
        toast({ title: "Login Berhasil", description: "Selamat datang di CMS Andra Ngelantur." });
        router.push('/admin/AndraNgelantur99');
      } else {
        toast({ variant: "destructive", title: "Akses Ditolak", description: "Akun Anda tidak memiliki hak akses admin." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Gagal", description: "Email atau kata sandi salah." });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        name: name || 'Admin User',
        admin: true,
        createdAt: new Date().toISOString()
      });

      toast({ title: "Akun Dibuat", description: "Akun admin berhasil didaftarkan." });
      router.push('/admin/AndraNgelantur99');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Pendaftaran Gagal", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth || !db) {
      toast({ variant: "destructive", title: "Error", description: "Firebase belum terinisialisasi." });
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          admin: true,
          createdAt: new Date().toISOString()
        });
      }
      
      router.push('/admin/AndraNgelantur99');
    } catch (error: any) {
      console.error("Google Login Error:", error);
      
      if (error.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'domain ini';
        toast({ 
          variant: "destructive", 
          title: "Domain Tidak Terdaftar", 
          description: `Harap tambahkan domain "${domain}" ke 'Authorized Domains' di Firebase Console (Authentication > Settings).` 
        });
      } else {
        toast({ 
          variant: "destructive", 
          title: "Google Login Gagal", 
          description: error.message 
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-white selection:text-black">
      <div className="max-w-[400px] w-full space-y-10">
        <header className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-white text-black rounded-none mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tighter text-white">Workspace</h1>
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">Andra Ngelantur CMS v1.0</p>
        </header>

        <div className="border border-border bg-card p-1">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent h-12 rounded-none border-b border-border">
              <TabsTrigger value="login" className="rounded-none data-[state=active]:bg-white/[0.05] text-[0.65rem] uppercase tracking-widest font-bold">Masuk</TabsTrigger>
              <TabsTrigger value="register" className="rounded-none data-[state=active]:bg-white/[0.05] text-[0.65rem] uppercase tracking-widest font-bold">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="p-6 pt-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border text-white text-sm rounded-none h-11 focus-visible:ring-white/20"
                    placeholder="nama@email.com"
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
                    className="bg-background border-border text-white text-sm rounded-none h-11 focus-visible:ring-white/20"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-white text-black font-bold uppercase text-[0.65rem] tracking-widest h-12 rounded-none hover:bg-silver transition-all"
                >
                  {loading ? 'Memproses...' : 'Masuk ke Sistem'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="p-6 pt-8">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <LogIn className="w-3 h-3" /> Nama Lengkap
                  </label>
                  <Input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background border-border text-white text-sm rounded-none h-11 focus-visible:ring-white/20"
                    placeholder="Andra Ngelantur"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email Baru
                  </label>
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border text-white text-sm rounded-none h-11 focus-visible:ring-white/20"
                    placeholder="admin@email.com"
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
                    className="bg-background border-border text-white text-sm rounded-none h-11 focus-visible:ring-white/20"
                    placeholder="Minimal 6 karakter"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-white text-black font-bold uppercase text-[0.65rem] tracking-widest h-12 rounded-none hover:bg-silver transition-all"
                >
                  {loading ? 'Memproses...' : 'Daftar Admin'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="px-6 pb-6">
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[0.5rem] uppercase tracking-widest">
                <span className="bg-card px-2 text-muted-foreground font-bold">Opsi Lain</span>
              </div>
            </div>

            <Button 
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full border-border text-white font-bold uppercase text-[0.65rem] tracking-widest h-12 rounded-none hover:bg-white/5 transition-all"
            >
              Login dengan Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
