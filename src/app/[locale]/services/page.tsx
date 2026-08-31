import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/icons/Icon';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'servizi' });
  return {
    title: t('meta-titolo'),
    description: t('meta-descrizione'),
  };
}

export default async function Servizi({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'servizi' });
  return (
    <div className="min-h-screen relative">
      {/* Floating button - solo mobile/tablet/iPad, lato sinistro */}
      <a
        href="#prezzi"
        className="xl:hidden fixed bottom-6 left-6 z-50 px-6 py-4 rounded-full font-bold shadow-2xl transition-all duration-200 hover:scale-110 animate-bounce-slow flex items-center gap-2"
        style={{
          background: 'var(--brand-title)',
          color: 'white'
        }}
      >
        <Icon name="tag" size={20} />
        <span className="hidden sm:inline">{t('prezzi.vai-tariffe-desktop')}</span>
        <span className="sm:hidden">{t('prezzi.vai-tariffe-mobile')}</span>
      </a>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-hero)' }}>
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'var(--color-main)', transform: 'translate(30%, -30%)' }}
        />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'var(--brand-title)', transform: 'translate(-30%, 30%)' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-4">
            <Icon name="star" size={64} animated={true} variant='lemon' />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>
            {t('hero.titolo')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--brand-title)' }}>
            {t('hero.sottotitolo')}
          </p>
        </div>
      </section>

      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* Come Funziona */}
      <section className="pt-16 pb-20 relative overflow-hidden" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Icon name="route" size={64} animated={true} variant="mint" />
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>{t('come-funziona.titolo')}</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
              {t('come-funziona.sottotitolo')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 relative">
            <div className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-section-warm)' }}>
                  <Icon name="numberOne" size={52} shape='circle' />
                </div>
                <svg className="hidden lg:block absolute left-full top-1/2 w-[200%] xl:w-[240%] 2xl:w-[260%] h-16 pointer-events-none" viewBox="0 0 160 40" style={{ transform: 'translate(8%, -50%)' }}>
                  <defs>
                    <marker id="arrow1" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                      <polygon points="0 0, 8 4, 0 8" fill="#6B8E7F" opacity="0.5" />
                    </marker>
                  </defs>
                  <path d="M 5 20 Q 45 5, 85 20 Q 125 35, 155 20" stroke="#6B8E7F" strokeWidth="2" fill="none" opacity="0.5" markerEnd="url(#arrow1)" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>{t('come-funziona.step1-titolo')}</h3>
              <p style={{ color: 'var(--text-darker)' }}>{t('come-funziona.step1-testo')}</p>
            </div>
            <div className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-section-warm)' }}>
                  <Icon name="numberTwo" size={52} shape='circle' />
                </div>
                <svg className="hidden lg:block absolute left-full top-1/2 w-[200%] xl:w-[240%] 2xl:w-[260%] h-16 pointer-events-none" viewBox="0 0 160 40" style={{ transform: 'translate(8%, -50%)' }}>
                  <defs>
                    <marker id="arrow2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                      <polygon points="0 0, 8 4, 0 8" fill="#6B8E7F" opacity="0.5" />
                    </marker>
                  </defs>
                  <path d="M 5 20 Q 45 35, 85 20 Q 125 5, 155 20" stroke="#6B8E7F" strokeWidth="2" fill="none" opacity="0.5" markerEnd="url(#arrow2)" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>{t('come-funziona.step2-titolo')}</h3>
              <p style={{ color: 'var(--text-darker)' }}>{t('come-funziona.step2-testo')}</p>
            </div>
            <div className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-section-warm)' }}>
                  <Icon name="numberThree" size={52} shape='circle' />
                </div>
                <svg className="hidden lg:block absolute left-full top-1/2 w-[200%] xl:w-[240%] 2xl:w-[260%] h-16 pointer-events-none" viewBox="0 0 160 40" style={{ transform: 'translate(8%, -50%)' }}>
                  <defs>
                    <marker id="arrow3" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                      <polygon points="0 0, 8 4, 0 8" fill="#6B8E7F" opacity="0.5" />
                    </marker>
                  </defs>
                  <path d="M 5 20 Q 45 5, 85 20 Q 125 35, 155 20" stroke="#6B8E7F" strokeWidth="2" fill="none" opacity="0.5" markerEnd="url(#arrow3)" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>{t('come-funziona.step3-titolo')}</h3>
              <p style={{ color: 'var(--text-darker)' }}>{t('come-funziona.step3-testo')}</p>
            </div>
            <div className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-section-warm)' }}>
                  <Icon name="numberFour" size={52} shape='circle' />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>{t('come-funziona.step4-titolo')}</h3>
              <p style={{ color: 'var(--text-darker)' }}>{t('come-funziona.step4-testo')}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-section-warm) 100%)' }} />

      {/* Specializzazione Principale */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <Icon name="heartMom" size={64} animated={true} variant="pink" />
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>{t('specializzazione.titolo')}</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
              {t('specializzazione.sottotitolo')}
            </p>
          </div>

          <div className="max-w-6xl mx-auto relative pt-6">
            <div className="absolute -top-0 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg z-10 flex items-center gap-2" style={{ background: 'var(--brand-title)' }}>
              <span>{t('specializzazione.badge')}</span>
            </div>

            <Card className="overflow-hidden relative" style={{
              background: 'white',
              borderRadius: '2rem',
              border: '3px solid var(--brand-title)',
              boxShadow: '0 20px 60px rgba(37, 105, 67, 0.15)'
            }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-[400px] lg:h-auto">
                  <Image
                    src="/images/professional/arianna-pregnant.webp"
                    alt={t('specializzazione.immagine-alt')}
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'center 30%' }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6" style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
                  }}>
                    <p className="text-white text-base font-medium italic">
                      {t('specializzazione.citazione')}
                    </p>
                  </div>
                </div>

                <div className="p-8 lg:p-12">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
                    {t('specializzazione.card-titolo')}
                  </h3>
                  <p className="text-base mb-4" style={{ color: 'var(--text-dark-green)', lineHeight: '1.7' }}>
                    {t('specializzazione.p1')}
                  </p>
                  <p className="text-base mb-6" style={{ color: 'var(--text-dark-green)', lineHeight: '1.7' }}>
                    {t('specializzazione.p2')}
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5"><Icon name="molecule" size={20} /></div>
                      <div>
                        <h4 className="font-bold text-sm mb-0.5" style={{ color: 'var(--brand-title)' }}>{t('specializzazione.nutrienti-titolo')}</h4>
                        <p className="text-xs" style={{ color: 'var(--text-dark-green)' }}>{t('specializzazione.nutrienti-testo')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5"><Icon name="drop" size={20} /></div>
                      <div>
                        <h4 className="font-bold text-sm mb-0.5" style={{ color: 'var(--brand-title)' }}>{t('specializzazione.diabete-titolo')}</h4>
                        <p className="text-xs" style={{ color: 'var(--text-dark-green)' }}>{t('specializzazione.diabete-testo')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5"><Icon name="baby" size={20} /></div>
                      <div>
                        <h4 className="font-bold text-sm mb-0.5" style={{ color: 'var(--brand-title)' }}>{t('specializzazione.allattamento-titolo')}</h4>
                        <p className="text-xs" style={{ color: 'var(--text-dark-green)' }}>{t('specializzazione.allattamento-testo')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5"><Icon name="lightning" size={20} /></div>
                      <div>
                        <h4 className="font-bold text-sm mb-0.5" style={{ color: 'var(--brand-title)' }}>{t('specializzazione.postparto-titolo')}</h4>
                        <p className="text-xs" style={{ color: 'var(--text-dark-green)' }}>{t('specializzazione.postparto-testo')}</p>
                      </div>
                    </div>
                  </div>
                  <Button href="/booking" size="lg" className="w-full lg:w-auto">
                    {t('specializzazione.prenota')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-section-warm) 0%, var(--bg-section-warm) 100%)' }} />

      {/* Altre Specializzazioni */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>{t('altre-spec.titolo')}</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
              {t('altre-spec.sottotitolo')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #F2E4C1 100%)' }}>
                <Icon name="carrot" size={40} variant="peach" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>{t('altre-spec.svezzamento-titolo')}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>{t('altre-spec.svezzamento-testo')}</p>
            </Card>

            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #E0F5EE 0%, #D4F1E8 100%)' }}>
                <Icon name="activity" size={40} variant="lavender" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>{t('altre-spec.patologie-titolo')}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>{t('altre-spec.patologie-testo')}</p>
            </Card>

            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #e8f0d8 0%, #f5f9ec 100%)' }}>
                <Icon name="users" size={40} variant="blue" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>{t('altre-spec.famiglia-titolo')}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>{t('altre-spec.famiglia-testo')}</p>
            </Card>

            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #E8F0E8 0%, #F0F5F0 100%)' }}>
                <Icon name="leaf" size={40} variant="mint" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>{t('altre-spec.transizione-titolo')}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>{t('altre-spec.transizione-testo')}</p>
            </Card>

            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #F9F0F5 0%, #F5E6F0 100%)' }}>
                <Icon name="lotus" size={40} variant="pink" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>{t('altre-spec.menopausa-titolo')}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>{t('altre-spec.menopausa-testo')}</p>
            </Card>

            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #E8E0F5 0%, #F0E8F8 100%)' }}>
                <Icon name="lightning" size={40} variant="lemon" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>{t('altre-spec.sport-titolo')}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>{t('altre-spec.sport-testo')}</p>
            </Card>
          </div>
        </div>
      </section>

      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-section-warm) 0%, var(--bg-section-light) 100%)' }} />

      {/* Prezzi */}
      <section id="prezzi" className="pt-12 pb-20 relative overflow-hidden" style={{ background: 'var(--bg-section-light)' }}>
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full opacity-8"
          style={{ background: 'linear-gradient(135deg, var(--color-main-light) 0%, var(--color-main) 100%)', transform: 'translate(40%, 0)' }}
        />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full opacity-8"
          style={{ background: 'linear-gradient(135deg, var(--bg-hero) 0%, #F4E5C2 100%)', transform: 'translate(-40%, 0)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <Icon name="tag" size={64} animated={true} variant='pink' />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>{t('prezzi.titolo')}</h2>
            <p className="text-lg max-w-3xl mx-auto mb-8" style={{ color: 'var(--brand-title)' }}>
              {t('prezzi.sottotitolo')} <br />
              {t('prezzi.sottotitolo-2')}
            </p>
          </div>

          {/* Colloquio Gratuito */}
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="relative rounded-2xl p-8 text-center shadow-xl transform hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #F2E4C1 100%)', border: '3px solid var(--brand-title)' }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg animate-pulse flex items-center gap-2" style={{ background: 'var(--brand-title)' }}>
                <Icon name="gift" size={16} />
                <span>{t('prezzi.colloquio-badge')}</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-3 mt-2" style={{ color: 'var(--brand-title)' }}>
                {t('prezzi.colloquio-titolo')}
              </h3>
              <p className="text-lg mb-6" style={{ color: 'var(--text-dark-green)' }}>
                {t('prezzi.colloquio-testo')}
              </p>
              <Button
                href="/booking"
                size="lg"
                className="font-bold text-lg shadow-lg"
                style={{ background: 'var(--brand-title)', color: 'white' }}
              >
                {t('prezzi.colloquio-bottone')}
              </Button>
            </div>
          </div>

          {/* Consulenze Singole */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>{t('prezzi.singole-titolo')}</h3>
            <p className="text-base" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.singole-sottotitolo')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
            {/* Visita di Controllo */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f5 50%, #f0f0e8 100%)', borderRadius: '1.5rem', border: '2px solid var(--brand-title)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'visible' }}>
              <div className="p-6 text-center border-b-4 pt-8 flex flex-col justify-between" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #f8f8f5 0%, #f0f0e8 50%, white 100%)', borderRadius: '1.5rem 1.5rem 0 0', height: '230px' }}>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>{t('prezzi.controllo-titolo')}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.controllo-sottotitolo')}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-1" style={{ minHeight: '72px' }}>
                  <div style={{ height: '28px' }}></div>
                  <div className="text-5xl font-extrabold" style={{ color: 'var(--brand-title)' }}>50€</div>
                  <p className="text-sm font-semibold" style={{ color: '#256943' }}>{t('prezzi.controllo-durata')}</p>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <ul className="space-y-4 mb-6 text-left flex-grow">
                  <li className="flex items-start gap-3">
                    <Icon name="video" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.controllo-videocall')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="checkCircle" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.controllo-analisi')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="refreshCcw" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.controllo-aggiornamento')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="info" size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#EAB308' }} />
                    <span className="text-xs font-bold" style={{ color: '#854D0E' }}>{t('prezzi.controllo-nota')}</span>
                  </li>
                </ul>
                <Button
                  href="/booking?type=controllo"
                  className="w-full mt-auto"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  {t('prezzi.controllo-bottone')}
                </Button>
              </div>
            </Card>

            {/* Prima Visita */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col" style={{ background: 'linear-gradient(135deg, #D4F1E8 0%, #E0F5EE 50%, #EDF9F5 100%)', borderRadius: '1.5rem', border: '3px solid var(--brand-title)', boxShadow: '0 8px 30px rgba(37, 105, 67, 0.15)', overflow: 'visible' }}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1" style={{ background: 'var(--brand-title)', zIndex: 10 }}>
                <Icon name="star" size={12} style={{ color: 'white' }} />
                <span>{t('prezzi.prima-visita-badge')}</span>
              </div>
              <div className="p-6 text-center border-b-4 pt-8 flex flex-col justify-between" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #d8e8c4 0%, #e8f0d8 50%, white 100%)', borderRadius: '1.5rem 1.5rem 0 0', height: '230px' }}>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>{t('prezzi.prima-visita-titolo')}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.prima-visita-sottotitolo')}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-1" style={{ minHeight: '72px' }}>
                  <div style={{ height: '28px' }}></div>
                  <div className="text-5xl font-extrabold" style={{ color: 'var(--brand-title)' }}>85€</div>
                  <p className="text-sm font-semibold" style={{ color: '#256943' }}>{t('prezzi.prima-visita-durata')}</p>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <ul className="space-y-4 mb-6 text-left flex-grow">
                  <li className="flex items-start gap-3">
                    <Icon name="video" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.prima-visita-anamnesi')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="apple" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.prima-visita-piano')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="pill" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.prima-visita-integratori')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="fileText" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.prima-visita-ricettario')}</span>
                  </li>
                </ul>
                <Button
                  href="/booking?type=first"
                  className="w-full mt-auto"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  {t('prezzi.prima-visita-bottone')}
                </Button>
              </div>
            </Card>
          </div>

          {/* Percorsi Continuativi */}
          <div className="text-center mb-8 mt-20">
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>{t('prezzi.continuativi-titolo')}</h3>
            <p className="text-base mb-6" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.continuativi-sottotitolo')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-5xl mx-auto">
            {/* 3 Mesi */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col" style={{ background: 'linear-gradient(135deg, #D4E8F1 0%, #E0EEF5 50%, #EDF5F9 100%)', borderRadius: '1.5rem', border: '2px solid var(--color-main)', boxShadow: '0 4px 20px rgba(37, 105, 67, 0.1)' }}>
              <div className="p-6 text-center border-b-4 pt-8 flex flex-col justify-between" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #D4E8F1 0%, #E0EEF5 50%, white 100%)', borderRadius: '1.5rem 1.5rem 0 0', height: '230px' }}>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>{t('prezzi.tre-mesi-titolo')}</h3>
                  <p className="text-sm mb-1 font-medium" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.tre-mesi-sottotitolo')}</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(255, 182, 193, 0.2)', color: '#256943' }}>{t('prezzi.tag-gravidanza')}</span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(157, 207, 205, 0.2)', color: '#256943' }}>{t('prezzi.tag-sport')}</span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(232, 240, 216, 0.4)', color: '#256943' }}>{t('prezzi.tag-lifestyle')}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-1" style={{ minHeight: '72px' }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-xl line-through opacity-60" style={{ color: 'var(--text-dark-green)' }}>255€</span>
                    <span className="text-5xl font-extrabold" style={{ color: 'var(--brand-title)' }}>237€</span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#256943' }}>{t('prezzi.tre-mesi-durata')}</p>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <ul className="space-y-4 mb-6 text-left flex-grow">
                  <li className="flex items-start gap-3">
                    <Icon name="video" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.tre-mesi-consulenze')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="clipboard" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.tre-mesi-diario')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="checkCircle" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.tre-mesi-kit')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="mail" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.tre-mesi-email')}</span>
                  </li>
                </ul>
                <Button
                  href="/booking?type=3mesi"
                  className="w-full mt-auto"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  {t('prezzi.tre-mesi-bottone')}
                </Button>
              </div>
            </Card>

            {/* 6 Mesi */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col" style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #FBF3E3 50%, #FDF8F0 100%)', borderRadius: '1.5rem', border: '2px solid var(--color-main)', boxShadow: '0 4px 20px rgba(37, 105, 67, 0.1)', overflow: 'visible' }}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap flex items-center gap-1" style={{ background: 'var(--brand-title)', zIndex: 10 }}>
                <Icon name="sparkles" size={12} style={{ color: 'white' }} />
                <span>{t('prezzi.sei-mesi-badge')}</span>
              </div>
              <div className="p-6 text-center border-b-4 pt-8 flex flex-col justify-between" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #F9EED5 0%, #FBF3E3 50%, white 100%)', borderRadius: '1.5rem 1.5rem 0 0', height: '230px' }}>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>{t('prezzi.sei-mesi-titolo')}</h3>
                  <p className="text-sm mb-1 font-medium" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.sei-mesi-sottotitolo')}</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(255, 182, 193, 0.2)', color: '#256943' }}>{t('prezzi.tag-gravidanza')}</span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(157, 207, 205, 0.2)', color: '#256943' }}>{t('prezzi.tag-sport')}</span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(232, 240, 216, 0.4)', color: '#256943' }}>{t('prezzi.tag-tutti')}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-1" style={{ minHeight: '72px' }}>
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <span className="text-xl line-through opacity-70 font-semibold" style={{ color: 'var(--text-dark-green)' }}>510€</span>
                    <span className="text-5xl font-extrabold" style={{ color: 'var(--brand-title)' }}>450€</span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#256943' }}>{t('prezzi.sei-mesi-durata')}</p>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <ul className="space-y-4 mb-6 text-left flex-grow">
                  <li className="flex items-start gap-3">
                    <Icon name="video" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.sei-mesi-consulenze')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="messageCircle" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.sei-mesi-whatsapp')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="bookOpen" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.sei-mesi-libreria')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="gift" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.sei-mesi-etichette')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="activity" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.sei-mesi-esami')}</span>
                  </li>
                </ul>
                <div className="mb-4 p-3 rounded-lg text-xs" style={{ background: 'rgba(255, 182, 193, 0.15)', border: '1px solid rgba(255, 182, 193, 0.3)' }}>
                  <p className="font-bold mb-1" style={{ color: 'var(--brand-title)' }}>{t('prezzi.sei-mesi-addon-titolo')}</p>
                  <p style={{ color: 'var(--text-dark-green)' }}>{t('prezzi.sei-mesi-addon-testo')}</p>
                </div>
                <Button
                  href="/booking?type=6mesi"
                  className="w-full mt-auto"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  {t('prezzi.sei-mesi-bottone')}
                </Button>
              </div>
            </Card>
          </div>

          {/* Guida Svezzamento */}
          <div className="max-w-4xl mx-auto mt-20 mb-8">
            <div className="relative rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg overflow-hidden"
              style={{ background: 'white', border: '2px solid #F2E4C1' }}>
              <div className="absolute top-4 right-4 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                {t('prezzi.guida-badge')}
              </div>
              <div className="flex-shrink-0 w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #F2E4C1 100%)' }}>
                <Icon name="bookOpen" size={40} variant="peach" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>
                  {t('prezzi.guida-titolo')}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-dark-green)' }}>
                  {t('prezzi.guida-testo')}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <span className="text-2xl font-bold" style={{ color: 'var(--brand-title)' }}>120€</span>
                  <Button
                    href="/booking?type=guida-svezzamento"
                    size="sm"
                    style={{ background: 'var(--brand-title)', color: 'white' }}
                  >
                    {t('prezzi.guida-bottone')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Nota finale */}
          <div className="text-center max-w-3xl mx-auto p-6 rounded-lg mb-12" style={{ background: 'rgba(255,255,255,0.7)' }}>
            <p className="text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-dark-green)' }}>
              <Icon name="heart" size={20} />
              <span>{t('prezzi.nota-finale')}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-section-warm) 100%)' }} />

      {/* FAQ */}
      <section className="py-20" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>{t('faq.titolo')}</h2>
            <p className="text-xl" style={{ color: 'var(--brand-title)' }}>{t('faq.sottotitolo')}</p>
          </div>
          <div className="space-y-6">
            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>{t('faq.d1-domanda')}</h3>
              <p style={{ color: 'var(--brand-title)' }}>{t('faq.d1-risposta')}</p>
            </div>
            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>{t('faq.d2-domanda')}</h3>
              <p style={{ color: 'var(--brand-title)' }}>{t('faq.d2-risposta')}</p>
            </div>
            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>{t('faq.d3-domanda')}</h3>
              <p style={{ color: 'var(--brand-title)' }}>{t('faq.d3-risposta')}</p>
            </div>
            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>{t('faq.d4-domanda')}</h3>
              <p style={{ color: 'var(--brand-title)' }}>{t('faq.d4-risposta')}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-section-warm) 0%, var(--bg-hero) 100%)' }} />

      {/* CTA */}
      <section className="py-24" style={{ background: 'var(--brand-title)', color: 'var(--foreground)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center rounded-3xl shadow-2xl bg-white/20 backdrop-blur-md py-16 border-2 border-white/20" style={{ boxShadow: '0 8px 40px 0 rgba(37, 105, 67, 0.25)' }}>
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight" style={{ color: 'white', textShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
            {t('cta.titolo')}
          </h2>
          <p className="text-2xl mb-10 font-medium" style={{ color: 'white', textShadow: '0 1px 8px rgba(0,0,0,0.15)' }}>
            {t('cta.testo')}
          </p>
          <Button
            href="/contact"
            variant="outline"
            size="lg"
            className="!bg-white !text-[var(--brand-title)] !border-white hover:!bg-white/90"
          >
            {t('cta.bottone')}
          </Button>
        </div>
      </section>
    </div>
  );
}
