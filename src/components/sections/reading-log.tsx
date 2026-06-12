
'use client';

import { useCollection, useFirestore } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Star } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ReadingLog() {
  const db = useFirestore();
  const booksQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'references'), where('category', '==', 'Buku'));
  }, [db]);

  const { data: books, loading } = useCollection(booksQuery);

  return (
    <section id="reading" className="py-20 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Jejak Bacaan</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border overflow-hidden">
        {loading ? (
          <div className="col-span-2 py-20 text-center text-[0.6rem] uppercase tracking-widest text-muted-foreground">Memuat data buku...</div>
        ) : books && books.length > 0 ? (
          books.map((book: any, i: number) => (
            <div key={i} className="bg-background p-8 flex flex-col gap-4 h-full">
              <div className="space-y-1">
                <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                  {book.status || 'Selesai'}
                </span>
                <h3 className="font-display text-lg font-medium text-white leading-tight">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground">{book.author}</p>
              </div>
              
              <p className="font-serif text-[0.85rem] italic text-muted-foreground leading-relaxed border-t border-border pt-4 mt-auto">
                "{book.quote || book.note || 'Tidak ada catatan.'}"
              </p>

              <div className="flex flex-wrap gap-1 mt-2">
                {book.tags?.map((tag: string) => (
                  <Link 
                    key={tag} 
                    href={`/topik/${encodeURIComponent(tag)}`}
                    className="text-[0.55rem] uppercase tracking-tighter border border-border px-1 py-0.5 text-muted-foreground/60 hover:text-white hover:border-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star 
                    key={idx} 
                    className={`w-2.5 h-2.5 ${idx < (book.rating || 4) ? 'fill-muted-foreground text-muted-foreground' : 'text-border'}`} 
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-12 text-center text-sm italic font-serif text-muted-foreground">
            Belum ada catatan buku di database.
          </div>
        )}
      </div>
    </section>
  );
}
