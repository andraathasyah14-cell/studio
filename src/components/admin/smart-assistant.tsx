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
  ArrowRight,
  RotateCcw,
  LayoutList,
  ClipboardCheck
} from 'lucide-react';

interface SmartAssistantProps {
  onInsertText: (text: string) => void;
}

export default function SmartAssistant({ onInsertText }: SmartAssistantProps) {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('none');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const activeTemplate = selectedTemplateKey !== 'none' ? ANALYSIS_TEMPLATES[selectedTemplateKey] : null;

  // Progress calculations
  const totalQuestions = useMemo(() => {
    if (!activeTemplate) return 0;
    return activeTemplate.sections.flatMap(s => s.questions).length;
  }, [activeTemplate]);

  const answeredQuestions = useMemo(() => {
    if (!activeTemplate) return 0;
    return activeTemplate.sections.flatMap(s => s.questions).filter(q => !!answers[q.id]?.trim()).length;
  }, [activeTemplate, answers]);

  const totalSections = activeTemplate?.sections.length || 0;
  const sectionsCompleted = useMemo(() => {
    if (!activeTemplate) return 0;
    return activeTemplate.sections.filter(s => 
      s.questions.every(q => !!answers[q.id]?.trim()) && s.questions.length > 0
    ).length;
  }, [activeTemplate, answers]);

  const progressPercent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleInsertAll = () => {
    if (!activeTemplate) return;
    const text = activeTemplate.sections.map(s => {
      const qText = s.questions
        .filter(q => answers[q.id]?.trim())
        .map(q => `**${q.text}**\n${answers[q.id]}`)
        .join('\n\n');
      
      if (!qText) return '';
      return `### ${s.title}\n\n${qText}`;
    }).filter(Boolean).join('\n\n---\n\n');
    
    if (text) {
      onInsertText(text);
    }
  };

  const handleReset = () => {
    if (confirm('Bersihkan semua jawaban form?')) {
      setAnswers({});
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header Panel - Quiz Header */}
      <div className="p-6 border-b border-border bg-gradient-to-b from-white/[0.03] to-transparent space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white text-black rounded-sm">
              <ClipboardCheck className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white">Thinking Quiz Form</h2>
          </div>
          {activeTemplate && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white" onClick={handleReset}>
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Template Selector */}
        <div className="space-y-3">
          <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">Pilih Kerangka Berpikir:</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {setSelectedTemplateKey('none'); setAnswers({});}}
              className={`px-3 py-1.5 text-[0.6rem] uppercase tracking-wider border transition-all ${selectedTemplateKey === 'none' ? 'bg-white text-black border-white' : 'border-border text-muted-foreground hover:border-gray-500'}`}
            >
              Bebas
            </button>
            {Object.values(ANALYSIS_TEMPLATES).map(t => (
              <button
                key={t.id}
                onClick={() => {setSelectedTemplateKey(t.id); setAnswers({});}}
                className={`px-3 py-1.5 text-[0.6rem] uppercase tracking-wider border transition-all ${selectedTemplateKey === t.id ? 'bg-white text-black border-white' : 'border-border text-muted-foreground hover:border-gray-500'}`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {activeTemplate && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground block">Progres Kuis</span>
                <span className="text-[0.55rem] text-white/50">{answeredQuestions} dari {totalQuestions} pertanyaan</span>
              </div>
              <span className="text-xl font-display font-bold text-white leading-none">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1 rounded-none bg-white/5" />
          </div>
        )}
      </div>

      {/* Quiz Area */}
      <div className="flex-1 overflow-y-auto">
        {!activeTemplate ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-20">
            <LayoutList className="w-12 h-12" />
            <div className="space-y-2">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.2em]">Form Belum Dipilih</p>
              <p className="text-[0.65rem] italic leading-relaxed max-w-[200px]">
                Silakan pilih jenis analisis di atas untuk mulai mengisi kuis panduan berpikir.
              </p>
            </div>
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
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
                          Bab {idx + 1} · {answeredInSection}/{questionsInSection} Terisi
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-8 bg-black/20 space-y-10">
                    {section.questions.map((q, qIdx) => (
                      <div key={q.id} className="space-y-4 relative pl-4 border-l border-white/5 focus-within:border-white transition-colors">
                        <div className="space-y-1">
                          <span className="text-[0.55rem] text-muted-foreground uppercase tracking-tighter">Pertanyaan {idx + 1}.{qIdx + 1}</span>
                          <label className="text-[0.75rem] font-medium text-white/80 leading-relaxed block">
                            {q.text}
                          </label>
                        </div>
                        <Textarea
                          placeholder={q.placeholder}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className="bg-background/40 border-border text-[0.85rem] min-h-[100px] resize-none focus-visible:ring-0 focus-visible:border-white transition-all rounded-none font-serif italic border-dashed"
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

      {/* Footer Tools */}
      {activeTemplate && (
        <div className="p-6 border-t border-border bg-black/40 backdrop-blur-md">
          <Button
            className="w-full text-[0.65rem] uppercase tracking-[0.2em] h-12 rounded-none bg-white text-black hover:bg-silver transition-all shadow-xl"
            onClick={handleInsertAll}
            disabled={answeredQuestions === 0}
          >
            Pindahkan Hasil Kuis ke Editor
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Button>
          <p className="mt-4 text-[0.55rem] italic text-muted-foreground/50 text-center leading-relaxed">
            Klik tombol di atas untuk merangkai semua jawaban kuis menjadi draf draf Markdown di editor utama.
          </p>
        </div>
      )}
    </div>
  );
}