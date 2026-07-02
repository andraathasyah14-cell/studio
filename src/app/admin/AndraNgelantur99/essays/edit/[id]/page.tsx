'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useFirestore, useDoc, useUser } from '@/firebase';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Sparkles, ArrowLeft, Tag, FileText, Wand2, Loader2 } from 'lucide-react';
import AnalysisForm from '@/components/admin/analysis-form';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { improveEssayAction } from '@/app/actions';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function EditEssayPage() {
  const params = useParams();
  const id = params.id as string;
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const essayRef = React.useMemo(() => id && db ? doc(db, 'essays', id) : null, [id, db]);
  const { data: essay, loading } = useDoc(essayRef);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [improving, setImproving] = useState(false);

  useEffect(() => {
    if (essay) {
      setTitle(essay.title || '');
      setContent(essay.content || '');
      setCategory(essay.category || '');
      setTags(essay.tags?.join(', ') || '');
    }
  }, [essay]);

  const handleInsertFromForm = (text: string) => {
    setContent(prev => {
      const separator = prev ? '\n\n' : '';
      return prev + separator + text;
    });
    setIsFormOpen(false);
    toast({
      title: "Jawaban Dipindahkan",
      description: "Jawaban kuesioner telah ditambahkan ke editor.",
    });
  };

  const handleAIImprove = async () => {
    if (!content) return;
    setImproving(true);
    try {
      const result = await improveEssayAction({ content });
      setContent(result.improvedContent);
      toast({
        title: "Penyempurnaan AI Selesai",
        description: "Tulisan Anda telah dipertajam oleh AI.",
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "AI Gagal", description: error.message });
    } finally {
      setImproving(false);
    }
  };

  const handleUpdate = async (status: 'draft' | 'published') => {
    if (!db || !id || !user) return;
    setSaving(true);
    
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    const updateData = {
      title,
      content,
      category,
      tags: tagList,
      status,
      updatedAt: new Date().toISOString(),
    };

    const docRef = doc(db, 'essays', id);
    // NO await here for instant optimistic update
    updateDoc(docRef, updateData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updateData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

    // Log activity (fire and forget)
    addDoc(collection(db, 'activity_logs'), {
      adminId: user.uid,
      action: `Memperbarui esai: ${title}`,
      timestamp: new Date().toISOString()
    });

    toast({
      title: "Pembaruan Berhasil",
      description: `Perubahan pada "${title}" sedang diproses.`,
    });
    
    // Immediate redirect
    router.push('/admin/AndraNgelantur99/essays');
  };

  if (loading) return <div className="p-20 text-center uppercase tracking-widest text-[0.6rem]">Memuat Esai...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background">
      <header className="border-b border-border bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/AndraNgelantur99/essays">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-white hidden sm:block">Edit Esai</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleAIImprove}
            disabled={improving || saving || !content}
            className="text-white hover:bg-white/5 text-[0.6rem] uppercase tracking-widest hidden md:flex items-center gap-2"
          >
            {improving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            AI Improve
          </Button>
          <div className="w-px h-6 bg-border mx-2 hidden md:block" />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleUpdate('draft')}
            disabled={saving}
            className="rounded-none border-border text-[0.6rem] uppercase tracking-widest h-9 min-w-[120px]"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
            {saving ? 'Proses...' : 'Simpan Draft'}
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleUpdate('published')}
            disabled={saving}
            className="rounded-none bg-white text-black hover:bg-silver text-[0.6rem] uppercase font-bold tracking-widest h-9 min-w-[120px]"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
            {saving ? 'Sinkronisasi...' : 'Simpan & Terbit'}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-20">
          <div className="max-w-[800px] mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 border border-border">
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Kategori
                </label>
                <Input 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={saving}
                  className="bg-background/50 border-border text-xs rounded-none h-9"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Tags (Koma)
                </label>
                <Input 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={saving}
                  className="bg-background/50 border-border text-xs rounded-none h-9"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground block font-bold">Judul Esai</label>
              <Input
                className="text-4xl md:text-5xl font-display font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto placeholder:text-white/5 tracking-tighter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
              />
            </div>
            
            <div className="space-y-4 min-h-[50vh]">
              <label className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground block font-bold">Konten Analisis</label>
              <Textarea
                className="min-h-[50vh] bg-transparent border-none focus-visible:ring-0 p-0 text-lg md:text-xl font-serif italic leading-relaxed resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
        </main>

        <aside className="w-[400px] hidden xl:block border-l border-border bg-card overflow-hidden">
          <AnalysisForm onInsertDraft={handleInsertFromForm} />
        </aside>

        <div className="xl:hidden fixed bottom-6 right-6 z-50">
          <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
            <SheetTrigger asChild>
              <div className="flex flex-col gap-3">
                <Button size="icon" onClick={handleAIImprove} disabled={improving || saving} className="rounded-full w-12 h-12 shadow-2xl bg-white/10 text-white hover:bg-white/20 border border-white/10">
                  {improving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                </Button>
                <Button size="icon" className="rounded-full w-14 h-14 shadow-2xl bg-white text-black hover:bg-silver border border-black/10">
                  <Sparkles className="w-6 h-6" />
                </Button>
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-full sm:w-[420px] border-l border-border bg-card">
              <SheetHeader className="p-6 border-b border-border">
                <SheetTitle className="text-left font-display text-[0.7rem] uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Form Panduan
                </SheetTitle>
              </SheetHeader>
              <div className="h-[calc(100vh-80px)] overflow-hidden">
                <AnalysisForm onInsertDraft={handleInsertFromForm} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}