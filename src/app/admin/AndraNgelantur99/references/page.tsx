
'use client';

import React, { useState } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Search, Plus, Trash2, Quote, Link as LinkIcon, Book, Database, ExternalLink, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function ReferenceManagement() {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRef, setNewRef] = useState({ title: '', author: '', source: '', quote: '', category: 'Buku', link: '' });
  const [saving, setSaving] = useState(false);
  
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const refsQuery = React.useMemo(() => {
    if (!db) return null;
    return collection(db, 'references');
  }, [db]);

  const { data: refs, loading } = useCollection(refsQuery);

  const filteredRefs = refs?.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.quote?.toLowerCase().includes(search.toLowerCase()) ||
    r.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRef = () => {
    if (!db || !user || !newRef.title) return;
    setSaving(true);
    
    const refData = {
      ...newRef,
      createdAt: new Date().toISOString()
    };
    
    const refCollection = collection(db, 'references');
    
    addDoc(refCollection, refData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: refCollection.path,
          operation: 'create',
          requestResourceData: refData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
      
    addDoc(collection(db, 'activity_logs'), {
      adminId: user.uid,
      action: `Menambahkan referensi: ${newRef.title}`,
      timestamp: new Date().toISOString()
    }).catch(() => {});

    // Optimistic UI updates
    setNewRef({ title: '', author: '', source: '', quote: '', category: 'Buku', link: '' });
    setIsAddOpen(false);
    setSaving(false);
    toast({ title: "Berhasil", description: "Referensi sedang diproses." });
  };

  const handleDelete = (id: string, title: string) => {
    if (!db || !user || !window.confirm(`Hapus referensi "${title}"?`)) return;
    
    const docRef = doc(db, 'references', id);
    deleteDoc(docRef)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

    addDoc(collection(db, 'activity_logs'), {
      adminId: user.uid,
      action: `Menghapus referensi: ${title}`,
      timestamp: new Date().toISOString()
    }).catch(() => {});

    toast({ title: "Terhapus", description: "Referensi telah dihapus." });
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter text-white">Bank Referensi</h1>
          <p className="text-muted-foreground text-[0.6rem] uppercase tracking-widest mt-1">Kumpulan kutipan & sumber data</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-none bg-white text-black hover:bg-silver font-bold uppercase text-[0.65rem] tracking-widest h-10 px-6">
              <Plus className="w-4 h-4 mr-2" /> Tambah Referensi
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border rounded-none text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-widest text-[0.7rem]">Input Referensi Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Kategori</label>
                  <Select value={newRef.category} onValueChange={v => setNewRef({...newRef, category: v})}>
                    <SelectTrigger className="bg-background border-border rounded-none h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-none">
                      <SelectItem value="Buku">Buku</SelectItem>
                      <SelectItem value="Dataset">Dataset</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Judul/Nama Item</label>
                  <Input value={newRef.title} onChange={e => setNewRef({...newRef, title: e.target.value})} className="bg-background border-border rounded-none h-10 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Penulis/Author</label>
                  <Input value={newRef.author} onChange={e => setNewRef({...newRef, author: e.target.value})} className="bg-background border-border rounded-none h-10 text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Link (Opsional)</label>
                  <Input value={newRef.link} onChange={e => setNewRef({...newRef, link: e.target.value})} className="bg-background border-border rounded-none h-10 text-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Kutipan Penting / Catatan</label>
                <Textarea 
                  value={newRef.quote} 
                  onChange={e => setNewRef({...newRef, quote: e.target.value})}
                  className="bg-background border-border rounded-none min-h-[100px] text-xs font-serif italic"
                  placeholder="Masukkan poin penting atau kutipan..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddRef} 
                disabled={saving}
                className="bg-white text-black font-bold uppercase text-[0.6rem] tracking-widest rounded-none w-full h-11"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Referensi'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Cari kutipan, judul, atau kategori..." 
          className="pl-10 h-10 rounded-none bg-card border-border text-[0.75rem]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-card border border-border animate-pulse" />
          ))
        ) : filteredRefs?.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border italic text-muted-foreground text-sm font-serif">
            Bank referensi masih kosong.
          </div>
        ) : (
          filteredRefs?.map((ref) => (
            <div key={ref.id} className="bg-card border border-border p-6 group hover:bg-white/[0.01] transition-colors relative">
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/5 rounded-none border border-border">
                      {ref.category === 'Buku' ? <Book className="w-3.5 h-3.5 text-muted-foreground" /> : 
                       ref.category === 'Dataset' ? <Database className="w-3.5 h-3.5 text-muted-foreground" /> : 
                       <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                    <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground font-bold">{ref.category}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-[0.85rem] font-bold text-white lowercase">{ref.title} <span className="text-muted-foreground font-normal ml-2">by {ref.author}</span></h3>
                    {ref.quote && (
                      <p className="font-serif italic text-sm text-muted-foreground leading-relaxed border-l border-white/10 pl-4 py-1">
                        "{ref.quote}"
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleDelete(ref.id, ref.title)} className="p-2 text-muted-foreground hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {ref.link && (
                    <a href={ref.link} target="_blank" className="p-2 text-muted-foreground hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
