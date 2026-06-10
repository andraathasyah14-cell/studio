'use client';

import { use } from 'react';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { essays, books, resources } from "@/lib/data";
import Link from "next/link";
import { FileText, BookOpen, Link as LinkIcon, ArrowLeft } from "lucide-react";

export default function TopicPage({ params }: { params: Promise<{ tag: string }> }) {
  const resolvedParams = use(params);
  const tag = decodeURIComponent(resolvedParams.tag);

  const relatedEssays = essays.filter(e => e.tags.includes(tag));
  const relatedBooks = books.filter(b => b.tags.includes(tag));
  const relatedResources = resources.filter(r => r.tags?.includes(tag));

  const totalItems = relatedEssays.length + relatedBooks.length + relatedResources.length;

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
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
            {tag}
          </h1>
          <p className="font-serif text-lg italic text-muted-foreground max-w-2xl leading-relaxed">
            Koleksi pemikiran, referensi bacaan, dan data pendukung yang berkaitan dengan "{tag}". Ditemukan {totalItems} item terkait.
          </p>
        </header>

        <div className="space-y-24">
          {/* Related Essays */}
          {relatedEssays.length > 0 && (
            <section>
              <h2 className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-10 flex items-center gap-4">
                Esai Terkait <div className="h-px flex-1 bg-border" />
              </h2>
              <div className="grid grid-cols-1 gap-12">
                {relatedEssays.map((essay, i) => (
                  <div key={i} className="group">
                    <span className="text-[0.6rem] text-muted-foreground mb-2 block">{essay.date}</span>
                    <h3 className="text-2xl font-display font-medium text-white group-hover:text-primary transition-colors mb-3">
                      {essay.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-4">
                      {essay.summary}
                    </p>
                    <Link href="/#essays" className="text-[0.6rem] uppercase tracking-widest text-white border-b border-white pb-0.5">
                      Baca Esai
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Books */}
          {relatedBooks.length > 0 && (
            <section>
              <h2 className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-10 flex items-center gap-4">
                Literatur <div className="h-px flex-1 bg-border" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
                {relatedBooks.map((book, i) => (
                  <div key={i} className="bg-background p-8 flex flex-col gap-4">
                    <div>
                      <BookOpen className="w-4 h-4 text-muted-foreground mb-4" />
                      <h3 className="font-display text-lg font-medium text-white">{book.title}</h3>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    <p className="font-serif text-[0.8rem] italic text-muted-foreground mt-auto">"{book.note}"</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Resources */}
          {relatedResources.length > 0 && (
            <section>
              <h2 className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-10 flex items-center gap-4">
                Pustaka & Data <div className="h-px flex-1 bg-border" />
              </h2>
              <div className="divide-y divide-border border-t border-b border-border">
                {relatedResources.map((res, i) => (
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
                      href={res.link} 
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
      </main>
      
      <Footer />
    </div>
  );
}
