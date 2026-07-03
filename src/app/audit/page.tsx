
'use client';

import React, { useMemo } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { History, ShieldCheck, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AuditLogPage() {
  const db = useFirestore();

  const logsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(100));
  }, [db]);

  const { data: logs, loading } = useCollection(logsQuery);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      <Header />
      
      <main className="max-w-[800px] mx-auto py-20 px-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Beranda
        </Link>

        <header className="mb-16 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white text-black">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground font-bold">Integritas Data</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none">
            Audit Log Publik
          </h1>
          <p className="font-serif text-lg italic text-muted-foreground leading-relaxed max-w-2xl">
            Sesuai prinsip transparansi, setiap perubahan pada database — mulai dari penerbitan esai hingga pembaruan referensi — dicatat secara permanen dan dapat diaudit oleh publik.
          </p>
        </header>

        {loading ? (
          <div className="py-20 text-center text-[0.6rem] uppercase tracking-widest text-muted-foreground">Membuka Ledger...</div>
        ) : (
          <div className="space-y-px bg-border border border-border">
            {logs && logs.length > 0 ? (
              logs.map((log: any, i: number) => (
                <div key={i} className="bg-background p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <History className="w-3.5 h-3.5 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[0.85rem] text-white font-medium lowercase leading-relaxed">
                        {log.action}
                      </p>
                      <div className="flex items-center gap-2 text-[0.55rem] uppercase tracking-widest text-muted-foreground font-bold">
                        <span className="text-white/40">HASH: {log.id?.substring(0, 8)}</span>
                        <span className="h-2 w-px bg-border" />
                        <span>Andra Ngelantur CMS</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[0.65rem] text-muted-foreground font-mono bg-white/[0.03] px-2 py-1 border border-border shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleString('id-ID', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-background p-20 text-center italic text-muted-foreground text-sm font-serif">
                Ledger masih kosong. Belum ada aktivitas yang tercatat.
              </div>
            )}
          </div>
        )}

        <footer className="mt-20 p-8 border border-border bg-white/[0.02] text-center space-y-4">
          <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground leading-relaxed">
            Data ini bersifat <strong>Read-Only</strong> dan ditarik langsung dari sistem audit Firestore.<br/>
            Tidak ada entri yang dapat dihapus atau diubah setelah dibuat.
          </p>
        </footer>
      </main>
      
      <Footer />
    </div>
  );
}
