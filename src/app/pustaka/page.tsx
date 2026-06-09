'use client';

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { resources } from "@/lib/data";
import { FileText, Link as LinkIcon, Download, ExternalLink, Database, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function PustakaPage() {
  const [search, setSearch] = useState("");

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(search.toLowerCase()) ||
    res.author.toLowerCase().includes(search.toLowerCase()) ||
    res.category.toLowerCase().includes(search.toLowerCase()) ||
    res.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-[860px] mx-auto py-20 px-6">
        <div className="mb-16">
          <h1 className="font-display text-4xl font-bold text-white mb-4">Pustaka Referensi</h1>
          <p className="font-serif text-lg italic text-muted-foreground leading-relaxed max-w-2xl">
            Repositori paper penelitian, laporan institusi, dan dataset yang saya gunakan sebagai fondasi dalam membangun argumen di setiap esai.
          </p>
        </div>

        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari paper, penulis, atau topik..." 
            className="pl-12 py-6 bg-card border-border rounded-none focus:ring-0 focus:border-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-px bg-border border border-border">
          {filteredResources.map((res, i) => (
            <div key={i} className="bg-background p-8 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ResourceIcon type={res.type} />
                    <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                      {res.category} {res.year && `· ${res.year}`}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-medium text-white group-hover:text-primary transition-colors leading-tight">
                    {res.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{res.author}</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <a 
                    href={res.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 border border-border text-[0.65rem] uppercase tracking-widest text-muted-foreground hover:text-white hover:border-white transition-all"
                  >
                    {res.type === 'paper' ? <Download className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                    {res.type === 'paper' ? 'Unduh Paper' : 'Kunjungi'}
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-serif text-[0.85rem] italic text-muted-foreground leading-relaxed">
                  "{res.note}"
                </p>
                
                {res.tags && (
                  <div className="flex flex-wrap gap-2">
                    {res.tags.map(tag => (
                      <span key={tag} className="text-[0.6rem] uppercase tracking-tighter border border-border px-1.5 py-0.5 text-muted-foreground/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredResources.length === 0 && (
            <div className="bg-background p-12 text-center">
              <p className="text-muted-foreground text-sm italic">Tidak ada referensi yang ditemukan untuk "{search}"</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function ResourceIcon({ type }: { type: 'paper' | 'web' | 'dataset' | 'book' }) {
  switch (type) {
    case 'paper': return <FileText className="w-4 h-4 text-muted-foreground" />;
    case 'web': return <LinkIcon className="w-4 h-4 text-muted-foreground" />;
    case 'dataset': return <Database className="w-4 h-4 text-muted-foreground" />;
    default: return <FileText className="w-4 h-4 text-muted-foreground" />;
  }
}
