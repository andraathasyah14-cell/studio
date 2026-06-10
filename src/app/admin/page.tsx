'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Save, Send, Trash2, FileText, Layout, Info } from 'lucide-react';
import { ANALYSIS_TEMPLATES, generateTemplateText } from '@/lib/analysis-templates';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('none');

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    if (value === 'none') {
      setContent('');
    } else {
      const templateText = generateTemplateText(value);
      setContent(templateText);
    }
  };

  const handleSaveDraft = () => {
    alert('Draf berhasil disimpan (Simulasi)');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col h-[calc(100vh-56px)] overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-10 lg:px-20">
          <div className="max-w-[1000px] mx-auto space-y-10">
            
            {/* Admin Header Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-8">
              <div>
                <h1 className="font-display text-2xl font-bold text-white mb-1">Editor Analisis</h1>
                <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Drafting mode · Private admin view
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 h-10">
                  <Layout className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mr-2">Template:</span>
                  <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                    <SelectTrigger className="w-[180px] h-7 bg-transparent border-none text-[0.65rem] uppercase font-medium focus:ring-0">
                      <SelectValue placeholder="Pilih Template" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="none" className="text-[0.65rem] uppercase">Tanpa Template</SelectItem>
                      {Object.values(ANALYSIS_TEMPLATES).map(t => (
                        <SelectItem key={t.id} value={t.id} className="text-[0.65rem] uppercase">{t.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white" onClick={() => {setTitle(''); setContent(''); setSelectedTemplate('none');}}>
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
            </div>

            {/* Editing Area */}
            <div className="space-y-8 bg-card/10 p-8 border border-border/50">
              <div className="space-y-2">
                <label className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground block">Judul Analisis</label>
                <Input
                  placeholder="Masukkan judul yang provokatif dan berdasar..."
                  className="text-4xl font-display font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto placeholder:text-muted/20"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground block">Konten Analisis</label>
                  {selectedTemplate !== 'none' && (
                    <div className="flex items-center gap-1.5 text-[0.6rem] text-emerald-500 uppercase tracking-widest">
                      <Info className="w-3 h-3" />
                      Template Aktif: {ANALYSIS_TEMPLATES[selectedTemplate].title}
                    </div>
                  )}
                </div>
                <Textarea
                  placeholder="Mulai menulis argumen Anda... Gunakan Markdown untuk format teks."
                  className="min-h-[60vh] bg-transparent border-none focus-visible:ring-0 p-0 text-lg font-serif italic leading-relaxed placeholder:text-muted/20 resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-auto p-4 border-t border-border bg-card flex justify-between items-center px-12 text-[0.6rem] uppercase tracking-widest text-muted-foreground/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> Editor: Standard Markdown</span>
            <span>Word Count: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Auto-save: Enabled (Local)
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
