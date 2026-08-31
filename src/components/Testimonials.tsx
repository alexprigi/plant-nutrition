'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Card from './ui/Card';
import Icon from './icons/Icon';

const testimonialMeta = [
  { id: 1, key: 't1', name: 'Emma M.',  initial: 'E' },
  { id: 2, key: 't2', name: 'Alex S.',  initial: 'A' },
  { id: 3, key: 't3', name: 'Anna P.',  initial: 'A' },
  { id: 4, key: 't4', name: 'Elena R.', initial: 'E' },
  { id: 5, key: 't5', name: 'Max T.',   initial: 'M' },
  { id: 6, key: 't6', name: 'Clara B.', initial: 'C' },
];

export default function Testimonials() {
  const t = useTranslations('home.testimonianze');
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerPage = 3;

  const nextTestimonials = () => {
    setCurrentIndex((prev) =>
      (prev + testimonialsPerPage) >= testimonialMeta.length ? 0 : prev + testimonialsPerPage
    );
  };

  const prevTestimonials = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, testimonialMeta.length - testimonialsPerPage) : prev - testimonialsPerPage
    );
  };

  const visibleTestimonials = testimonialMeta.slice(currentIndex, currentIndex + testimonialsPerPage);

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-section-light)' }}>
      {/* Decorazione botanica sinistra */}
      <div style={{ 
        position: 'absolute', 
        left: '0', 
        top: '10%',
        width: '150px',
        opacity: 0.15,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <img 
          src="/images/plants/eucalyptus-curved.svg" 
          alt="" 
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {/* Decorazione botanica destra */}
      <div style={{ 
        position: 'absolute', 
        right: '0', 
        bottom: '15%',
        width: '130px',
        opacity: 0.15,
        pointerEvents: 'none',
        zIndex: 0,
        transform: 'scaleX(-1)'
      }}>
        <img 
          src="/images/plants/olive-branch.svg" 
          alt="" 
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Icon name="heart" size={64} animated={true} />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
            {t('titolo')}
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--text-dark-green)' }}>
            {t('sottotitolo')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {visibleTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="transform transition-all duration-300 hover:scale-105"
              style={{ animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both` }}
            >
              <Card
                className="p-8 h-full flex flex-col relative overflow-hidden"
                style={{
                  background: 'white',
                  borderRadius: '1.5rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  border: '2px solid var(--color-main-light)'
                }}
              >
                <div className="absolute top-6 right-6 text-6xl opacity-10" style={{ color: 'var(--color-main)' }}>
                  "
                </div>

                <div className="flex items-center mb-6 relative z-10">
                  <div className="relative w-20 h-20 mr-4 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full flex items-center justify-center text-2xl font-bold"
                      style={{ background: 'linear-gradient(135deg, var(--color-main-light) 0%, var(--color-main) 100%)', color: '#4A5D23' }}>
                      {testimonial.initial}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg" style={{ color: 'var(--brand-title)' }}>
                      {testimonial.name}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-dark-green)' }}>
                      {t(`${testimonial.key}-ruolo` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-2xl">★</span>
                  ))}
                </div>

                <p className="text-base italic leading-relaxed flex-grow" style={{ color: 'var(--text-dark-green)' }}>
                  &ldquo;{t(`${testimonial.key}-testo` as Parameters<typeof t>[0])}&rdquo;
                </p>

                {/* Decorative bottom accent */}
                <div className="mt-6 pt-4 border-t-2" style={{ borderColor: 'var(--color-main-light)' }}>
                  <div className="flex items-center justify-center gap-2" style={{ color: 'var(--color-main)' }}>
                    <span className="text-sm font-semibold">{t('verificata')}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0L9.8 5.5L16 6.5L11.5 10.5L13 16L8 13L3 16L4.5 10.5L0 6.5L6.2 5.5L8 0Z"/>
                    </svg>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Navigation controls - Migliorata */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={prevTestimonials}
            className="p-4 rounded-full transition-all hover:scale-110 shadow-lg"
            style={{ background: 'var(--brand-title)', color: 'white' }}
            aria-label={t('precedenti')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div className="flex gap-3">
            {Array.from({ length: Math.ceil(testimonialMeta.length / testimonialsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * testimonialsPerPage)}
                className="rounded-full transition-all"
                style={{
                  background: currentIndex === index * testimonialsPerPage ? 'var(--brand-title)' : 'var(--color-main-light)',
                  width: currentIndex === index * testimonialsPerPage ? '40px' : '12px',
                  height: '12px'
                }}
                aria-label={t('gruppo', { n: index + 1 })}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonials}
            className="p-4 rounded-full transition-all hover:scale-110 shadow-lg"
            style={{ background: 'var(--brand-title)', color: 'white' }}
            aria-label={t('successive')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* CTA finale - Migliorata */}
        <div className="text-center mt-16 p-6 sm:p-10 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--bg-hero) 0%, #F4E5C2 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)'
          }}
        >
          <div className="relative z-10">
            <p className="text-xl sm:text-2xl font-semibold mb-6 flex items-center justify-center gap-2 px-2" style={{ color: 'var(--brand-title)' }}>
              <span>{t('cta-testo')}</span>
            </p>
            <a
              href="/booking"
              className="inline-flex items-center justify-center px-6 py-4 sm:px-10 sm:py-5 rounded-full font-bold transition-all duration-200 text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
              style={{ background: 'var(--brand-title)', color: 'white' }}
            >
              <span className="text-center leading-tight">
                {t('cta-bottone')}
              </span>
            </a>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20" 
            style={{ background: 'var(--color-main)', transform: 'translate(30%, -30%)' }}
          />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-20" 
            style={{ background: 'var(--brand-title)', transform: 'translate(-30%, 30%)' }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
