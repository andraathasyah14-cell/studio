import { books } from "@/lib/data";
import { Star } from "lucide-react";
import Link from "next/link";

export default function ReadingLog() {
  return (
    <section id="reading" className="py-20 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Jejak Bacaan</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border overflow-hidden">
        {books.map((book, i) => (
          <div key={i} className="bg-background p-8 flex flex-col gap-4 h-full">
            <div className="space-y-1">
              <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                {book.status}
              </span>
              <h3 className="font-display text-lg font-medium text-white leading-tight">
                {book.title}
              </h3>
              <p className="text-xs text-muted-foreground">{book.author}</p>
            </div>
            
            <p className="font-serif text-[0.85rem] italic text-muted-foreground leading-relaxed border-t border-border pt-4 mt-auto">
              "{book.note}"
            </p>

            <div className="flex flex-wrap gap-1 mt-2">
              {book.tags.map(tag => (
                <Link 
                  key={tag} 
                  href={`/topik/${encodeURIComponent(tag)}`}
                  className="text-[0.55rem] uppercase tracking-tighter border border-border px-1 py-0.5 text-muted-foreground/60 hover:text-white hover:border-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {book.rating && (
              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-2.5 h-2.5 ${i < (book.rating || 0) ? 'fill-muted-foreground text-muted-foreground' : 'text-border'}`} 
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
