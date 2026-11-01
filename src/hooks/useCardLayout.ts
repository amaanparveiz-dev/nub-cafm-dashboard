import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants/config';
import type { CardLayout, CardSize } from '../types';
import { localStore, parseJson } from '../utils/storage';

export interface CardLayoutApi {
  layout: CardLayout;
  update: (id: string, patch: CardSize) => void;
  resetCard: (id: string) => void;
  resetAll: () => void;
}

/** Per-card layout overrides ({ [cardId]: { span, height } }) persisted to localStorage. */
export default function useCardLayout(): CardLayoutApi {
  const [layout, setLayout] = useState<CardLayout>(() =>
    parseJson<CardLayout>(localStore.get(STORAGE_KEYS.layout), {}),
  );

  useEffect(() => {
    localStore.set(STORAGE_KEYS.layout, JSON.stringify(layout));
  }, [layout]);

  const update = useCallback(
    (id: string, patch: CardSize) => setLayout((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } })),
    [],
  );
  const resetCard = useCallback(
    (id: string) =>
      setLayout((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => key !== id))),
    [],
  );
  const resetAll = useCallback(() => setLayout({}), []);

  return { layout, update, resetCard, resetAll };
}
