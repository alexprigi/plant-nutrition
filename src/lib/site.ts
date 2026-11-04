import { LOCALES, DEFAULT_LOCALE } from '@/i18n/locales'

const PRODUCTION_URL = 'https://www.vivaplantnutrition.com'
const PRODUCTION_HOSTS = ['www.vivaplantnutrition.com', 'vivaplantnutrition.com']

const configuredUrl = (process.env.AUTH_URL ?? PRODUCTION_URL).replace(/\/$/, '')

// In produzione AUTH_URL può essere anche il dominio senza www, che rimanda a www: negli indirizzi pubblici vale sempre www
export const IS_PRODUCTION_SITE = PRODUCTION_HOSTS.includes(new URL(configuredUrl).host)
export const SITE_URL = IS_PRODUCTION_SITE ? PRODUCTION_URL : configuredUrl

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
