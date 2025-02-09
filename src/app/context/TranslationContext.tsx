'use client';

import React, { createContext, useContext } from 'react';
import { ar } from '@/translations/ar';
import { en } from '@/translations/en';
import { useParams } from 'next/navigation';

type TranslationType = typeof ar | typeof en;

const translations = {
  ar,
  en,
} as const;

const TranslationContext = createContext<TranslationType>(en);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const translation = translations[lang as keyof typeof translations] || en;

  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
