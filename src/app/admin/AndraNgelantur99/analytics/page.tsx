
'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  TrendingUp, FileText, BookOpen, Activity, Library
} from 'lucide-react';

export default function AnalyticsPage() {
  const db = useFirestore();

  const essaysQuery = useMemo(() => db ? collection(db, 'essays') : null, [db]);
  const papersQuery = useMemo(() => db ? collection(db, 'papers') : null, [db]);
  const refsQuery = useMemo(() => db ? collection(db, 'references') : null, [db]);
  const logsQuery = useMemo(() => db ? query(collection(db, 'activity_logs'), orderBy('timestamp', 'asc')) : null, [db]);

  const { data: essays } = useCollection(essaysQuery);
  const { data: papers } = useCollection(papersQuery);
  const { data: refs } = useCollection(refsQuery);
  const { data: logs } = useCollection(logsQuery);

  // Normalisasi Kategori (Case-Insensitive)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    essays?.forEach(e => {
      const cat = (e.category || 'uncategorized').toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, total]) => ({ name, total }));
  }, [essays]);

  // Normalisasi Referensi (Case-Insensitive)
  const refTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    refs?.forEach(r => {
      const type = (r.category || 'lainnya').toLowerCase();
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [refs]);

  const activityTrend = useMemo(() => {
    const days: Record<string, number> = {};
    logs?.forEach(l => {
      const date = new Date(l.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      days[date] = (days[date] || 0) + 1;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count })).slice(-7);
  }, [logs]);

  const COLORS = ['#FFFFFF', '#A1A1AA', '#52525B', '#27272A'];

  return (
    <div className="p-8 space-y-10 bg-background min-h-screen">
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tighter text-white">Analitik Sistem</h1>
        <p className="text-muted-foreground text-[0.6rem] uppercase tracking-widest mt-2 font-bold">Wawasan Data Riset & Publikasi</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <div className="p-6 bg-card space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[0.55rem] uppercase tracking-widest font-bold">Aktivitas (7 Hari)</span>
          </div>
          <p className="text-3xl font-display font-bold text-white">{logs?.length || 0}</p>
        </div>
        <div className="p-6 bg-card space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="w-3.5 h-3.5" />
            <span className="text-[0.55rem] uppercase tracking-widest font-bold">Produktivitas Esai</span>
          </div>
          <p className="text-3xl font-display font-bold text-white">{essays?.length || 0}</p>
        </div>
        <div className="p-6 bg-card space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[0.55rem] uppercase tracking-widest font-bold">Literatur Map</span>
          </div>
          <p className="text-3xl font-display font-bold text-white">{papers?.length || 0}</p>
        </div>
        <div className="p-6 bg-card space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Library className="w-3.5 h-3.5" />
            <span className="text-[0.55rem] uppercase tracking-widest font-bold">Bank Referensi</span>
          </div>
          <p className="text-3xl font-display font-bold text-white">{refs?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-none border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-[0.65rem] uppercase tracking-widest font-bold flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Distribusi Topik Esai
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717A', fontSize: 10 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717A', fontSize: 10 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-black border border-border p-2 text-[0.6rem] uppercase tracking-widest font-bold">
                            {payload[0].value} Esai
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="total" fill="#FFFFFF" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-[0.65rem] uppercase tracking-widest font-bold">Komposisi Bank Referensi</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="h-[250px] w-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={refTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {refTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-black border border-border p-2 text-[0.6rem] uppercase tracking-widest font-bold">
                            {payload[0].name}: {payload[0].value}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 flex-1 max-w-[200px]">
              {refTypeData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[0.6rem] uppercase tracking-widest font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-none border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-[0.65rem] uppercase tracking-widest font-bold">Intensitas Aktivitas Sistem (Timeline)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717A', fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717A', fontSize: 10 }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-black border border-border p-2 text-[0.6rem] uppercase tracking-widest font-bold">
                            {payload[0].value} Log Aktivitas
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#FFFFFF" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
