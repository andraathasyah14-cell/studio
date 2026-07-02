
'use client';

import React, { use, useMemo } from 'react';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import Link from "next/link";
import { FileText, BookOpen, ArrowLeft } from "lucide-react";

export default function TopicPage({ params }: { params: Promise<{ tag: string }> }) {
  const resolvedParams = use(params);
  const tag = decodeURIComponent(resolvedParams.tag).toLowerCase();
  const db = useFirestore();

  // Ambil semua data dan filter di memori untuk menghindari kebutuhan indeks komposit manual
  const essaysQuery = useMemo(() => db ? query(collection(db, 'essays'), where('status', '==', 'published')) : null, [db]);
  const refsQuery = useMemo(() => db ? collection(db, 'references') : null, [db]);
  const papersQuery = useMemo(() => db ? collection(db, 'papers') : null, [db]);

  const { data: essays, loading: essaysLoading } = useCollection(essaysQuery);
  const { data: refs, loading: refsLoading } = useCollection(refsQuery);
  const { data: papers, loading: papersLoading } = useCollection(papersQuery);

  const relatedEssays = useMemo(() => {
    return essays?.filter((e: any) => e.tags?.some((t: string) => t.toLowerCase() === tag)) || [];
  }, [essays, tag]);

  const relatedBooks = useMemo(() => {
    return refs?.filter((r: any) => 
      r.category?.toLowerCase() === 'buku' && 
      r.tags?.some((t: string) => t.toLowerCase() === tag)
    ) || [];
  }, [refs, tag]);

  const relatedPapers = useMemo(() => {
    return papers?.filter((p: any) => 
      p.category?.toLowerCase() === tag || 
      p.keywords?.some((k: string) => k.toLowerCase() === tag)
    ) || [];
  }, [papers, tag]);

  const totalItems = relatedEssays.length + relatedBooks.length + relatedPapers.length;
  const loading = essaysLoading || refsLoading || papersLoading;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-[860px] mx-auto py-20 px-6">
        <Link 
          href="/#essays" 
          className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Kembali
        </Link>

        <header className="mb-20">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground mb-4 block font-bold">Topik</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 tracking-tighter capitalize">
            {tag}
          </h1>
          <p className="font-serif text-lg italic text-muted-foreground max-w-2xl leading-relaxed">
            Koleksi pemikiran, referensi bacaan, dan data pendukung yang berkaitan dengan "{tag}". Ditemukan {totalItems} item terkait.
          </p>
        </header>

        {loading ? (
          <div className="py-20 text-center text-[0.6rem] uppercase tracking-widest text-muted-foreground">Mencari Koneksi Data...</div>
        ) : (
          <div className="space-y-24">
            {relatedEssays.length > 0 && (
              <section>
                <h2 className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-10 flex items-center gap-4">
                  Esai Terkait <div className="h-px flex-1 bg-border" />
                </h2>
                <div className="grid grid-cols-1 gap-12">
                  {relatedEssays.map((essay: any, i: number) => (
                    <div key={i} className="group">
                      <span className="text-[0.6rem] text-muted-foreground mb-2 block">
                        {new Date(essay.updatedAt).toLocaleDateString('id-ID')}
                      </span>
                      <Link href={`/essay/${essay.id}`}>
                        <h3 className="text-2xl font-display font-medium text-white group-hover:text-primary transition-colors mb-3">
                          {essay.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-4 line-clamp-2 italic font-serif">
                        {essay.content?.substring(0, 200)}...
                      </p>
                      <Link href={`/essay/${essay.id}`} className="text-[0.6rem] uppercase tracking-widest text-white border-b border-white pb-0.5">
                        Baca Esai
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {relatedBooks.length > 0 && (
              <section>
                <h2 className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-10 flex items-center gap-4">
                  Literatur <div className="h-px flex-1 bg-border" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
                  {relatedBooks.map((book: any, i: number) => (
                    <div key={i} className="bg-background p-8 flex flex-col gap-4">
                      <div>
                        <BookOpen className="w-4 h-4 text-muted-foreground mb-4" />
                        <h3 className="font-display text-lg font-medium text-white">{book.title}</h3>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                      </div>
                      <p className="font-serif text-[0.8rem] italic text-muted-foreground mt-auto line-clamp-3">
                        "{book.quote || book.note}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {relatedPapers.length > 0 && (
              <section>
                <h2 className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-10 flex items-center gap-4">
                  Pustaka & Data <div className="h-px flex-1 bg-border" />
                </h2>
                <div className="divide-y divide-border border-t border-b border-border">
                  {relatedPapers.map((res: any, i: number) => (
                    <div key={i} className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-none border border-border">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-display text-sm font-medium text-white">{res.title}</h3>
                          <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest">{res.category} · {res.author}</p>
                        </div>
                      </div>
                      <Link 
                        href={res.link || '/pustaka'} 
                        target="_blank" 
                        className="text-[0.6rem] uppercase tracking-widest border border-border px-4 py-2 hover:bg-white hover:text-black transition-all"
                      >
                        Buka Referensi
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {totalItems === 0 && (
              <div className="py-20 text-center border border-dashed border-border">
                <p className="text-muted-foreground italic font-serif">Belum ada konten yang terhubung dengan topik ini.</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
