
'use client';

import React from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function Hero() {
  const db = useFirestore();
  const { data: essays } = useCollection(collection(db, 'essays'));
  const { data: papers } = useCollection(collection(db, 'papers'));
  const { data: refs } = useCollection(collection(db, 'references'));

  const statsCount = {
    essays: essays?.length || 0,
    papers: papers?.length || 0,
    books: refs?.filter(r => r.category?.toLowerCase().includes('buku') || r.type === 'book').length || 0,
    revisions: 0, // Versi audit trail
    retractions: 0
  };

  return (
    <section id="home" className="py-24 px-6 border-b border-border grid grid-cols-1 md:grid-cols-5 gap-16 items-end">
      <div className="md:col-span-3 space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] text-white">
          Opini.<br />
          <span className="text-muted-foreground font-light">Dengan bukti.</span><br />
          Yang bisa diuji.
        </h1>
        <p className="font-serif text-lg italic text-muted-foreground leading-relaxed max-w-md">
          Tempat mendokumentasikan cara berpikir — bukan hanya kesimpulannya. Setiap esai datang dengan sumber, asumsi, dan tingkat keyakinan yang eksplisit.
        </p>
      </div>
      
      <div className="md:col-span-2 space-y-px">
        <StatRow label="Tulisan" value={statsCount.essays} />
        <StatRow label="Paper digunakan" value={statsCount.papers} />
        <StatRow label="Buku dibaca" value={statsCount.books} />
        <StatRow label="Revisi tulisan" value={statsCount.revisions} />
        <StatRow label="Opini ditarik" value={statsCount.retractions} />
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
