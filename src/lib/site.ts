import { LOCALES, DEFAULT_LOCALE } from '@/i18n/locales'

export const SITE_URL = (process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com').replace(/\/$/, '')

// Pagine pubbliche indicizzabili (blog e ricette sono in lavorazione, la pagina di gestione è privata)
export const PUBLIC_PATHS = ['', '/about', '/services', '/contact', '/booking', '/privacy-policy', '/cookie-policy', '/cancellation-policy'] as const

// Indirizzo di una pagina in una lingua
export const pageUrl = (locale: string, path: string) => `${SITE_URL}/${locale}${path}`

// Le versioni di una pagina nelle altre lingue (hreflang), con x-default sulla lingua predefinita
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((l) => [l, pageUrl(l, path)])),
    'x-default': pageUrl(DEFAULT_LOCALE, path),
  }
}

// Solo il sito di produzione deve comparire nei motori di ricerca (preview e sviluppo restano fuori)
export const IS_PRODUCTION_SITE = new URL(SITE_URL).host === 'www.vivaplantnutrition.com'
