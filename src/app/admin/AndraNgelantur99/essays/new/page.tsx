
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Tag, FileText, Wand2, Loader2, ClipboardCheck, RotateCcw } from 'lucide-react';
import AnalysisForm from '@/components/admin/analysis-form';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { improveEssayAction } from '@/app/actions';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function NewEssayPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [improving, setImproving] = useState(false);
  const [showMobileTemplate, setShowMobileTemplate] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const savedTitle = localStorage.getItem('andra_draft_title');
    const savedContent = localStorage.getItem('andra_draft_content');
    if (savedTitle) setTitle(savedTitle);
    if (savedContent) setContent(savedContent);
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('andra_draft_title', title);
      localStorage.setItem('andra_draft_content', content);
    }
  }, [title, content, isInitialized]);

  const handleAIImprove = async () => {
    if (!content) return;
    setImproving(true);
    try {
      const result = await improveEssayAction({ content });
      setContent(result.improvedContent);
      toast({
        title: "AI Selesai",
        description: "Tulisan Anda telah dipertajam.",
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "AI Gagal", description: error.message });
    } finally {
      setImproving(false);
    }
  };

  const handleInsertFromForm = (text: string) => {
    setContent(prev => {
      const separator = prev ? '\n\n' : '';
      return prev + separator + text;
    });
    toast({
      title: "Teks Ditambahkan",
      description: "Jawaban panduan telah dimasukkan ke editor.",
    });
    setShowMobileTemplate(false);
  };

  const clearDraft = () => {
    if (window.confirm('Bersihkan seluruh draf penulisan?')) {
      setTitle('');
      setContent('');
      localStorage.removeItem('andra_draft_title');
      localStorage.removeItem('andra_draft_content');
    }
  };

  const handleSave = (status: 'draft' | 'published') => {
    if (!db || !user) return;
    if (!title) {
      toast({ variant: "destructive", title: "Judul Kosong", description: "Harap isi judul sebelum menyimpan." });
      return;
    }

    setSaving(true);
    
    const normalizedCategory = category.trim().toLowerCase();
    const normalizedTags = tags.split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const essayData = {
      title,
      content,
      category: normalizedCategory,
      tags: normalizedTags,
      status,
      authorId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const essayRef = collection(db, 'essays');
    
    addDoc(essayRef, essayData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: essayRef.path,
          operation: 'create',
          requestResourceData: essayData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

    addDoc(collection(db, 'activity_logs'), {
      adminId: user.uid,
      action: `${status === 'published' ? 'Menerbitkan' : 'Menyimpan draf'} esai: ${title}`,
      timestamp: new Date().toISOString()
    }).catch(() => {});

    // Clear draft on success
    localStorage.removeItem('andra_draft_title');
    localStorage.removeItem('andra_draft_content');

    toast({
      title: status === 'published' ? "Terbit" : "Draf Disimpan",
      description: `Esai "${title}" sedang disinkronkan.`,
    });
    
    router.push('/admin/AndraNgelantur99/essays');
  };

  if (!isInitialized) return null;

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
          <h1 className="text-sm font-bold uppercase tracking-widest text-white hidden sm:block">Editor Esai</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearDraft} className="text-muted-foreground hover:text-white">
            <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset
          </Button>

          <Sheet open={showMobileTemplate} onOpenChange={setShowMobileTemplate}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden border-border text-[0.6rem] uppercase tracking-widest">
                <ClipboardCheck className="w-3.5 h-3.5 mr-2" /> Panduan
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-full sm:max-w-[400px] bg-card border-l border-border">
              <AnalysisForm onInsertDraft={handleInsertFromForm} />
            </SheetContent>
          </Sheet>

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
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="rounded-none border-border text-[0.6rem] uppercase tracking-widest h-9"
          >
            {saving ? '...' : 'Draft'}
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleSave('published')}
            disabled={saving}
            className="rounded-none bg-white text-black hover:bg-silver text-[0.6rem] uppercase font-bold tracking-widest h-9"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : 'Terbitkan'}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-20">
          <div className="max-w-[800px] mx-auto space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-4 border border-border">
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-bold">
                  <Tag className="w-3 h-3" /> Kategori
                </label>
                <Input 
                  placeholder="Contoh: ekonomi, sosial..." 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={saving}
                  className="bg-background/50 border-border text-xs rounded-none h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-bold">
                  <FileText className="w-3 h-3" /> Tags (Pemisah Koma)
                </label>
                <Input 
                  placeholder="Contoh: data, riset..." 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={saving}
                  className="bg-background/50 border-border text-xs rounded-none h-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground block font-bold">Judul Esai</label>
              <Input
                placeholder="Masukkan judul menarik..."
                className="text-3xl md:text-5xl font-display font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto placeholder:text-white/5 tracking-tighter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
              />
            </div>
            
            <div className="space-y-4 min-h-[50vh]">
              <label className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground block font-bold">Konten Analisis</label>
              <Textarea
                placeholder="Tulis draf Anda di sini atau gunakan Panduan Berpikir di samping..."
                className="min-h-[50vh] bg-transparent border-none focus-visible:ring-0 p-0 text-lg md:text-xl font-serif italic leading-relaxed placeholder:text-white/5 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
        </main>

        <aside className="w-[400px] hidden lg:block border-l border-border bg-card overflow-hidden">
          <AnalysisForm onInsertDraft={handleInsertFromForm} />
        </aside>
      </div>
    </div>
  );
}
