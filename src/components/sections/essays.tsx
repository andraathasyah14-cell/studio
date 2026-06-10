import { essays } from "@/lib/data";
import Link from "next/link";

export default function Essays() {
  return (
    <section id="essays" className="py-20 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Esai & Opini</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div className="divide-y divide-border">
        {essays.map((essay, i) => (
          <div key={i} className="group py-8 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-2">
              <h3 className="text-xl font-medium text-muted-foreground group-hover:text-white transition-colors cursor-pointer">
                {essay.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                {essay.summary}
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-2 text-right">
              <span className="text-[0.7rem] text-muted-foreground tracking-wider">{essay.date}</span>
              <div className="flex flex-wrap gap-1 md:justify-end">
                {essay.tags.map(tag => (
                  <Link 
                    key={tag} 
                    href={`/topik/${encodeURIComponent(tag)}`}
                    className="text-[0.6rem] uppercase tracking-tighter border border-border px-1.5 py-0.5 text-muted-foreground hover:border-white hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <ConfidenceBadge confidence={essay.confidence} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  let colorClass = "border-orange-900/30 text-orange-500/80";
  if (confidence >= 75) colorClass = "border-emerald-900/30 text-emerald-500/80";
  else if (confidence < 60) colorClass = "border-rose-900/30 text-rose-500/80";

  return (
    <div className={`mt-2 font-display text-[0.65rem] font-medium tracking-wide border px-2 py-0.5 ${colorClass}`}>
      Keyakinan {confidence}%
    </div>
  );
}
