import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy-policy' });
  return {
    title: t('meta-titolo'),
    description: t('meta-descrizione'),
  };
}

export default async function PrivacyPolicy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy-policy' });

  const navLista = t.raw('nav-lista') as string[];
  const volLista = t.raw('vol-lista') as string[];
  const cookieLista = t.raw('cookie-lista') as string[];
  const finLista = t.raw('fin-lista') as string[];
  const baseLista = t.raw('base-lista') as string[];
  const condLista = t.raw('cond-lista') as string[];
  const consLista = t.raw('cons-lista') as string[];
  const dirLista = t.raw('dir-lista') as string[];
  const sicLista = t.raw('sic-lista') as string[];
  const autoritaLista = t.raw('autorita-lista') as string[];

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

      {/* Contenuto */}
      <section className="py-12" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
          <div style={{ color: 'var(--text-dark-green)' }}>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h1')}</h2>
            <p>
              <strong>{t('titolare-nome')}</strong><br />
              {t('titolare-persona')}<br />
              Email: <a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a>
            </p>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h2')}</h2>

            <h3 style={{ color: 'var(--brand-title)' }}>{t('h21')}</h3>
            <p>{t('nav-intro')}</p>
            <ul>{navLista.map((item, i) => <li key={i}>{item}</li>)}</ul>

            <h3 style={{ color: 'var(--brand-title)' }}>{t('h22')}</h3>
            <p>{t('vol-intro')}</p>
            <ul>{volLista.map((item, i) => <li key={i}>{item}</li>)}</ul>

            <h3 style={{ color: 'var(--brand-title)' }}>{t('h23')}</h3>
            <p>{t('cookie-intro')}</p>
            <ul>{cookieLista.map((item, i) => <li key={i}><strong>{item.split(':')[0]}:</strong>{item.includes(':') ? item.slice(item.indexOf(':') + 1) : ''}</li>)}</ul>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h3')}</h2>
            <p>{t('fin-intro')}</p>
            <ul>{finLista.map((item, i) => <li key={i}>{item}</li>)}</ul>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h4')}</h2>
            <p>{t('base-intro')}</p>
            <ul>{baseLista.map((item, i) => <li key={i}><strong>{item.split(':')[0]}:</strong>{item.includes(':') ? item.slice(item.indexOf(':') + 1) : ''}</li>)}</ul>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h5')}</h2>
            <p>{t('cond-intro')}</p>
            <ul>{condLista.map((item, i) => <li key={i}><strong>{item.split(':')[0]}:</strong>{item.includes(':') ? item.slice(item.indexOf(':') + 1) : ''}</li>)}</ul>
            <p><strong>{t('no-vendita')}</strong></p>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h6')}</h2>
            <ul>{consLista.map((item, i) => <li key={i}><strong>{item.split(':')[0]}:</strong>{item.includes(':') ? item.slice(item.indexOf(':') + 1) : ''}</li>)}</ul>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h7')}</h2>
            <p>{t('dir-intro')}</p>
            <ul>{dirLista.map((item, i) => <li key={i}>{item}</li>)}</ul>
            <p>
              {t('dir-contatto')}{' '}
              <a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a>
            </p>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h8')}</h2>
            <p>{t('sic-intro')}</p>
            <ul>{sicLista.map((item, i) => <li key={i}>{item}</li>)}</ul>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h9')}</h2>
            <p>{t('sens-p1')}</p>
            <p>{t('sens-p2')}</p>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h10')}</h2>
            <p>{t('minori')}</p>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h11')}</h2>
            <p>{t('modifiche')}</p>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h12')}</h2>
            <ul>
              <li><strong>Email</strong>: <a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a></li>
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>{t('h13')}</h2>
            <p>{t('autorita-intro')}</p>
            <ul>{autoritaLista.map((item, i) => <li key={i}>{item}</li>)}</ul>

            <div className="mt-12 p-6 rounded-lg" style={{ background: 'var(--bg-section-light)', borderLeft: '4px solid var(--brand-title)' }}>
              <h3 style={{ color: 'var(--brand-title)' }}>{t('consenso-titolo')}</h3>
              <p>{t('consenso-p1')}</p>
              <p>{t('consenso-p2')}</p>
            </div>

          </div>
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
