import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'policy-cancellazione' });
  return {
    title: t('meta-titolo'),
    description: t('meta-descrizione'),
  };
}

export default async function PolicyCancellazione({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'policy-cancellazione' });

  const h1Lista = t.raw('h1-lista') as string[];
  const h2Lista = t.raw('h2-lista') as string[];
  const h3Lista = t.raw('h3-lista') as string[];

  return (
    <div className="min-h-screen">
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-center" style={{ color: 'var(--brand-title)' }}>
            {t('titolo')}
          </h1>
          <p className="text-lg text-center" style={{ color: 'var(--text-dark-green)' }}>
            {t('aggiornamento')}
          </p>
        </div>
      </section>

      <section className="py-12" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
          <div style={{ color: 'var(--text-dark-green)' }}>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h1')}</h2>
            <p>{t('h1-intro')}</p>
            <ul>
              {h1Lista.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/info@vivaplantnutrition\.com/, '<a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a>') }} />)}
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h2')}</h2>
            <ul>
              {h2Lista.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/info@vivaplantnutrition\.com/, '<a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a>') }} />)}
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h3')}</h2>
            <ul>
              {h3Lista.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/info@vivaplantnutrition\.com/, '<a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a>') }} />)}
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h4')}</h2>
            <p>{t('h4-testo')}</p>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h5')}</h2>
            <p>{t('h5-testo')}</p>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h6')}</h2>
            <p dangerouslySetInnerHTML={{ __html: t('h6-testo').replace(/info@vivaplantnutrition\.com/, '<a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a>') }} />

          </div>
        </div>
      </section>
    </div>
  );
}
