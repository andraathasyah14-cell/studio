
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Sparkles, Save, ArrowLeft, Link as LinkIcon, Tag, FileText } from 'lucide-react';
import AnalysisForm from '@/components/admin/analysis-form';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function NewEssayPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleInsertFromForm = (text: string) => {
    setContent(prev => {
      const separator = prev ? '\n\n' : '';
      return prev + separator + text;
    });
    setIsFormOpen(false);
    toast({
      title: "Jawaban Dipindahkan",
      description: "Jawaban kuesioner telah disusun ke dalam editor utama.",
    });
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!db || !user) return;
    if (!title) {
      toast({ variant: "destructive", title: "Judul diperlukan", description: "Harap isi judul sebelum menyimpan." });
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'essays'), {
        title,
        content,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        status,
        authorId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        confidence: 70, // Default confidence
      });

      toast({
        title: status === 'published' ? "Konten Diterbitkan" : "Draf Disimpan",
        description: `Esai "${title}" berhasil disimpan.`,
      });
      router.push('/admin/AndraNgelantur99/essays');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal menyimpan", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Top Toolbar */}
      <header className="border-b border-border bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/AndraNgelantur99/essays">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-white hidden sm:block">Editor Esai</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="rounded-none border-border text-[0.6rem] uppercase tracking-widest h-9"
          >
            Simpan Draft
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleSave('published')}
            disabled={saving}
            className="rounded-none bg-white text-black hover:bg-silver text-[0.6rem] uppercase font-bold tracking-widest h-9"
          >
            Terbitkan
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Section */}
        <main className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-20">
          <div className="max-w-[800px] mx-auto space-y-12">
            
            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 border border-border">
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Kategori
                </label>
                <Input 
                  placeholder="Ekonomi, Politik, dll..." 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-background/50 border-border text-xs rounded-none focus-visible:ring-white/20 h-9"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Tags (Koma)
                </label>
                <Input 
                  placeholder="AI, Pendidikan, Masa Depan..." 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-background/50 border-border text-xs rounded-none focus-visible:ring-white/20 h-9"
                />
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-4">
              <label className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground block font-bold">Judul Esai</label>
              <Input
                placeholder="Masukkan judul..."
                className="text-4xl md:text-5xl font-display font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto placeholder:text-white/5 tracking-tighter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            {/* Content Textarea */}
            <div className="space-y-4 min-h-[50vh]">
              <label className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground block font-bold">Konten Analisis</label>
              <Textarea
                placeholder="Tulis draf Anda di sini atau gunakan Form Analisis di samping..."
                className="min-h-[50vh] bg-transparent border-none focus-visible:ring-0 p-0 text-lg md:text-xl font-serif italic leading-relaxed placeholder:text-white/5 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </main>

        {/* Analysis Form Sidebar (Desktop) */}
        <aside className="w-[400px] hidden xl:block border-l border-border bg-card overflow-hidden">
          <AnalysisForm onInsertDraft={handleInsertFromForm} />
        </aside>

        {/* Floating Button for Analysis Form (Mobile/Tablet) */}
        <div className="xl:hidden fixed bottom-6 right-6 z-50">
          <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
            <SheetTrigger asChild>
              <Button size="icon" className="rounded-full w-14 h-14 shadow-2xl bg-white text-black hover:bg-silver border border-black/10">
                <Sparkles className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-full sm:w-[420px] border-l border-border bg-card">
              <SheetHeader className="p-6 border-b border-border">
                <SheetTitle className="text-left font-display text-[0.7rem] uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Form Panduan Berpikir
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
