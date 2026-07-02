'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { LayoutGrid, PieChart as PieIcon, BarChart3 } from 'lucide-react';

export default function TopicDistribution() {
  const db = useFirestore();

  // Ambil esai yang sudah diterbitkan saja
  const essaysQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'essays'), where('status', '==', 'published'));
  }, [db]);

  const { data: essays, loading } = useCollection(essaysQuery);

  // 1. Menghitung distribusi tag/topik
  const topicData = useMemo(() => {
    if (!essays) return [];
    
    const counts: Record<string, number> = {};
    essays.forEach(essay => {
      essay.tags?.forEach((tag: string) => {
        const normalizedTag = tag.toLowerCase().trim();
        counts[normalizedTag] = (counts[normalizedTag] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [essays]);

  const COLORS = ['#FFFFFF', '#A1A1AA', '#71717A', '#52525B', '#3F3F46', '#27272A'];

  if (loading) return (
    <div className="py-20 px-6 text-center text-[0.6rem] uppercase tracking-widest text-muted-foreground animate-pulse">
      Menganalisis Sebaran Topik...
    </div>
  );

  return (
    <section className="py-24 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-16">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Distribusi Pengetahuan</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border border-border">
        {/* Panel 1: Pie Chart - Komposisi Topik */}
        <div className="bg-background p-8 space-y-8 flex flex-col justify-center border-r border-border">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="text-[0.65rem] uppercase tracking-widest font-bold text-white">Komposisi Fokus Riset</h3>
          </div>
          
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #27272A', fontSize: '10px', textTransform: 'uppercase' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend Sederhana */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground font-bold">Topik</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {topicData.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Bar Chart - Intensitas Topik */}
        <div className="bg-background p-8 space-y-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="text-[0.65rem] uppercase tracking-widest font-bold text-white">Peringkat Pembahasan</h3>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData.slice(0, 6)} layout="vertical" margin={{ left: -20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272A" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717A', fontSize: 10, textTransform: 'uppercase' }} 
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black border border-border p-2 text-[0.6rem] uppercase tracking-widest font-bold">
                          {payload[0].value} Tulisan
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" fill="#FFFFFF" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[0.6rem] italic text-muted-foreground leading-relaxed">
            Data ini menunjukkan topik mana yang paling dominan dalam repositori pengetahuan Anda saat ini.
          </p>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-xl font-display font-bold text-white">{topicData.length}</span>
            <span className="text-[0.5rem] uppercase tracking-widest text-muted-foreground">Total Topik Unik</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-display font-bold text-white">
              {topicData.reduce((acc, curr) => acc + curr.value, 0)}
            </span>
            <span className="text-[0.5rem] uppercase tracking-widest text-muted-foreground">Total Kaitan Topik</span>
          </div>
        </div>
      </div>
    </section>
  );
}
