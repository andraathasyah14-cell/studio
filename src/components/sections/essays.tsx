
'use client';

import React from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import Link from "next/link";

export default function Essays() {
  const db = useFirestore();
  
  // Sederhanakan query untuk menghindari kebutuhan indeks komposit manual yang sering gagal di prototype
  const essaysQuery = React.useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'essays'), 
      where('status', '==', 'published')
    );
  }, [db]);

  const { data: essays, loading } = useCollection(essaysQuery);

  // Urutkan secara manual di memori agar tetap rapi tanpa indeks komposit
  const sortedEssays = React.useMemo(() => {
    if (!essays) return [];
    return [...essays].sort((a: any, b: any) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [essays]);

  if (loading) return (
    <div className="py-20 px-6 text-center text-[0.6rem] uppercase tracking-widest text-muted-foreground">
      Membuka Arsip Esai...
    </div>
  );

  return (
    <section id="essays" className="py-20 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Esai & Opini</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div className="divide-y divide-border">
        {sortedEssays && sortedEssays.length > 0 ? (
          sortedEssays.map((essay: any) => (
            <div key={essay.id} className="group py-10 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 space-y-4">
                <Link href={`/essay/${essay.id}`} className="block">
                  <h3 className="text-2xl font-display font-medium text-muted-foreground group-hover:text-white transition-colors cursor-pointer leading-tight">
                    {essay.title}
                  </h3>
                </Link>
                <p className="text-[0.95rem] font-serif italic text-muted-foreground leading-relaxed max-w-prose line-clamp-3">
                  {essay.content?.substring(0, 200)}...
                </p>
                <Link href={`/essay/${essay.id}`} className="inline-block text-[0.6rem] uppercase tracking-widest text-white border-b border-white pb-0.5 hover:opacity-70 transition-opacity">
                  Baca Selengkapnya
                </Link>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-3 text-right">
                <span className="text-[0.7rem] font-bold text-muted-foreground tracking-widest uppercase">
                  {new Date(essay.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <div className="flex flex-wrap gap-1.5 md:justify-end">
                  {essay.tags?.map((tag: string) => (
                    <Link 
                      key={tag} 
                      href={`/topik/${encodeURIComponent(tag)}`}
                      className="text-[0.55rem] uppercase tracking-tighter border border-border px-2 py-0.5 text-muted-foreground hover:border-white hover:text-white transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm italic font-serif text-muted-foreground">Belum ada pemikiran yang dibagikan secara publik.</p>
          </div>
        )}
      </div>
    </section>
  );
}
