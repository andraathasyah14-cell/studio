
'use client';

import React from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { FileText, BookOpen, Clock, AlertCircle, TrendingUp, CheckCircle2, Library } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const db = useFirestore();

  const essaysQuery = React.useMemo(() => {
    if (!db) return null;
    return collection(db, 'essays');
  }, [db]);

  const papersQuery = React.useMemo(() => {
    if (!db) return null;
    return collection(db, 'papers');
  }, [db]);

  const referencesQuery = React.useMemo(() => {
    if (!db) return null;
    return collection(db, 'references');
  }, [db]);

  const recentActivityQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(5));
  }, [db]);

  const { data: essays, loading: essaysLoading } = useCollection(essaysQuery);
  const { data: papers, loading: papersLoading } = useCollection(papersQuery);
  const { data: refs, loading: refsLoading } = useCollection(referencesQuery);
  const { data: logs, loading: logsLoading } = useCollection(recentActivityQuery);

  const stats = {
    totalEssays: essays?.length || 0,
    published: essays?.filter(e => e.status === 'published').length || 0,
    drafts: essays?.filter(e => e.status === 'draft').length || 0,
    totalPapers: papers?.length || 0,
    totalRefs: refs?.length || 0,
    scheduled: essays?.filter(e => e.status === 'scheduled').length || 0,
  };

  return (
    <div className="p-8 space-y-10">
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tighter text-white">Ringkasan Sistem</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest mt-2">Pusat Kendali Riset & Publikasi</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <StatItem 
          label="Total Esai" 
          value={stats.totalEssays} 
          icon={<FileText className="w-4 h-4" />} 
          loading={essaysLoading}
        />
        <StatItem 
          label="Paper Akademik" 
          value={stats.totalPapers} 
          icon={<BookOpen className="w-4 h-4" />} 
          loading={papersLoading}
        />
        <StatItem 
          label="Bank Referensi" 
          value={stats.totalRefs} 
          icon={<Library className="w-4 h-4" />} 
          loading={refsLoading}
        />
        <StatItem 
          label="Status Terbit" 
          value={stats.published} 
          icon={<TrendingUp className="w-4 h-4" />} 
          loading={essaysLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-[0.65rem] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" /> Aktivitas Terbaru
          </h2>
          <div className="border border-border bg-card divide-y divide-border">
            {logsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))
            ) : logs?.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground text-sm italic font-serif">
                Belum ada aktivitas yang tercatat. Silakan buat konten baru untuk memulai.
              </div>
            ) : (
              logs?.map((log, i) => (
                <div key={i} className="p-4 flex justify-between items-center group hover:bg-white/[0.02] transition-colors">
                  <div className="space-y-1">
                    <p className="text-[0.75rem] text-white font-medium">{log.action}</p>
                    <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">
                      {new Date(log.timestamp).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/30" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-6">
          <h2 className="text-[0.65rem] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
            Status Publikasi
          </h2>
          <div className="p-6 border border-border bg-card space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">Publication Rate</span>
              <span className="text-2xl font-display font-bold text-white">
                {stats.totalEssays > 0 ? Math.round((stats.published / stats.totalEssays) * 100) : 0}%
              </span>
            </div>
            <div className="h-1 bg-border w-full">
              <div 
                className="h-full bg-white transition-all duration-1000" 
                style={{ width: `${stats.totalEssays > 0 ? (stats.published / stats.totalEssays) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[0.6rem] italic text-muted-foreground leading-relaxed">
              Database saat ini kosong. Angka yang Anda lihat di website utama sebelum login adalah data dummy. Mulailah menulis untuk mengisi dasbor ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, icon, loading }: { label: string; value: number; icon: React.ReactNode; loading: boolean }) {
  return (
    <div className="p-8 bg-card flex flex-col gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[0.6rem] uppercase tracking-widest font-bold">{label}</span>
      </div>
      {loading ? (
        <Skeleton className="h-10 w-1/2" />
      ) : (
        <span className="text-4xl font-display font-bold text-white tracking-tighter">{value}</span>
      )}
    </div>
  );
}
