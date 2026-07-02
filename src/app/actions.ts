'use server';

import { improveFeatureDescription, type ImproveFeatureDescriptionInput, type ImproveFeatureDescriptionOutput } from '@/ai/flows/improve-feature-descriptions';
import { improveEssay, type ImproveEssayInput, type ImproveEssayOutput } from '@/ai/flows/improve-essay-flow';

export async function improveDescriptionAction(input: ImproveFeatureDescriptionInput): Promise<ImproveFeatureDescriptionOutput> {
  return await improveFeatureDescription(input);
}

export async function improveEssayAction(input: ImproveEssayInput): Promise<ImproveEssayOutput> {
  return await improveEssay(input);
}
