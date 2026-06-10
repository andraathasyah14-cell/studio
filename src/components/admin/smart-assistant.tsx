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
  BrainCircuit,
  RotateCcw,
  LayoutList
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
    
    if (text) onInsertText(text);
  };

  const handleReset = () => {
    if (confirm('Bersihkan semua jawaban form?')) {
      setAnswers({});
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header Panel */}
      <div className="p-6 border-b border-border space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-white" />
            <h2 className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white">Thinking Assistant Form</h2>
          </div>
          {activeTemplate && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white" onClick={handleReset}>
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Template Selector */}
        <div className="grid grid-cols-1 gap-2">
          <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-1">Pilih Kerangka Berpikir:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTemplateKey === 'none' ? 'secondary' : 'outline'}
              size="sm"
              className="text-[0.6rem] uppercase h-8 px-3 rounded-none"
              onClick={() => {setSelectedTemplateKey('none'); setAnswers({});}}
            >
              Bebas
            </Button>
            {Object.values(ANALYSIS_TEMPLATES).map(t => (
              <Button
                key={t.id}
                variant={selectedTemplateKey === t.id ? 'secondary' : 'outline'}
                size="sm"
                className="text-[0.6rem] uppercase h-8 px-3 rounded-none"
                onClick={() => {setSelectedTemplateKey(t.id); setAnswers({});}}
              >
                {t.title}
              </Button>
            ))}
          </div>
        </div>

        {activeTemplate && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-end">
              <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">Progres Pengisian</span>
              <span className="text-[0.6rem] font-medium text-white">{answeredQuestions} / {totalQuestions}</span>
            </div>
            <Progress value={progressPercent} className="h-0.5" />
          </div>
        )}
      </div>

      {/* Form Area (Google Form style) */}
      <div className="flex-1 overflow-y-auto">
        {!activeTemplate ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-30">
            <LayoutList className="w-10 h-10" />
            <div className="space-y-1">
              <p className="text-[0.7rem] font-bold uppercase tracking-widest">Assistant Non-aktif</p>
              <p className="text-[0.65rem] italic leading-relaxed">
                Pilih template untuk mulai mengisi panduan berpikir secara terstruktur.
              </p>
            </div>
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {activeTemplate.sections.map((section, idx) => {
              const answeredInSection = section.questions.filter(q => !!answers[q.id]?.trim()).length;
              const isSectionComplete = answeredInSection === section.questions.length && section.questions.length > 0;

              return (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border">
                  <AccordionTrigger className="hover:no-underline py-4 px-6 bg-background/30">
                    <div className="flex items-center gap-3 text-left w-full">
                      {isSectionComplete ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[0.5rem] text-muted-foreground shrink-0">
                          {idx + 1}
                        </div>
                      )}
                      <div className="flex flex-col gap-0.5">
                        <span className="font-display text-[0.65rem] font-bold uppercase tracking-widest text-white">
                          {section.title}
                        </span>
                        <span className="text-[0.55rem] text-muted-foreground">
                          {answeredInSection} dari {section.questions.length} terjawab
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 bg-card/20 space-y-8">
                    {section.questions.map(q => (
                      <div key={q.id} className="space-y-3 group">
                        <label className="text-[0.65rem] text-muted-foreground group-focus-within:text-white transition-colors leading-relaxed block">
                          {q.text}
                        </label>
                        <Textarea
                          placeholder={q.placeholder}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className="bg-background/50 border-border text-[0.8rem] min-h-[80px] resize-none focus-visible:ring-0 focus-visible:border-white transition-all rounded-none font-serif italic"
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

      {/* Footer Insert Tools */}
      {activeTemplate && (
        <div className="p-6 border-t border-border bg-background space-y-4">
          <div className="space-y-3">
             <Button
                variant="outline"
                className="w-full text-[0.6rem] uppercase tracking-widest h-11 rounded-none border-border hover:bg-white hover:text-black transition-all"
                onClick={handleInsertAll}
                disabled={answeredQuestions === 0}
              >
                <ArrowRight className="w-3 h-3 mr-2" />
                Pindahkan Hasil Analisis ke Editor
              </Button>
              <p className="text-[0.5rem] italic text-muted-foreground/60 leading-tight text-center px-4">
                Ini akan menggabungkan semua jawaban Anda menjadi draf kasar di editor utama.
              </p>
          </div>
        </div>
      )}
    </div>
  );
}