'use client';

import React, { useState, useMemo } from 'react';
import { ANALYSIS_TEMPLATES, Template } from '@/lib/analysis-templates';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, ChevronRight, Copy, FileText, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartAssistantProps {
  onInsertText: (text: string) => void;
}

export default function SmartAssistant({ onInsertText }: SmartAssistantProps) {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('none');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const activeTemplate = selectedTemplateKey !== 'none' ? ANALYSIS_TEMPLATES[selectedTemplateKey] : null;

  const progress = useMemo(() => {
    if (!activeTemplate) return 0;
    const totalQuestions = activeTemplate.sections.flatMap(s => s.questions).length;
    const answeredCount = activeTemplate.sections.flatMap(s => s.questions).filter(q => !!answers[q.id]?.trim()).length;
    return Math.round((answeredCount / totalQuestions) * 100);
  }, [activeTemplate, answers]);

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleInsertAll = () => {
    if (!activeTemplate) return;
    const text = activeTemplate.sections.map(s => {
      const qText = s.questions.map(q => `Q: ${q.text}\nA: ${answers[q.id] || ''}`).join('\n\n');
      return `### ${s.title}\n\n${qText}`;
    }).join('\n\n---\n\n');
    onInsertText(text);
  };

  const handleInsertHeaders = () => {
    if (!activeTemplate) return;
    const text = activeTemplate.sections.map(s => `## ${s.title}\n\n`).join('');
    onInsertText(text);
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="p-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-white">Smart Assistant</h2>
          <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">Analisis Helper</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectedTemplateKey === 'none' ? 'secondary' : 'outline'}
            size="sm"
            className="text-[0.6rem] uppercase h-8 px-2"
            onClick={() => setSelectedTemplateKey('none')}
          >
            Tanpa Template
          </Button>
          {Object.values(ANALYSIS_TEMPLATES).map(t => (
            <Button
              key={t.id}
              variant={selectedTemplateKey === t.id ? 'secondary' : 'outline'}
              size="sm"
              className="text-[0.6rem] uppercase h-8 px-2 truncate"
              onClick={() => setSelectedTemplateKey(t.id)}
            >
              {t.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!activeTemplate ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <LayoutList className="w-8 h-8" />
            <p className="text-xs italic leading-relaxed max-w-[200px]">
              Pilih template untuk memulai panduan berpikir terstruktur.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">Progres Analisis</span>
                <span className="text-[0.6rem] font-medium text-white">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>

            <Accordion type="multiple" className="space-y-4">
              {activeTemplate.sections.map((section, idx) => {
                const answeredInSection = section.questions.filter(q => !!answers[q.id]?.trim()).length;
                const isComplete = answeredInSection === section.questions.length;

                return (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border border-border px-4 py-1 rounded-none bg-background/50">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-3 text-left">
                        {isComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[0.5rem] text-muted-foreground">
                            {idx + 1}
                          </div>
                        )}
                        <span className="font-display text-[0.7rem] font-medium uppercase tracking-widest text-white">
                          {section.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-6">
                      {section.questions.map(q => (
                        <div key={q.id} className="space-y-2">
                          <label className="text-[0.65rem] text-muted-foreground leading-tight block">
                            {q.text}
                          </label>
                          <Textarea
                            placeholder={q.placeholder}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="bg-card/50 border-border text-xs min-h-[60px] resize-none focus-visible:ring-0 focus-visible:border-white transition-all rounded-none"
                          />
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}
      </div>

      {activeTemplate && (
        <div className="p-6 border-t border-border bg-card/50 space-y-3">
          <p className="text-[0.55rem] uppercase tracking-widest text-muted-foreground text-center mb-2">
            Quick Insert Tools
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-[0.6rem] uppercase tracking-tighter h-9"
              onClick={handleInsertHeaders}
            >
              <FileText className="w-3 h-3 mr-1" />
              Judul Saja
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-[0.6rem] uppercase tracking-tighter h-9"
              onClick={handleInsertAll}
            >
              <Copy className="w-3 h-3 mr-1" />
              Semua Teks
            </Button>
          </div>
          <p className="text-[0.5rem] italic text-muted-foreground/60 leading-tight text-center">
            Gunakan template sebagai panduan. Anda tetap memiliki kontrol penuh di editor.
          </p>
        </div>
      )}
    </div>
  );
}
