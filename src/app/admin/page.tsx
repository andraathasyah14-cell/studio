'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Trash2, FileText, Link as LinkIcon, Tag, Sparkles } from 'lucide-react';
import AnalysisForm from '@/components/admin/analysis-form';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [paperLink, setPaperLink] = useState('');
  const [tags, setTags] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveDraft = () => {
    alert('Draf berhasil disimpan secara lokal.');
  };

  const handleInsertFromForm = (text: string) => {
    setContent(prev => {
      const separator = prev ? '\n\n---\n\n' : '';
      return prev + separator + text;
    });
    // Optional: close mobile drawer after generating
    setIsFormOpen(false);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-white selection:text-black">
      <Header />
      
      <main className="flex-1 flex h-[calc(100vh-56px)] overflow-hidden">
        {/* Main Editor Section (Left) */}
        <div className="flex-1 overflow-y-auto bg-[#0A0A0A]">
          <div className="max-w-[800px] mx-auto px-6 py-12 lg:px-16 lg:py-20 space-y-16">
            
            {/* Editor Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-[0.6rem] uppercase tracking-[0.2em]">Workspace Penulisan</span>
                </div>
                <h1 className="font-display text-xl font-bold text-white">Buat Tulisan Baru</h1>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white" onClick={() => {if(window.confirm('Hapus semua draf di editor?')){setTitle(''); setContent('');}}}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-[0.6rem] uppercase tracking-widest h-10 px-6 rounded-none border-border hover:bg-white hover:text-black transition-all" onClick={handleSaveDraft}>
                  Simpan Draf
                </Button>
                <Button size="sm" className="text-[0.6rem] uppercase tracking-widest h-10 px-6 rounded-none bg-white text-black hover:bg-silver transition-all shadow-lg">
                  <Send className="w-4 h-4 mr-2" />
                  Publikasikan
                </Button>
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 border border-white/5">
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon className="w-3 h-3" /> Link Paper / Referensi
                </label>
                <Input 
                  placeholder="https://..." 
                  value={paperLink}
                  onChange={(e) => setPaperLink(e.target.value)}
                  className="bg-background/50 border-white/10 text-xs rounded-none focus-visible:ring-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Tags (Pisahkan dengan koma)
                </label>
                <Input 
                  placeholder="Ekonomi, AI, Politik..." 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-background/50 border-white/10 text-xs rounded-none focus-visible:ring-white/20"
                />
              </div>
            </div>

            {/* Editing Area */}
            <div className="space-y-12">
              <div className="space-y-4">
                <label className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground block font-bold">Judul Esai</label>
                <Input
                  placeholder="Masukkan judul analisis Anda..."
                  className="text-4xl md:text-5xl font-display font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto placeholder:text-white/5 tracking-tighter"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-4 min-h-[50vh]">
                <label className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground block font-bold">Konten Analisis</label>
                <Textarea
                  placeholder="Mulai menulis draf akhir Anda di sini..."
                  className="min-h-[60vh] bg-transparent border-none focus-visible:ring-0 p-0 text-xl font-serif italic leading-relaxed placeholder:text-white/5 resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>

            {/* Editor Footer Status */}
            <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[0.6rem] uppercase tracking-widest text-muted-foreground font-medium">
              <div className="flex gap-6">
                <span>{wordCount} Kata</span>
                <span>Mode Penulisan</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Auto-saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Form Sidebar (Desktop Only) */}
        <aside className="w-[420px] hidden xl:block shrink-0 shadow-2xl overflow-hidden border-l border-border">
          <AnalysisForm onInsertDraft={handleInsertFromForm} />
        </aside>

        {/* Floating Toggle for Mobile/Tablet */}
        <div className="xl:hidden fixed bottom-6 right-6">
           <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
             <SheetTrigger asChild>
               <Button size="icon" className="rounded-full w-14 h-14 shadow-2xl bg-white text-black hover:bg-silver transition-transform hover:scale-110 active:scale-95">
                 <Sparkles className="w-6 h-6" />
               </Button>
             </SheetTrigger>
             <SheetContent side="right" className="p-0 w-[90%] sm:w-[420px] border-l border-border bg-card">
               <SheetHeader className="p-6 border-b border-border">
                 <SheetTitle className="text-left font-display text-[0.7rem] uppercase tracking-widest">Form Bantuan Analisis</SheetTitle>
               </SheetHeader>
               <div className="h-[calc(100vh-80px)] overflow-hidden">
                 <AnalysisForm onInsertDraft={handleInsertFromForm} />
               </div>
             </SheetContent>
           </Sheet>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
