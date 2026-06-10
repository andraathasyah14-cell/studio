'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SmartAssistant from '@/components/admin/smart-assistant';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Send, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleInsertText = (text: string) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + text);
  };

  const handleSaveDraft = () => {
    // Logic to save draft would go here
    alert('Draf berhasil disimpan (Simulasi)');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-56px)]">
          <div className="p-8 pb-4 space-y-6 max-w-[800px] w-full mx-auto overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-display text-2xl font-bold text-white">Editor Analisis</h1>
                <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Drafting mode · Private admin view
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white" onClick={() => {setTitle(''); setContent('');}}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-[0.6rem] uppercase tracking-widest" onClick={handleSaveDraft}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Draf
                </Button>
                <Button size="sm" className="text-[0.6rem] uppercase tracking-widest bg-white text-black hover:bg-silver">
                  <Send className="w-4 h-4 mr-2" />
                  Publikasikan
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              <Input
                placeholder="Judul Analisis..."
                className="text-4xl font-display font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto placeholder:text-muted/30"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              <Textarea
                placeholder="Mulai menulis di sini atau gunakan asisten di sebelah kanan untuk panduan..."
                className="min-h-[60vh] bg-transparent border-none focus-visible:ring-0 p-0 text-lg font-serif italic leading-relaxed placeholder:text-muted/30 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-auto p-4 border-t border-border flex justify-between items-center px-12 text-[0.6rem] uppercase tracking-widest text-muted-foreground/40">
            <span>Editor: Standard Markdown</span>
            <span>Word Count: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
          </div>
        </div>

        {/* Sidebar Assistant */}
        <aside className="w-[380px] hidden lg:block h-[calc(100vh-56px)]">
          <SmartAssistant onInsertText={handleInsertText} />
        </aside>
      </main>
      
      <Footer />
    </div>
  );
}
