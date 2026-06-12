
'use client';

import React, { useRef, useMemo } from 'react';
import Link from "next/link";
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function KnowledgeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const db = useFirestore();
  const { data: essays } = useCollection(collection(db, 'essays'));

  // Ambil semua tag unik dari esai secara dinamis
  const nodes = useMemo(() => {
    const allTags = new Set<string>();
    essays?.forEach(e => e.tags?.forEach((t: string) => allTags.add(t)));
    
    if (allTags.size === 0) {
      // Default nodes if no data yet
      return [
        { id: 0, label: 'Ekonomi', x: 50, y: 45 },
        { id: 1, label: 'Pendidikan', x: 28, y: 28 },
        { id: 2, label: 'Teknologi', x: 72, y: 25 },
        { id: 3, label: 'Hukum', x: 20, y: 60 }
      ];
    }

    return Array.from(allTags).slice(0, 15).map((tag, i) => ({
      id: i,
      label: tag,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80
    }));
  }, [essays]);

  const edges = useMemo(() => {
    const pairs: [number, number][] = [];
    if (nodes.length <= 1) return pairs;
    
    for (let i = 0; i < nodes.length - 1; i++) {
      if (Math.random() > 0.4) pairs.push([i, i + 1]);
      if (i > 2 && Math.random() > 0.6) pairs.push([0, i]);
      if (i > 5 && Math.random() > 0.8) pairs.push([2, i]);
    }
    return pairs;
  }, [nodes]);

  return (
    <section className="py-20 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Knowledge Graph</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div 
        ref={containerRef}
        className="relative h-[450px] w-full bg-card/30 border border-border overflow-hidden cursor-crosshair"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={`${nodes[a]?.x}%`}
              y1={`${nodes[a]?.y}%`}
              x2={`${nodes[b]?.x}%`}
              y2={`${nodes[b]?.y}%`}
              stroke="currentColor"
              className="text-muted/10"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {nodes.map(node => (
          <Link
            key={node.id}
            href={`/topik/${encodeURIComponent(node.label)}`}
            className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 group-hover:bg-white group-hover:scale-150 transition-all duration-500" />
            <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[0.55rem] uppercase tracking-widest text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity">
              {node.label}
            </span>
          </Link>
        ))}
      </div>
      <p className="text-[0.6rem] text-muted-foreground text-center mt-6 uppercase tracking-widest italic opacity-50">
        Grafik hubungan topik yang dibangun dari metadata tulisan Anda.
      </p>
    </section>
  );
}
