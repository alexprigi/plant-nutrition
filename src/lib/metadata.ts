import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { languageAlternates, pageUrl } from '@/lib/site'

// Pagina canonica e versioni nelle altre lingue (hreflang) per una pagina pubblica; `path` parte da "/" ('' per la home)
export function alternatesFor(locale: string, path: string): NonNullable<Metadata['alternates']> {
  return { canonical: pageUrl(locale, path), languages: languageAlternates(path) }
}

// Titolo e descrizione di una pagina nella lingua della richiesta, dalle chiavi
// `meta-titolo` e `meta-descrizione` del namespace indicato in messages/*.json.
// Con `path` aggiunge anche canonical e hreflang: vanno impostati pagina per pagina, perché i figli ereditano.
export async function localizedMetadata(
  params: Promise<{ locale: string }>,
  namespace: string,
  extra: Metadata = {},
  path?: string,
): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace })
  return {
    title: t('meta-titolo'),
    description: t('meta-descrizione'),
    ...(path !== undefined && { alternates: alternatesFor(locale, path) }),
    ...extra,
  }
}
