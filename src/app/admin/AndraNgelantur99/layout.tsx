
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useDoc, useFirestore, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, BookOpen, Library, Settings, LogOut, BarChart3, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const userProfileQuery = React.useMemo(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile, loading: profileLoading } = useDoc(userProfileQuery);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (profile) {
      if (profile.admin === true) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push('/');
      }
    }
  }, [profile, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (userLoading || profileLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-full" />
          <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">Otentikasi Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-border bg-card">
          <SidebarHeader className="p-6">
            <Link href="/" className="font-display font-bold text-sm tracking-tighter text-white">
              ANDRA NGELANTUR <span className="text-muted-foreground font-normal ml-2">CMS</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-3 gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/AndraNgelantur99" className="text-[0.65rem] uppercase tracking-widest">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/AndraNgelantur99/essays" className="text-[0.65rem] uppercase tracking-widest">
                    <FileText className="w-4 h-4 mr-2" /> Esai & Opini
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/AndraNgelantur99/papers" className="text-[0.65rem] uppercase tracking-widest">
                    <BookOpen className="w-4 h-4 mr-2" /> Manajemen Paper
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/AndraNgelantur99/references" className="text-[0.65rem] uppercase tracking-widest">
                    <Library className="w-4 h-4 mr-2" /> Bank Referensi
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/AndraNgelantur99/analytics" className="text-[0.65rem] uppercase tracking-widest">
                    <BarChart3 className="w-4 h-4 mr-2" /> Analitik
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-[0.65rem] uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-4 w-px bg-border hidden sm:block" />
              <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground hidden sm:block">
                Workspace: {user?.email}
              </span>
            </div>
            <Link href="/admin/AndraNgelantur99/essays/new">
              <button className="bg-white text-black text-[0.6rem] uppercase font-bold tracking-widest px-4 py-2 hover:bg-silver transition-all flex items-center gap-2">
                <PlusCircle className="w-3.5 h-3.5" /> Buat Konten
              </button>
            </Link>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
