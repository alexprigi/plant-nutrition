import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import PublicShell from '@/components/layout/PublicShell';
import { localizedMetadata } from '@/lib/metadata';

// Predefiniti di tutte le pagine /{lingua}/...; le pagine con metadati propri li sostituiscono
export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata(params, 'sito');
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <PublicShell>{children}</PublicShell>
    </NextIntlClientProvider>
  );
}
