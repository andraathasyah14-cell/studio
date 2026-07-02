
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

export default function EssayDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const db = useFirestore();
  const router = useRouter();

  const essayRef = React.useMemo(() => (id && db ? doc(db, 'essays', id) : null), [id, db]);
  const { data: essay, loading } = useDoc(essayRef);

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

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      <Header />
      
      <main className="max-w-[800px] mx-auto py-20 px-6">
        <Link href="/#essays">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white mb-12 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </Link>

        <article className="space-y-12">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-[0.65rem] uppercase tracking-widest text-muted-foreground font-bold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(essay.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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
      </main>

      <Footer />
    </div>
  );
}
