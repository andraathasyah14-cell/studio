'use client';

import { useRef } from 'react';
import Link from "next/link";

const nodes = [
  { id: 0, label: 'Bonus Demografi', x: 50, y: 45 },
  { id: 1, label: 'Industrialisasi', x: 28, y: 28 },
  { id: 2, label: 'Pendidikan', x: 72, y: 25 },
  { id: 3, label: 'Middle Income Trap', x: 20, y: 60 },
  { id: 4, label: 'Investasi Asing', x: 40, y: 72 },
  { id: 5, label: 'AI & Pekerjaan', x: 75, y: 62 },
  { id: 6, label: 'Produktivitas', x: 62, y: 78 },
  { id: 7, label: 'Hukum & Ketimpangan', x: 84, y: 42 },
  { id: 8, label: 'Reforma Agraria', x: 15, y: 80 },
];

const edges = [
  [0,1],[0,2],[0,3],[0,4],[0,5],
  [1,3],[2,5],[5,6],[5,7],[3,8],[4,6]
];

export default function KnowledgeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Knowledge Graph</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div 
        ref={containerRef}
        className="relative h-[400px] w-full bg-card/30 border border-border overflow-hidden"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={`${nodes[a].x}%`}
              y1={`${nodes[a].y}%`}
              x2={`${nodes[b].x}%`}
              y2={`${nodes[b].y}%`}
              stroke="currentColor"
              className="text-muted/20"
              strokeWidth="1"
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
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground group-hover:bg-white group-hover:scale-150 transition-all duration-300" />
            <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[0.6rem] text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
              {node.label}
            </span>
          </Link>
        ))}
      </div>
      <p className="text-[0.6rem] text-muted-foreground text-center mt-6 uppercase tracking-widest italic">
        Klik titik pada graf untuk mengeksplorasi topik terkait
      </p>
    </section>
  );
}
