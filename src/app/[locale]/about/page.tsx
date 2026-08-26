'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon, { IconName } from '@/components/icons/Icon';
import { useTranslations } from 'next-intl';

export default function ChiSono() {
  const t = useTranslations('chi-sono');
  const [currentSlide, setCurrentSlide] = useState(0);

  const allQualifications: Array<{ icon: IconName; titleKey: string; org: string; year: string; variant: 'mint' | 'blue' | 'peach' | 'pink' | 'lavender' | 'lemon' }> = [
    { icon: 'certificate', titleKey: 'Nutrizionista Certificata', org: 'Ecodemy', year: '2024 - Generale', variant: 'mint' },
    { icon: 'pregnant', titleKey: 'Nutrizione Materno-Infantile', org: 'Ecodemy', year: '2024 - Gravidanza, Allattamento, Svezzamento', variant: 'pink' },
    { icon: 'carrot', titleKey: 'Nutrizione Vegetale', org: 'Accademia della Nutrizione', year: '2025', variant: 'peach' },
    { icon: 'medal', titleKey: 'Vegana da oltre 10 anni', org: 'Esperienza personale e pratica quotidiana', year: 'Scelta etica e di vita', variant: 'lemon' },
    { icon: 'heartMom', titleKey: 'Mamma vegana', org: 'Crescita di un figlio vegano dalla gravidanza', year: 'Esperienza diretta', variant: 'pink' },
    { icon: 'speech', titleKey: 'Laurea in Lingue', org: 'Università di Torino', year: '2017', variant: 'blue' },
    { icon: 'gradCap', titleKey: 'Formazione Continua', org: 'Aggiornamento costante su nutrizione', year: 'Partecipazione a congressi', variant: 'lemon' },
    { icon: 'puzzle', titleKey: 'Educatrice', org: '(Eventuale Ente/Scuola)', year: 'Dal 2020 in Germania', variant: 'lavender' },
  ];

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(allQualifications.length / itemsPerSlide);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const visibleQualifications = allQualifications.slice(currentSlide * itemsPerSlide, (currentSlide + 1) * itemsPerSlide);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-hero)' }}>
        <div className="absolute top-10 right-0 w-80 h-80 rounded-full opacity-12" style={{ background: 'var(--color-main)', transform: 'translate(40%, -20%)' }} />
        <div className="absolute bottom-10 left-0 w-72 h-72 rounded-full opacity-10" style={{ background: 'var(--brand-title)', transform: 'translate(-40%, 20%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4"><Icon name="heart" size={64} variant="mint" animated={true} /></div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>{t('hero.titolo')}</h1>
              <p className="text-xl mb-6" style={{ color: 'var(--brand-title)' }}>{t('hero.sottotitolo')}</p>
              <p className="text-lg mb-8" style={{ color: 'var(--text-darker)' }}>{t('hero.missione')}</p>
              <Button href="/contact" size="lg">{t('hero.prenota')}</Button>
            </div>
            <div className="relative">
              <div className="relative w-80 h-80 mx-auto rounded-full overflow-hidden shadow-2xl" style={{ border: '8px solid var(--color-main)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                <Image src="/images/professional/arianna-portrait.webp" alt="Arianna Ciervo - Nutrizionista Vegana" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 320px" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* La Mia Storia */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-section-light)' }}>
        <div className="absolute top-20 left-0 w-96 h-96 rounded-full opacity-8" style={{ background: 'linear-gradient(135deg, var(--bg-hero) 0%, #F4E5C2 100%)', transform: 'translate(-50%, 0)' }} />
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: 'var(--color-main)', transform: 'translate(50%, 0)' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8"><Icon name="book" size={64} /></div>
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--brand-title)' }}>{t('storia.titolo')}</h2>
          <div className="prose prose-lg max-w-none">
            {[t('storia.p1'), t('storia.p2'), t('storia.p3'), t('storia.p4')].map((p, i) => (
              <p key={i} className="text-lg mb-6" style={{ color: i === 0 ? 'var(--brand-title)' : 'var(--text-darker)' }}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-hero) 100%)' }} />

      {/* Formazione e Qualifiche */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>{t('formazione.titolo')}</h2>

          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: 'var(--brand-title)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--text-dark-green)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brand-title)')}
              aria-label={t('formazione.qualifica-precedente')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: 'var(--brand-title)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--text-dark-green)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brand-title)')}
              aria-label={t('formazione.qualifica-successiva')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleQualifications.map((qual, index) => (
                <Card key={`${currentSlide}-${index}`} className="p-10 text-center transition-all duration-300 border-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 relative"
                  style={{ background: 'var(--bg-card-warm)', color: 'var(--foreground)', borderRadius: '1.5rem', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)', borderTop: '6px solid var(--bg-card-border)', transform: index % 3 === 0 ? 'rotate(-1deg)' : index % 3 === 1 ? 'rotate(0.5deg)' : 'rotate(-0.5deg)', animation: 'fadeIn 0.5s ease-in-out' }}
                >
                  <Icon name={qual.icon} size={48} variant={qual.variant} />
                  <h3 className="text-xl font-semibold mb-4 mt-4" style={{ color: 'var(--brand-title)' }}>{qual.titleKey}</h3>
                  <p className="mb-2" style={{ color: 'var(--text-dark-green)' }}>{qual.org}</p>
                  <p className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{qual.year}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button key={index} onClick={() => setCurrentSlide(index)} className="w-3 h-3 rounded-full transition-all duration-200"
                style={{ background: currentSlide === index ? 'var(--brand-title)' : 'var(--color-main-light)', border: 'none', cursor: 'pointer', transform: currentSlide === index ? 'scale(1.2)' : 'scale(1)' }}
                aria-label={t('formazione.vai-slide', { numero: index + 1 })}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* Approccio */}
      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>{t('approccio.titolo')}</h2>
              <div className="space-y-6">
                {[
                  { icon: 'dna', titolo: t('approccio.scienza-titolo'), testo: t('approccio.scienza-testo') },
                  { icon: 'userSingle', titolo: t('approccio.personalizzato-titolo'), testo: t('approccio.personalizzato-testo') },
                  { icon: 'heart', titolo: t('approccio.empatico-titolo'), testo: t('approccio.empatico-testo') },
                  { icon: 'leaf', titolo: t('approccio.sostenibile-titolo'), testo: t('approccio.sostenibile-testo') },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <Icon name={item.icon as any} size={32} />
                    <div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>{item.titolo}</h3>
                      <p style={{ color: 'var(--text-darker)' }}>{item.testo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 rounded-lg" style={{ background: 'var(--bg-section-warm)' }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>{t('approccio.missione-titolo')}</h3>
              <blockquote className="text-lg italic mb-6" style={{ color: 'var(--brand-title)' }}>{t('approccio.missione-testo')}</blockquote>
              <p className="font-semibold" style={{ color: 'var(--brand-title)' }}>- Arianna</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: 'var(--brand-title)', color: 'var(--foreground)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center rounded-3xl shadow-2xl bg-white/20 backdrop-blur-md py-16 border-2 border-white/20" style={{ boxShadow: '0 8px 40px 0 rgba(37, 105, 67, 0.25)' }}>
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight" style={{ color: 'white', textShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>{t('cta.titolo')}</h2>
          <p className="text-2xl mb-10 font-medium" style={{ color: 'white', textShadow: '0 1px 8px rgba(0,0,0,0.15)' }}>{t('cta.testo')}</p>
          <Button href="/contact" variant="outline" size="lg" className="!bg-white !text-[var(--brand-title)] !border-white hover:!bg-white/90">{t('cta.bottone')}</Button>
        </div>
      </section>
    </div>
  );
}
