'use client';

import React, { useState, useMemo } from 'react';
import { ANALYSIS_TEMPLATES } from '@/lib/analysis-templates';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  RotateCcw,
  LayoutList,
  ClipboardCheck,
  FileText
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalysisFormProps {
  onInsertDraft: (text: string) => void;
}

export default function AnalysisForm({ onInsertDraft }: AnalysisFormProps) {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('none');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const activeTemplate = selectedTemplateKey !== 'none' ? ANALYSIS_TEMPLATES[selectedTemplateKey] : null;

  // Handle template change with manual confirmation
  const handleTemplateChange = (value: string) => {
    const hasAnswers = Object.values(answers).some(a => a.trim().length > 0);
    
    if (hasAnswers) {
      const confirmChange = window.confirm("Jawaban saat ini akan hilang. Lanjutkan?");
      if (!confirmChange) return;
    }
    
    setSelectedTemplateKey(value);
    setAnswers({});
  };

  // Progress calculations
  const totalQuestions = useMemo(() => {
    if (!activeTemplate) return 0;
    return activeTemplate.sections.flatMap(s => s.questions).length;
  }, [activeTemplate]);

  const answeredQuestions = useMemo(() => {
    if (!activeTemplate) return 0;
    return activeTemplate.sections.flatMap(s => s.questions).filter(q => !!answers[q.id]?.trim()).length;
  }, [activeTemplate, answers]);

  const progressPercent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  // Updated logic: Only concatenate pure answers, no headers or questions
  const handleGenerateDraft = () => {
    if (!activeTemplate) return;
    
    const draftContent = activeTemplate.sections
      .flatMap(section => 
        section.questions
          .map(q => answers[q.id]?.trim())
          .filter(Boolean)
      )
      .join('\n\n');
    
    if (draftContent) {
      onInsertDraft(draftContent);
    }
  };

  const handleReset = () => {
    if (window.confirm('Bersihkan semua jawaban form?')) {
      setAnswers({});
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header Panel - Analysis Selection */}
      <div className="p-6 border-b border-border bg-gradient-to-b from-white/[0.03] to-transparent space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white text-black rounded-sm">
              <ClipboardCheck className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white">Form Analisis</h2>
          </div>
          {activeTemplate && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white" onClick={handleReset}>
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">Pilih Jenis Analisis:</label>
          <Select value={selectedTemplateKey} onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-full bg-background/50 border-border rounded-none text-[0.7rem] uppercase tracking-widest h-10">
              <SelectValue placeholder="Pilih Template" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-none">
              <SelectItem value="none" className="text-[0.7rem] uppercase tracking-widest">Menulis Bebas</SelectItem>
              <SelectItem value="academic" className="text-[0.7rem] uppercase tracking-widest">Analisis Paper Akademik</SelectItem>
              <SelectItem value="news" className="text-[0.7rem] uppercase tracking-widest">Analisis Berita</SelectItem>
              <SelectItem value="issue" className="text-[0.7rem] uppercase tracking-widest">Analisis Isu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeTemplate && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground block">Progres Pengisian</span>
                <span className="text-[0.55rem] text-white/50">{answeredQuestions} / {totalQuestions} Terjawab</span>
              </div>
              <span className="text-xl font-display font-bold text-white leading-none">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1 rounded-none bg-white/5" />
          </div>
        )}
      </div>

      {/* Questions Area */}
      <div className="flex-1 overflow-y-auto">
        {!activeTemplate ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-20">
            <LayoutList className="w-12 h-12" />
            <div className="space-y-2">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.2em]">Pilih Template di Atas</p>
              <p className="text-[0.65rem] italic leading-relaxed max-w-[200px]">
                Gunakan form untuk memandu analisis Anda secara sistematis sebelum menyusun draf akhir.
              </p>
            </div>
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={['item-0']} className="w-full">
            {activeTemplate.sections.map((section, idx) => {
              const questionsInSection = section.questions.length;
              const answeredInSection = section.questions.filter(q => !!answers[q.id]?.trim()).length;
              const isSectionComplete = answeredInSection === questionsInSection && questionsInSection > 0;

              return (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border last:border-0">
                  <AccordionTrigger className="hover:no-underline py-5 px-6 hover:bg-white/[0.02] group">
                    <div className="flex items-center gap-4 text-left w-full">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[0.6rem] transition-colors shrink-0 ${isSectionComplete ? 'bg-white border-white text-black' : 'border-muted-foreground/30 text-muted-foreground group-hover:border-white'}`}>
                        {isSectionComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-display text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white">
                          {section.title}
                        </span>
                        <span className="text-[0.55rem] text-muted-foreground tracking-widest uppercase">
                          {answeredInSection}/{questionsInSection} Terjawab
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 bg-black/20 space-y-10">
                    {section.questions.map((q, qIdx) => (
                      <div key={q.id} className="space-y-4 relative pl-4 border-l border-white/5 focus-within:border-white transition-colors">
                        <div className="space-y-1">
                          <span className="text-[0.55rem] text-muted-foreground uppercase tracking-tighter">Bagian {idx + 1}.{qIdx + 1}</span>
                          <label className="text-[0.75rem] font-medium text-white/80 leading-relaxed block">
                            {q.text}
                          </label>
                        </div>
                        <Textarea
                          placeholder={q.placeholder}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className="bg-background/40 border-border text-[0.85rem] min-h-[120px] resize-none focus-visible:ring-0 focus-visible:border-white transition-all rounded-none font-serif italic border-dashed"
                        />
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>

      {/* Generate Button */}
      {activeTemplate && (
        <div className="p-6 border-t border-border bg-black/40 backdrop-blur-md">
          <Button
            className="w-full text-[0.65rem] uppercase tracking-[0.2em] h-12 rounded-none bg-white text-black hover:bg-silver transition-all shadow-xl group"
            onClick={handleGenerateDraft}
            disabled={answeredQuestions === 0}
          >
            Generate Draft
            <FileText className="w-3.5 h-3.5 ml-2 transition-all" />
          </Button>
          <p className="mt-4 text-[0.55rem] italic text-muted-foreground/50 text-center leading-relaxed">
            Klik untuk memasukkan jawaban murni Anda ke dalam editor utama.
          </p>
        </div>
      )}
    </div>
  );
}
