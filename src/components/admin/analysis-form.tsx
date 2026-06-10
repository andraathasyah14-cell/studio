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

  const handleTemplateChange = (value: string) => {
    const hasAnswers = Object.values(answers).some(a => a.trim().length > 0);
    
    if (hasAnswers) {
      const confirmChange = window.confirm("Jawaban saat ini akan hilang. Lanjutkan?");
      if (!confirmChange) return;
    }
    
    setSelectedTemplateKey(value);
    setAnswers({});
  };

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
      {/* Header Panel */}
      <div className="p-4 md:p-6 border-b border-border bg-gradient-to-b from-white/[0.03] to-transparent space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white text-black rounded-sm">
              <ClipboardCheck className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white">Panduan Berpikir</h2>
          </div>
          {activeTemplate && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white" onClick={handleReset}>
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Pilih Template:</label>
          <Select value={selectedTemplateKey} onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-full bg-background/50 border-border rounded-none text-[0.65rem] uppercase tracking-widest h-9 md:h-10">
              <SelectValue placeholder="Pilih Kerangka" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-none">
              <SelectItem value="none" className="text-[0.65rem] uppercase tracking-widest">Bebas</SelectItem>
              <SelectItem value="academic" className="text-[0.65rem] uppercase tracking-widest">Akademik</SelectItem>
              <SelectItem value="news" className="text-[0.65rem] uppercase tracking-widest">Berita</SelectItem>
              <SelectItem value="issue" className="text-[0.65rem] uppercase tracking-widest">Isu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeTemplate && (
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-end">
              <span className="text-[0.55rem] text-white/50 uppercase tracking-widest">{answeredQuestions}/{totalQuestions} Terjawab</span>
              <span className="text-lg font-display font-bold text-white leading-none">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-0.5 rounded-none bg-white/5" />
          </div>
        )}
      </div>

      {/* Questions Area */}
      <div className="flex-1 overflow-y-auto">
        {!activeTemplate ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-20">
            <LayoutList className="w-10 h-10" />
            <div className="space-y-2">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em]">Pilih Template</p>
              <p className="text-[0.6rem] italic leading-relaxed max-w-[180px]">
                Gunakan form untuk memandu analisis Anda secara sistematis.
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
                  <AccordionTrigger className="hover:no-underline py-4 px-5 hover:bg-white/[0.02] group">
                    <div className="flex items-center gap-3 text-left w-full">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[0.55rem] transition-colors shrink-0 ${isSectionComplete ? 'bg-white border-white text-black' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                        {isSectionComplete ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-display text-[0.6rem] font-bold uppercase tracking-[0.1em] text-white">
                          {section.title}
                        </span>
                        <span className="text-[0.5rem] text-muted-foreground uppercase tracking-wider">
                          {answeredInSection}/{questionsInSection} Pertanyaan
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-5 bg-black/20 space-y-8">
                    {section.questions.map((q, qIdx) => (
                      <div key={q.id} className="space-y-3 relative pl-3 border-l border-white/5 focus-within:border-white transition-colors">
                        <label className="text-[0.7rem] font-medium text-white/80 leading-relaxed block">
                          {q.text}
                        </label>
                        <Textarea
                          placeholder={q.placeholder}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className="bg-background/40 border-border text-[0.8rem] min-h-[100px] md:min-h-[120px] resize-none focus-visible:ring-0 focus-visible:border-white transition-all rounded-none font-serif italic border-dashed py-3"
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

      {/* Generate Button Area */}
      {activeTemplate && (
        <div className="p-4 md:p-6 border-t border-border bg-black/40 backdrop-blur-md">
          <Button
            className="w-full text-[0.6rem] uppercase tracking-[0.2em] h-12 rounded-none bg-white text-black hover:bg-silver transition-all shadow-xl font-bold"
            onClick={handleGenerateDraft}
            disabled={answeredQuestions === 0}
          >
            Selesaikan Kuis & Pindahkan
            <FileText className="w-3.5 h-3.5 ml-2" />
          </Button>
          <p className="mt-3 text-[0.5rem] italic text-muted-foreground/50 text-center leading-relaxed px-2">
            Klik untuk menyusun jawaban murni Anda ke dalam editor utama sebagai satu kesatuan teks.
          </p>
        </div>
      )}
    </div>
  );
}
