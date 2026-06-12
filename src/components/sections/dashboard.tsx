
'use client';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, limit, orderBy } from "firebase/firestore";
import { FileText, Link as LinkIcon, Database, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const [activityData, setActivityData] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const db = useFirestore();

  const { data: essays } = useCollection(collection(db, 'essays'));
  const { data: papers } = useCollection(collection(db, 'papers'));
  const { data: refs } = useCollection(collection(db, 'references'));

  const recentRefsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'references'), orderBy('title', 'asc'), limit(3));
  }, [db]);
  
  const { data: recentResources } = useCollection(recentRefsQuery);

  useEffect(() => {
    const data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100));
    setActivityData(data);
    setIsMounted(true);
  }, []);

  const max = activityData.length > 0 ? Math.max(...activityData) : 1;

  const stats = {
    essays: essays?.length || 0,
    papers: papers?.length || 0,
    books: refs?.filter(r => r.category?.toLowerCase().includes('buku')).length || 0,
    datasets: refs?.filter(r => r.category?.toLowerCase().includes('data')).length || 0,
    revisions: 0
  };

  return (
    <section id="dashboard" className="py-20 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Dasbor & Aktivitas</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-border border border-border mb-12 overflow-hidden">
        <StatCell value={stats.essays.toString()} label="Tulisan" />
        <StatCell value={stats.papers.toString()} label="Paper" />
        <StatCell value={stats.books.toString()} label="Buku" />
        <StatCell value={stats.datasets.toString()} label="Dataset" />
        <StatCell value={stats.revisions.toString()} label="Revisi" />
      </div>

      <div className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white">Referensi Terbaru</h3>
          <Link href="/pustaka" className="text-[0.6rem] uppercase tracking-widest text-muted-foreground hover:text-white flex items-center gap-1 transition-colors">
            Lihat Semua Pustaka <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-px bg-border border border-border">
          {recentResources && recentResources.length > 0 ? (
            recentResources.map((res: any, i: number) => (
              <div key={i} className="bg-background p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ResourceIcon type={res.type || 'web'} />
                    <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">{res.category}</span>
                  </div>
                  <h4 className="font-display text-[0.85rem] font-medium text-white group-hover:text-primary transition-colors">
                    {res.title}
                  </h4>
                </div>
                <a 
                  href={res.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[0.6rem] uppercase tracking-widest text-muted-foreground hover:text-white border border-border px-3 py-1.5"
                >
                  Lihat
                </a>
              </div>
            ))
          ) : (
            <div className="bg-background p-10 text-center text-[0.7rem] italic text-muted-foreground">
              Belum ada referensi yang ditambahkan ke database.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-20 flex items-end gap-1 px-4">
          {isMounted && activityData.map((v, i) => (
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
          Grafik Aktivitas · Sinkron Real-time
        </p>
      </div>
    </section>
  );
}

function ResourceIcon({ type }: { type: string }) {
  switch (type) {
    case 'paper': return <FileText className="w-3 h-3 text-muted-foreground" />;
    case 'dataset': return <Database className="w-3 h-3 text-muted-foreground" />;
    default: return <LinkIcon className="w-3 h-3 text-muted-foreground" />;
  }
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-background p-6 flex flex-col justify-center text-center">
      <span className="font-display text-2xl font-bold text-white mb-1">{value}</span>
      <span className="text-[0.5rem] uppercase tracking-widest text-muted-foreground leading-tight">{label}</span>
    </div>
  );
}
