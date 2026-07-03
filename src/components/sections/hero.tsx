
'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function Hero() {
  const db = useFirestore();
  
  const essaysRef = useMemoFirebase(() => db ? collection(db, 'essays') : null, [db]);
  const papersRef = useMemoFirebase(() => db ? collection(db, 'papers') : null, [db]);
  const refsRef = useMemoFirebase(() => db ? collection(db, 'references') : null, [db]);
  const logsRef = useMemoFirebase(() => db ? collection(db, 'activity_logs') : null, [db]);

  const { data: essays } = useCollection(essaysRef);
  const { data: papers } = useCollection(papersRef);
  const { data: refs } = useCollection(refsRef);
  const { data: logs } = useCollection(logsRef);

  const statsCount = useMemo(() => ({
    essays: essays?.filter(e => e.status === 'published').length || 0,
    papers: papers?.length || 0,
    books: refs?.filter(r => r.category?.toLowerCase() === 'buku').length || 0,
    // Total Referensi sekarang adalah gabungan Paper + Bank Referensi
    totalRefs: (papers?.length || 0) + (refs?.length || 0),
    totalLogs: logs?.length || 0,
  }), [essays, papers, refs, logs]);

  return (
    <section id="home" className="py-24 px-6 border-b border-border grid grid-cols-1 md:grid-cols-5 gap-16 items-end">
      <div className="md:col-span-3 space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] text-white">
          Opini.<br />
          <span className="text-muted-foreground font-light">Dengan bukti.</span><br />
          Yang bisa diuji.
        </h1>
        <p className="font-serif text-lg italic text-muted-foreground leading-relaxed max-w-md">
          Tempat mendokumentasikan cara berpikir — bukan hanya kesimpulannya. Setiap esai datang dengan sumber, asumsi, dan bukti yang terbuka untuk diperiksa.
        </p>
      </div>
      
      <div className="md:col-span-2 space-y-px">
        <StatRow label="Tulisan Terbit" value={statsCount.essays} />
        <StatRow label="Paper Riset" value={statsCount.papers} />
        <StatRow label="Literatur Buku" value={statsCount.books} />
        <StatRow label="Basis Pengetahuan" value={statsCount.totalRefs} />
        <StatRow label="Log Aktivitas" value={statsCount.totalLogs} />
      </div>
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-baseline py-3 border-t border-border">
      <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-display text-2xl font-semibold text-white">{value}</span>
    </div>
  );
}
