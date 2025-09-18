// Summarize the descriptions of provided features.
//
// - summarizeFeatureDescriptions - A function that summarizes feature descriptions.
// - SummarizeFeatureDescriptionsInput - The input type for the summarizeFeatureDescriptions function.
// - SummarizeFeatureDescriptionsOutput - The return type for the summarizeFeatureDescriptions function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFeatureDescriptionsInputSchema = z.array(
  z.object({
    description: z.string().describe('The full description of the feature.'),
  })
);
export type SummarizeFeatureDescriptionsInput = z.infer<
  typeof SummarizeFeatureDescriptionsInputSchema
>;

const SummarizeFeatureDescriptionsOutputSchema = z.array(
  z.object({
    summary: z
      .string()
      .describe('A concise, one-sentence summary of the feature description.'),
  })
);
export type SummarizeFeatureDescriptionsOutput = z.infer<
  typeof SummarizeFeatureDescriptionsOutputSchema
>;

export async function summarizeFeatureDescriptions(
  input: SummarizeFeatureDescriptionsInput
): Promise<SummarizeFeatureDescriptionsOutput> {
  return summarizeFeatureDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFeatureDescriptionsPrompt',
  input: {schema: SummarizeFeatureDescriptionsInputSchema},
  output: {schema: SummarizeFeatureDescriptionsOutputSchema},
  prompt: `Summarize the following feature descriptions into concise, one-sentence summaries. Return the summaries in the same order as the input.

{{#each this}}
Description: {{{this.description}}}
Summary:
{{/each}}`,
});

const summarizeFeatureDescriptionsFlow = ai.defineFlow(
  {
    name: 'summarizeFeatureDescriptionsFlow',
    inputSchema: SummarizeFeatureDescriptionsInputSchema,
    outputSchema: SummarizeFeatureDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
