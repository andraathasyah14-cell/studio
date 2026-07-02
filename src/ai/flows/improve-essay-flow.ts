'use server';

/**
 * @fileOverview Flow Genkit untuk memperbaiki kualitas penulisan esai.
 *
 * - improveEssay - Fungsi untuk memproses perbaikan teks esai menggunakan AI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveEssayInputSchema = z.object({
  content: z.string().describe('Konten esai yang ingin diperbaiki.'),
  tone: z.string().optional().describe('Nada atau gaya bahasa yang diinginkan (misal: Akademik, Provokatif, Formal).'),
});
export type ImproveEssayInput = z.infer<typeof ImproveEssayInputSchema>;

const ImproveEssayOutputSchema = z.object({
  improvedContent: z.string().describe('Konten esai yang telah diperbaiki oleh AI.'),
});
export type ImproveEssayOutput = z.infer<typeof ImproveEssayOutputSchema>;

export async function improveEssay(input: ImproveEssayInput): Promise<ImproveEssayOutput> {
  return improveEssayFlow(input);
}

const improveEssayPrompt = ai.definePrompt({
  name: 'improveEssayPrompt',
  input: {schema: ImproveEssayInputSchema},
  output: {schema: ImproveEssayOutputSchema},
  prompt: `Kamu adalah editor esai profesional dan pakar semiotika. 
Tugasmu adalah memperbaiki draf esai berikut agar lebih tajam, berbobot, dan memiliki alur logika yang lebih kuat.

Instruksi Khusus:
1. Jangan mengubah inti argumen atau data faktual yang ada.
2. Perbaiki diksi agar lebih presisi dan akademis namun tetap bisa dinikmati (tidak kaku).
3. Tingkatkan koherensi antar paragraf.
4. Pastikan nada tulisan sesuai dengan permintaan (Default: Intelektual-Opini).

Nada Tulisan: {{#if tone}}{{{tone}}}{{else}}Intelektual & Berbobot{{/if}}

Draf Esai:
{{{content}}}`,
});

const improveEssayFlow = ai.defineFlow(
  {
    name: 'improveEssayFlow',
    inputSchema: ImproveEssayInputSchema,
    outputSchema: ImproveEssayOutputSchema,
  },
  async input => {
    const {output} = await improveEssayPrompt(input);
    return output!;
  }
);
