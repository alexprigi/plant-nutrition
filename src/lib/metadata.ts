import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

// Titolo e descrizione di una pagina nella lingua della richiesta, dalle chiavi
// `meta-titolo` e `meta-descrizione` del namespace indicato in messages/*.json.
export async function localizedMetadata(
  params: Promise<{ locale: string }>,
  namespace: string,
  extra: Metadata = {},
): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace })
  return { title: t('meta-titolo'), description: t('meta-descrizione'), ...extra }
}
