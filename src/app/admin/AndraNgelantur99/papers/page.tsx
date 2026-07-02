
'use client';

import React, { useState } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Search, Plus, Trash2, BookOpen, ExternalLink, Calendar, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function PaperManagement() {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPaper, setNewPaper] = useState({ title: '', author: '', year: '', category: '', link: '' });
  const [saving, setSaving] = useState(false);
  
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const papersQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'papers'), orderBy('uploadedAt', 'desc'));
  }, [db]);

  const { data: papers, loading } = useCollection(papersQuery);

  const filteredPapers = papers?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPaper = () => {
    if (!db || !user || !newPaper.title) return;
    setSaving(true);
    
    const paperData = {
      ...newPaper,
      year: parseInt(newPaper.year) || 2024,
      uploadedAt: new Date().toISOString(),
    };
    
    const paperRef = collection(db, 'papers');
    
    addDoc(paperRef, paperData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: paperRef.path,
          operation: 'create',
          requestResourceData: paperData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

    addDoc(collection(db, 'activity_logs'), {
      adminId: user.uid,
      action: `Menambahkan paper: ${newPaper.title}`,
      timestamp: new Date().toISOString()
    }).catch(() => {});

    // Optimistic UI updates
    setNewPaper({ title: '', author: '', year: '', category: '', link: '' });
    setIsAddOpen(false);
    setSaving(false);
    toast({ title: "Berhasil", description: "Metadata paper sedang disimpan." });
  };

  const handleDelete = (id: string, title: string) => {
    if (!db || !user || !window.confirm(`Hapus paper "${title}"?`)) return;
    
    const docRef = doc(db, 'papers', id);
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
      action: `Menghapus paper: ${title}`,
      timestamp: new Date().toISOString()
    }).catch(() => {});
    
    toast({ title: "Terhapus", description: `Paper "${title}" telah dihapus.` });
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter text-white">Manajemen Paper</h1>
          <p className="text-muted-foreground text-[0.6rem] uppercase tracking-widest mt-1">Repositori Literatur Akademik</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-none bg-white text-black hover:bg-silver font-bold uppercase text-[0.65rem] tracking-widest h-10 px-6">
              <Plus className="w-4 h-4 mr-2" /> Tambah Paper
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border rounded-none text-white">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-widest text-[0.7rem]">Tambah Metadata Paper</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Judul Paper</label>
                <Input 
                  value={newPaper.title} 
                  onChange={e => setNewPaper({...newPaper, title: e.target.value})}
                  className="bg-background border-border rounded-none h-10 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Penulis</label>
                  <Input 
                    value={newPaper.author} 
                    onChange={e => setNewPaper({...newPaper, author: e.target.value})}
                    className="bg-background border-border rounded-none h-10 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Tahun</label>
                  <Input 
                    type="number"
                    value={newPaper.year} 
                    onChange={e => setNewPaper({...newPaper, year: e.target.value})}
                    className="bg-background border-border rounded-none h-10 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Kategori</label>
                <Input 
                  value={newPaper.category} 
                  onChange={e => setNewPaper({...newPaper, category: e.target.value})}
                  className="bg-background border-border rounded-none h-10 text-xs"
                  placeholder="Ekonomi, AI, Sosiologi..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddPaper} 
                disabled={saving}
                className="bg-white text-black font-bold uppercase text-[0.6rem] tracking-widest rounded-none w-full h-11"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Paper'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Cari paper atau penulis..." 
          className="pl-10 h-10 rounded-none bg-card border-border text-[0.75rem]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-card border border-border animate-pulse" />
          ))
        ) : filteredPapers?.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-border italic text-muted-foreground text-sm font-serif">
            Belum ada paper yang terdaftar.
          </div>
        ) : (
          filteredPapers?.map((paper) => (
            <div key={paper.id} className="bg-card border border-border p-6 flex flex-col justify-between group hover:border-white/20 transition-colors">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-white/5 rounded-none">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <button 
                    onClick={() => handleDelete(paper.id, paper.title)}
                    className="text-muted-foreground hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{paper.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-[0.6rem] text-muted-foreground uppercase tracking-wider">
                    <User className="w-3 h-3" /> {paper.author}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[0.6rem] text-muted-foreground uppercase tracking-wider">
                    <Calendar className="w-3 h-3" /> {paper.year} · {paper.category}
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="mt-6 w-full rounded-none border-t border-border h-9 text-[0.6rem] uppercase tracking-[0.2em] hover:bg-white hover:text-black">
                Detail <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
