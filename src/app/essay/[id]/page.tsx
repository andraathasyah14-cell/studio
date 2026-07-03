
'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, limit } from 'firebase/firestore';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function EssayDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const db = useFirestore();
  const { toast } = useToast();

  const essayRef = useMemoFirebase(() => (id && db ? doc(db, 'essays', id) : null), [id, db]);
  const { data: essay, loading } = useDoc(essayRef);

  // Hitung Estimasi Waktu Baca
  const readingTime = useMemo(() => {
    if (!essay?.content) return 1;
    const words = essay.content.split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [essay?.content]);

  // Cari Esai Terkait
  const relatedQuery = useMemoFirebase(() => {
    if (!db || !essay?.tags || essay.tags.length === 0) return null;
    return query(
      collection(db, 'essays'),
      where('status', '==', 'published'),
      where('tags', 'array-contains', essay.tags[0]),
      limit(3)
    );
  }, [db, essay?.tags]);

  const { data: relatedEssays } = useCollection(relatedQuery);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Tersalin", description: "Tautan esai telah disalin ke clipboard." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-[0.6rem] uppercase tracking-widest text-muted-foreground">
          Membuka Arsip...
        </div>
      </div>
    );
  }

  if (!essay) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-display font-bold text-white mb-4">Tulisan Tidak Ditemukan</h1>
        <Link href="/">
          <Button variant="outline" className="rounded-none border-border uppercase text-[0.6rem] tracking-widest">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );
  }

  const filteredRelated = relatedEssays?.filter(e => e.id !== id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      <Header />
      
      <main className="max-w-[800px] mx-auto py-20 px-6">
        <div className="flex justify-between items-center mb-12">
          <Link href="/#essays">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground hover:text-white">
            <Share2 className="w-3.5 h-3.5 mr-2" /> Bagikan
          </Button>
        </div>

        <article className="space-y-12">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-[0.65rem] uppercase tracking-widest text-muted-foreground font-bold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {essay.updatedAt ? new Date(essay.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readingTime} Menit Baca
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {essay.category || 'Tanpa Kategori'}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tighter">
              {essay.title}
            </h1>

            <div className="flex flex-wrap gap-2 pt-2">
              {essay.tags?.map((tag: string) => (
                <Link 
                  key={tag} 
                  href={`/topik/${encodeURIComponent(tag)}`}
                  className="text-[0.6rem] uppercase tracking-tighter border border-border px-2 py-0.5 text-muted-foreground hover:border-white hover:text-white transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </header>

          <div className="h-px w-full bg-border" />

          <div className="font-serif text-lg md:text-xl text-muted-foreground leading-relaxed space-y-8 whitespace-pre-wrap italic">
            {essay.content}
          </div>
        </article>

        {filteredRelated && filteredRelated.length > 0 && (
          <section className="mt-32 pt-16 border-t border-border space-y-10">
            <h3 className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground font-bold text-center">
              Tulisan Terkait
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRelated.map((rel) => (
                <Link key={rel.id} href={`/essay/${rel.id}`} className="group space-y-4 p-6 border border-border hover:border-white/20 transition-all bg-white/[0.01]">
                  <span className="text-[0.55rem] uppercase tracking-widest text-muted-foreground block">
                    {rel.updatedAt ? new Date(rel.updatedAt).toLocaleDateString('id-ID') : '-'}
                  </span>
                  <h4 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 italic font-serif">
                    {rel.content?.substring(0, 100)}...
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
