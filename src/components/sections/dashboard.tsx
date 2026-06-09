'use client';

import { resources } from "@/lib/data";
import { FileText, Link as LinkIcon, Download, ExternalLink, Database } from "lucide-react";

export default function Dashboard() {
  const activityData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100));
  const max = Math.max(...activityData);

  return (
    <section id="dashboard" className="py-20 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Dasbor & Sumber Daya</span>
        <div className="h-px w-full bg-border" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-border border border-border mb-12 overflow-hidden">
        <StatCell value="7" label="Opini diterbitkan" />
        <StatCell value="18" label="Paper ditambahkan" />
        <StatCell value="2" label="Buku selesai" />
        <StatCell value="5" label="Dataset digunakan" />
        <StatCell value="3" label="Revisi tulisan" />
      </div>

      {/* Resource Library */}
      <div className="mb-16">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white mb-6">Pustaka Referensi & Paper</h3>
        <div className="grid grid-cols-1 gap-px bg-border border border-border">
          {resources.map((res, i) => (
            <div key={i} className="bg-background p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ResourceIcon type={res.type} />
                  <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">{res.category} {res.year && `· ${res.year}`}</span>
                </div>
                <h4 className="font-display text-[0.95rem] font-medium text-white group-hover:text-primary transition-colors">
                  {res.title}
                </h4>
                <p className="text-xs text-muted-foreground">{res.author}</p>
                <p className="text-[0.7rem] italic text-muted-foreground/80 mt-1">{res.note}</p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <a 
                  href={res.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-border text-[0.65rem] uppercase tracking-widest text-muted-foreground hover:text-white hover:border-white transition-all"
                >
                  {res.type === 'paper' ? <Download className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                  {res.type === 'paper' ? 'Unduh Paper' : 'Kunjungi Web'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Graph */}
      <div className="space-y-4">
        <div className="h-24 flex items-end gap-1 px-4">
          {activityData.map((v, i) => (
            <div 
              key={i} 
              className="flex-1 bg-muted group relative cursor-default"
              style={{ height: `${(v / max) * 100}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black text-[0.5rem] px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {v} events
              </div>
              <div className="w-full h-full bg-muted-foreground/10 group-hover:bg-muted-foreground/30 transition-colors" />
            </div>
          ))}
        </div>
        <p className="text-[0.6rem] text-muted-foreground tracking-widest text-center uppercase">
          Aktivitas harian · 30 hari terakhir
        </p>
      </div>
    </section>
  );
}

function ResourceIcon({ type }: { type: 'paper' | 'web' | 'dataset' }) {
  switch (type) {
    case 'paper': return <FileText className="w-3 h-3 text-muted-foreground" />;
    case 'web': return <LinkIcon className="w-3 h-3 text-muted-foreground" />;
    case 'dataset': return <Database className="w-3 h-3 text-muted-foreground" />;
    default: return null;
  }
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-background p-6 flex flex-col justify-center text-center">
      <span className="font-display text-4xl font-bold text-white mb-1">{value}</span>
      <span className="text-[0.55rem] uppercase tracking-widest text-muted-foreground leading-tight">{label}</span>
    </div>
  );
}
