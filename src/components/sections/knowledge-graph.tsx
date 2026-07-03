'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Info, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";

export default function TopicDistribution() {
  const db = useFirestore();

  const essaysQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'essays'), where('status', '==', 'published'));
  }, [db]);

  const { data: essays, loading } = useCollection(essaysQuery);

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

  const totalConnections = useMemo(() => {
    return topicData.reduce((acc, curr) => acc + curr.value, 0);
  }, [topicData]);

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
      
      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-12">
          {/* Topik Unik Item */}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-display font-bold text-white mb-1">{topicData.length}</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 outline-none group">
                  <span className="text-[0.55rem] uppercase tracking-widest text-muted-foreground group-hover:text-white font-bold transition-colors">Total Topik Unik</span>
                  <Info className="w-3 h-3 text-muted-foreground/40 group-hover:text-white transition-colors" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" sideOffset={10} className="bg-card border-border rounded-none text-[0.7rem] p-5 w-[280px] space-y-3 shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="uppercase tracking-[0.2em] font-bold text-[0.6rem] text-muted-foreground">Informasi Topik</span>
                  <PopoverClose className="text-muted-foreground hover:text-white transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </PopoverClose>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Menghitung berapa banyak <strong className="text-white">kategori atau label berbeda</strong> yang Anda gunakan di seluruh esai.
                  <br/><br/>
                  <span className="italic text-[0.65rem] opacity-70">Misal: "Ekonomi", "Hukum", dan "AI" dihitung sebagai 3 topik unik.</span>
                </p>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="w-px h-10 bg-border" />
          
          {/* Kaitan Pengetahuan Item */}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-display font-bold text-white mb-1">{totalConnections}</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 outline-none group">
                  <span className="text-[0.55rem] uppercase tracking-widest text-muted-foreground group-hover:text-white font-bold transition-colors">Kaitan Pengetahuan</span>
                  <Info className="w-3 h-3 text-muted-foreground/40 group-hover:text-white transition-colors" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" sideOffset={10} className="bg-card border-border rounded-none text-[0.7rem] p-5 w-[280px] space-y-3 shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="uppercase tracking-[0.2em] font-bold text-[0.6rem] text-muted-foreground">Informasi Kaitan</span>
                  <PopoverClose className="text-muted-foreground hover:text-white transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </PopoverClose>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Menghitung <strong className="text-white">total akumulasi penggunaan tag</strong> di semua esai. 
                  <br/><br/>
                  <span className="italic text-[0.65rem] opacity-70">Menunjukkan seberapa padat jaringan keterhubungan antara opini dan riset Anda.</span>
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </section>
  );
}
