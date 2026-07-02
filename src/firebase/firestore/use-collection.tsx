'use client';

import { useState, useEffect, useRef } from 'react';
import {
  onSnapshot,
  Query,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const queryRef = useRef<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    // Hindari re-subscribe jika string query sama (stabilitas ekstra)
    const currentQueryStr = JSON.stringify((query as any)._query || query.toString());
    if (queryRef.current === currentQueryStr) return;
    queryRef.current = currentQueryStr;

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const docs = snapshot.docs.map((doc) => ({
          ...(doc.data() as any),
          id: doc.id,
        }));
        setData(docs);
        setLoading(false);
      },
      async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: (query as any)._query?.path?.toString() || 'unknown',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(serverError);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      queryRef.current = null;
    };
  }, [query]);

  return { data, loading, error };
}
