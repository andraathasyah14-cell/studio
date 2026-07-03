'use client';

import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Search, FileText, BookOpen, Library, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ isOpen, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const db = useFirestore();

  const essaysQuery = useMemo(() => (db ? collection(db, 'essays') : null), [db]);
  const papersQuery = useMemo(() => (db ? collection(db, 'papers') : null), [db]);
  const refsQuery = useMemo(() => (db ? collection(db, 'references') : null), [db]);

  const { data: essays } = useCollection(essaysQuery);
  const { data: papers } = useCollection(papersQuery);
  const { data: refs } = useCollection(refsQuery);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const essayResults = (essays || [])
      .filter(e => e.status === 'published' && (e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q)))
      .map(e => ({ id: e.id, title: e.title, type: 'essay', icon: FileText, href: `/essay/${e.id}` }));

    const paperResults = (papers || [])
      .filter(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
      .map(p => ({ id: p.id, title: p.title, type: 'paper', icon: BookOpen, href: '/pustaka' }));

    const refResults = (refs || [])
      .filter(r => r.title.toLowerCase().includes(q) || r.quote?.toLowerCase().includes(q))
      .map(r => ({ id: r.id, title: r.title, type: 'reference', icon: Library, href: '/pustaka' }));

    return [...essayResults, ...paperResults, ...refResults].slice(0, 10);
  }, [query, essays, papers, refs]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card border-border p-0 gap-0 overflow-hidden rounded-none">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="sr-only">Pencarian Universal</DialogTitle>
          <DialogDescription className="sr-only">
            Gunakan kolom di bawah untuk mencari esai, paper, dan referensi di seluruh database.
          </DialogDescription>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari esai, literatur, atau referensi..."
              className="pl-10 border-none bg-transparent focus-visible:ring-0 text-[0.85rem] h-10 rounded-none uppercase tracking-widest"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-muted-foreground text-[0.65rem] uppercase tracking-widest italic">
              Ketik sesuatu untuk memulai pencarian...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-[0.65rem] uppercase tracking-widest italic">
              Tidak ada hasil ditemukan untuk "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res) => (
                <Link 
                  key={`${res.type}-${res.id}`} 
                  href={res.href}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-4 p-3 hover:bg-white/[0.03] group transition-colors border border-transparent hover:border-white/10"
                >
                  <res.icon className="w-4 h-4 text-muted-foreground group-hover:text-white" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.75rem] text-white font-medium truncate lowercase">{res.title}</p>
                    <p className="text-[0.55rem] text-muted-foreground uppercase tracking-widest">{res.type}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-border bg-black/20 flex justify-between items-center px-6">
          <span className="text-[0.5rem] uppercase tracking-widest text-muted-foreground">
            Search Engine v1.0
          </span>
          <span className="text-[0.5rem] uppercase tracking-widest text-muted-foreground">
            {results.length} hasil
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
