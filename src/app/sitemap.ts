import type { MetadataRoute } from 'next'
import { LOCALES } from '@/i18n/locales'
import { PUBLIC_PATHS, languageAlternates, pageUrl } from '@/lib/site'

// Ogni pagina compare una volta per lingua e dichiara le altre versioni (hreflang)
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: pageUrl(locale, path),
      alternates: { languages: languageAlternates(path) },
    })),
  )
}
