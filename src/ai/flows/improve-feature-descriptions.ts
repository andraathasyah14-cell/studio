'use server';

/**
 * @fileOverview This file defines a Genkit flow for improving feature descriptions using AI.
 *
 * The flow takes a feature description as input and returns an improved version.
 *
 * @file         improve-feature-descriptions.ts
 * @exports    improveFeatureDescription - The main function to improve feature descriptions.
 * @exports    ImproveFeatureDescriptionInput - The input type for the improveFeatureDescription function.
 * @exports    ImproveFeatureDescriptionOutput - The output type for the improveFeatureDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveFeatureDescriptionInputSchema = z.object({
  description: z.string().describe('The original feature description.'),
});
export type ImproveFeatureDescriptionInput = z.infer<
  typeof ImproveFeatureDescriptionInputSchema
>;

const ImproveFeatureDescriptionOutputSchema = z.object({
  improvedDescription: z
    .string()
    .describe('The improved feature description.'),
});
export type ImproveFeatureDescriptionOutput = z.infer<
  typeof ImproveFeatureDescriptionOutputSchema
>;

export async function improveFeatureDescription(
  input: ImproveFeatureDescriptionInput
): Promise<ImproveFeatureDescriptionOutput> {
  return improveFeatureDescriptionFlow(input);
}

const improveFeatureDescriptionPrompt = ai.definePrompt({
  name: 'improveFeatureDescriptionPrompt',
  input: {schema: ImproveFeatureDescriptionInputSchema},
  output: {schema: ImproveFeatureDescriptionOutputSchema},
  prompt: `You are an expert copywriter. Please improve the following feature description to enhance its clarity, tone, and impact:\n\nOriginal Description: {{{description}}}\n\nImproved Description:`,
});

const improveFeatureDescriptionFlow = ai.defineFlow(
  {
    name: 'improveFeatureDescriptionFlow',
    inputSchema: ImproveFeatureDescriptionInputSchema,
    outputSchema: ImproveFeatureDescriptionOutputSchema,
  },
  async input => {
    const {output} = await improveFeatureDescriptionPrompt(input);
    return output!;
  }
);
