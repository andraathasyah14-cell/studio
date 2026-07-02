'use client';

import { useMemo } from 'react';

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';

/**
 * Hook utilitas untuk menstabilkan referensi Firebase (koleksi, doc, query)
 * guna mencegah infinite render loop pada useCollection atau useDoc.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  return useMemo(factory, deps);
}
