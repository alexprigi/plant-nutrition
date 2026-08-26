import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function CookiePolicyPage() {
  const t = await getTranslations('cookie-policy');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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

      {/* Contenuto Cookie Policy */}
      <section className="py-12" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg" style={{ color: 'var(--text-dark-green)' }}>
          <p className="mb-4">{t('intro')}</p>
          <h2 style={{ color: 'var(--brand-title)' }}>{t('tipi-titolo')}</h2>
          <ul>
            <li>{t('tipo-tecnici')}</li>
            <li>{t('tipo-analisi')}</li>
            <li>{t('tipo-terze-parti')}</li>
          </ul>
          <h2 style={{ color: 'var(--brand-title)' }}>{t('gestione-titolo')}</h2>
          <p>{t('gestione-testo')}</p>
          <h2 style={{ color: 'var(--brand-title)' }}>{t('contatti-titolo')}</h2>
          <p>{t('contatti-testo')}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
            {t('cta-titolo')}
          </h3>
          <p className="mb-6" style={{ color: 'var(--text-dark-green)' }}>
            {t('cta-testo')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium transition-all duration-200 text-lg"
            style={{ background: 'var(--brand-title)', color: 'white' }}
          >
            {t('cta-bottone')}
          </Link>
        </div>
      </section>
    </div>
  );
}
