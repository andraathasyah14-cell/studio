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

  // 1. MENGHITUNG FREKUENSI TAG & MEMBENTUK TITIK (NODES)
  const nodes = useMemo(() => {
    const tagCounts = new Map<string, number>();
    
    essays?.forEach(e => {
      e.tags?.forEach((t: string) => {
        const tag = t.toLowerCase().trim();
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    // Jika tidak ada data, tampilkan placeholder
    if (tagCounts.size === 0) {
      return [
        { id: 0, label: 'ekonomi', x: 50, y: 45, size: 10 },
        { id: 1, label: 'pendidikan', x: 28, y: 28, size: 8 },
        { id: 2, label: 'teknologi', x: 72, y: 25, size: 12 },
        { id: 3, label: 'hukum', x: 20, y: 60, size: 6 }
      ];
    }

    // Tentukan ukuran berdasarkan frekuensi
    // Fungsi hash sederhana agar posisi (x,y) stabil berdasarkan nama tag
    const getStablePos = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    return Array.from(tagCounts.entries()).map(([tag, count], i) => {
      const stableSeed = getStablePos(tag);
      return {
        id: i,
        label: tag,
        count,
        // Ukuran titik: dasar 6px + (frekuensi * 4px), maks 30px
        size: Math.min(6 + (count * 4), 30),
        x: 15 + (stableSeed % 70), // Posisi stabil berdasarkan nama
        y: 15 + ((stableSeed >> 7) % 70)
      };
    });
  }, [essays]);

  // 2. MEMBENTUK GARIS (EDGES) BERDASARKAN CO-OCCURRENCE
  const edges = useMemo(() => {
    const pairs: [number, number][] = [];
    if (!essays || nodes.length <= 1) return pairs;

    const tagToId = new Map(nodes.map(n => [n.label, n.id]));
    const connections = new Set<string>();

    essays.forEach(essay => {
      const essayTags = essay.tags?.map((t: string) => t.toLowerCase().trim()) || [];
      
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
        className="relative h-[500px] w-full bg-card/30 border border-border overflow-hidden cursor-crosshair group/graph"
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
              className="text-white/5 group-hover/graph:text-white/15 transition-colors"
              strokeWidth="1"
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
            {/* Titik dengan ukuran dinamis */}
            <div 
              className="rounded-full bg-white/20 group-hover:bg-white group-hover:scale-110 transition-all duration-500 flex items-center justify-center relative"
              style={{ 
                width: `${node.size}px`, 
                height: `${node.size}px`,
                boxShadow: node.count > 2 ? '0 0 15px rgba(255,255,255,0.3)' : 'none'
              }}
            >
              {/* Tooltip Label yang muncul saat hover atau untuk node besar */}
              <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[0.5rem] uppercase tracking-widest transition-all pointer-events-none
                ${node.count > 3 ? 'opacity-60 text-white' : 'opacity-0 group-hover:opacity-100 text-muted-foreground'}
              `}>
                {node.label}
              </span>
            </div>
          </Link>
        ))}

        {/* Info Petunjuk */}
        <div className="absolute bottom-4 right-4 text-[0.5rem] uppercase tracking-widest text-muted-foreground/30 font-bold pointer-events-none space-y-1 text-right">
          <p>Garis: Koneksi antar topik dalam satu esai</p>
          <p>Ukuran: Intensitas pembahasan topik</p>
        </div>
      </div>
    </section>
  );
}
