'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Send, Trash2, Sparkles } from 'lucide-react';
import SmartAssistant from '@/components/admin/smart-assistant';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSaveDraft = () => {
    alert('Draf berhasil disimpan secara lokal.');
  };

  const handleInsertFromAssistant = (text: string) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + text);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 flex h-[calc(100vh-56px)] overflow-hidden">
        {/* Main Editor Section (Left) */}
        <div className="flex-1 overflow-y-auto px-6 py-10 lg:px-12 border-r border-border">
          <div className="max-w-[800px] mx-auto space-y-10">
            
            {/* Admin Header Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-8">
              <div>
                <h1 className="font-display text-2xl font-bold text-white mb-1">Editor Analisis</h1>
                <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Drafting mode · Private admin view
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white" onClick={() => {setTitle(''); setContent('');}}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-[0.6rem] uppercase tracking-widest h-10 px-5" onClick={handleSaveDraft}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Draf
                </Button>
                <Button size="sm" className="text-[0.6rem] uppercase tracking-widest bg-white text-black hover:bg-silver h-10 px-5">
                  <Send className="w-4 h-4 mr-2" />
                  Publikasikan
                </Button>
              </div>
            </div>

            {/* Editing Area */}
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground block">Judul Analisis</label>
                <Input
                  placeholder="Masukkan judul..."
                  className="text-4xl font-display font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto placeholder:text-muted/10"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground block">Konten Analisis</label>
                <Textarea
                  placeholder="Mulai menulis draf akhir Anda di sini..."
                  className="min-h-[60vh] bg-transparent border-none focus-visible:ring-0 p-0 text-lg font-serif italic leading-relaxed placeholder:text-muted/10 resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Smart Assistant Sidebar (Right) */}
        <aside className="w-[400px] hidden xl:block shrink-0">
          <SmartAssistant onInsertText={handleInsertFromAssistant} />
        </aside>

        {/* Floating Assistant for smaller screens */}
        <div className="xl:hidden fixed bottom-6 right-6">
           <Button size="icon" className="rounded-full w-12 h-12 shadow-xl bg-white text-black hover:bg-silver">
             <Sparkles className="w-5 h-5" />
           </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
