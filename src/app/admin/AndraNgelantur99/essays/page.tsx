
'use client';

import React, { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Search, Filter, Plus, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function ContentManagement() {
  const [search, setSearch] = useState('');
  const db = useFirestore();

  const essaysQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'essays'), orderBy('updatedAt', 'desc'));
  }, [db]);

  const { data: essays, loading } = useCollection(essaysQuery);

  const filteredEssays = essays?.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!db || !window.confirm('Hapus esai ini secara permanen?')) return;
    await deleteDoc(doc(db, 'essays', id));
  };

  const togglePublish = async (id: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    await updateDoc(doc(db, 'essays', id), {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter text-white">Manajemen Konten</h1>
          <p className="text-muted-foreground text-[0.6rem] uppercase tracking-widest mt-1">Daftar opini & analisis</p>
        </div>
        <Link href="/admin/AndraNgelantur99/essays/new">
          <Button className="rounded-none bg-white text-black hover:bg-silver font-bold uppercase text-[0.65rem] tracking-widest h-10 px-6">
            <Plus className="w-4 h-4 mr-2" /> Esai Baru
          </Button>
        </Link>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari judul atau kategori..." 
            className="pl-10 h-10 rounded-none bg-card border-border text-[0.75rem]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-none border-border text-[0.65rem] uppercase tracking-widest h-10">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      <div className="border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[0.7rem] uppercase tracking-widest">
            <thead>
              <tr className="border-b border-border bg-white/[0.02]">
                <th className="px-6 py-4 font-bold text-muted-foreground">Judul</th>
                <th className="px-6 py-4 font-bold text-muted-foreground">Kategori</th>
                <th className="px-6 py-4 font-bold text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-bold text-muted-foreground">Terakhir Diubah</th>
                <th className="px-6 py-4 font-bold text-muted-foreground text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4 h-16 bg-white/[0.01]" />
                  </tr>
                ))
              ) : filteredEssays?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic font-serif lowercase tracking-normal text-sm">
                    Tidak ada konten ditemukan.
                  </td>
                </tr>
              ) : (
                filteredEssays?.map((essay) => (
                  <tr key={essay.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-white font-medium lowercase tracking-normal text-[0.85rem]">{essay.title}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{essay.category || '-'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={essay.status} />
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(essay.updatedAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/AndraNgelantur99/essays/edit/${essay.id}`}>
                          <button className="p-2 text-muted-foreground hover:text-white transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 text-muted-foreground hover:text-white transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border rounded-none text-[0.65rem] uppercase tracking-widest">
                            <DropdownMenuItem onClick={() => togglePublish(essay.id, essay.status)}>
                              {essay.status === 'published' ? 'Kembalikan ke Draft' : 'Terbitkan Sekarang'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(essay.id)} className="text-rose-500">
                              Hapus Permanen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = 'bg-muted-foreground/20 text-muted-foreground';
  if (status === 'published') color = 'bg-emerald-500/10 text-emerald-500';
  if (status === 'scheduled') color = 'bg-amber-500/10 text-amber-500';
  if (status === 'draft') color = 'bg-blue-500/10 text-blue-500';

  return (
    <span className={`px-2 py-0.5 rounded-sm text-[0.55rem] font-bold ${color}`}>
      {status}
    </span>
  );
}
