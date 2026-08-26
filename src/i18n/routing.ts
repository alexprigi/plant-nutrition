import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['it', 'de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'always',
  localeDetection: false,
});
