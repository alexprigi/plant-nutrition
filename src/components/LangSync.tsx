'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

// Il layout principale imposta <html lang> solo al primo caricamento: quando si cambia lingua
// navigando dentro il sito (selettore di lingua, vecchi link) non viene rieseguito.
export default function LangSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
