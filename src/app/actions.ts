'use server';

import { improveFeatureDescription, type ImproveFeatureDescriptionInput, type ImproveFeatureDescriptionOutput } from '@/ai/flows/improve-feature-descriptions';

export async function improveDescriptionAction(input: ImproveFeatureDescriptionInput): Promise<ImproveFeatureDescriptionOutput> {
  // A real app would have authentication and authorization checks here.
  return await improveFeatureDescription(input);
}
