
'use client';

import React, { useRef, useMemo } from 'react';
import Link from "next/link";
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export default function KnowledgeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const db = useFirestore();

  // Hanya ambil esai yang sudah diterbitkan
  const essaysQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'essays'), where('status', '==', 'published'));
  }, [db]);

  const { data: essays } = useCollection(essaysQuery);

  // 1. MEMBENTUK TITIK (NODES) DARI TAGS
  const nodes = useMemo(() => {
    const allTags = new Set<string>();
    essays?.forEach(e => {
      e.tags?.forEach((t: string) => {
        allTags.add(t.toLowerCase().trim());
      });
    });
    
    // Jika tidak ada data, tampilkan placeholder agar grafik tidak kosong
    if (allTags.size === 0) {
      return [
        { id: 0, label: 'ekonomi', x: 50, y: 45 },
        { id: 1, label: 'pendidikan', x: 28, y: 28 },
        { id: 2, label: 'teknologi', x: 72, y: 25 },
        { id: 3, label: 'hukum', x: 20, y: 60 }
      ];
    }

    // Posisikan titik secara acak namun tetap dalam area
    return Array.from(allTags).map((tag, i) => ({
      id: i,
      label: tag,
      x: 15 + Math.random() * 70, // Margin 15% agar tidak terlalu ke pinggir
      y: 15 + Math.random() * 70
    }));
  }, [essays]);

  // 2. MEMBENTUK GARIS (EDGES) BERDASARKAN CO-OCCURRENCE
  const edges = useMemo(() => {
    const pairs: [number, number][] = [];
    if (!essays || nodes.length <= 1) return pairs;

    const tagToId = new Map(nodes.map(n => [n.label, n.id]));
    const connections = new Set<string>();

    essays.forEach(essay => {
      const essayTags = essay.tags?.map((t: string) => t.toLowerCase().trim()) || [];
      
      // Hubungkan setiap pasang tag yang ada dalam satu esai
      for (let i = 0; i < essayTags.length; i++) {
        for (let j = i + 1; j < essayTags.length; j++) {
          const idA = tagToId.get(essayTags[i]);
          const idB = tagToId.get(essayTags[j]);
          
          if (idA !== undefined && idB !== undefined) {
            const pairKey = [idA, idB].sort().join('-');
            if (!connections.has(pairKey)) {
              connections.add(pairKey);
              pairs.push([idA, idB]);
            }
          }
        }
      }
    });

    return pairs;
  }, [nodes, essays]);

  return (
    <section className="py-20 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Knowledge Graph</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div 
        ref={containerRef}
        className="relative h-[450px] w-full bg-card/30 border border-border overflow-hidden cursor-crosshair group/graph"
      >
        {/* Layer Garis Hubungan */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={`${nodes[a]?.x}%`}
              y1={`${nodes[a]?.y}%`}
              x2={`${nodes[b]?.x}%`}
              y2={`${nodes[b]?.y}%`}
              stroke="currentColor"
              className="text-white/10 group-hover/graph:text-white/20 transition-colors"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* Layer Titik Topik */}
        {nodes.map(node => (
          <Link
            key={node.id}
            href={`/topik/${encodeURIComponent(node.label)}`}
            className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 group-hover:bg-white group-hover:scale-150 transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[0.55rem] uppercase tracking-widest text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
              {node.label}
            </span>
          </Link>
        ))}

        {/* Info Petunjuk */}
        <div className="absolute bottom-4 right-4 text-[0.5rem] uppercase tracking-widest text-muted-foreground/30 font-bold pointer-events-none">
          Garis menghubungkan topik yang muncul bersamaan dalam esai
        </div>
      </div>
    </section>
  );
}
