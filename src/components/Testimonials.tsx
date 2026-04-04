'use client';

import { useState } from 'react';
import Image from 'next/image';
import Card from './ui/Card';
import Icon from './icons/Icon';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Giulia M.",
    role: "Mamma in attesa",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E6EFCC'/%3E%3Ctext x='50' y='50' font-size='40' font-weight='bold' text-anchor='middle' dy='.35em' fill='%234A5D23'%3EG%3C/text%3E%3C/svg%3E",
    text: "Arianna mi ha seguita durante tutta la gravidanza con una dieta vegana bilanciata. Grazie ai suoi consigli, io e il mio bambino siamo in perfetta salute. Professionalità e umanità straordinarie!",
    rating: 5
  },
  {
    id: 2,
    name: "Marco S.",
    role: "Transizione vegana",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E6EFCC'/%3E%3Ctext x='50' y='50' font-size='40' font-weight='bold' text-anchor='middle' dy='.35em' fill='%234A5D23'%3EM%3C/text%3E%3C/svg%3E",
    text: "Dopo anni di alimentazione onnivora, volevo passare al veganesimo ma avevo mille dubbi. Arianna mi ha accompagnato passo dopo passo con un piano personalizzato. Ora mi sento più energico e in forma che mai!",
    rating: 5
  },
  {
    id: 3,
    name: "Laura P.",
    role: "Mamma di due bambini",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E6EFCC'/%3E%3Ctext x='50' y='50' font-size='40' font-weight='bold' text-anchor='middle' dy='.35em' fill='%234A5D23'%3EL%3C/text%3E%3C/svg%3E",
    text: "Ho seguito il percorso completo di 3 mesi per tutta la famiglia. I miei bambini ora mangiano di tutto e sono più sereni a tavola. Il supporto WhatsApp è stato fondamentale nei momenti di dubbio!",
    rating: 5
  },
  {
    id: 4,
    name: "Sofia R.",
    role: "Gravidanza vegana",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E6EFCC'/%3E%3Ctext x='50' y='50' font-size='40' font-weight='bold' text-anchor='middle' dy='.35em' fill='%234A5D23'%3ES%3C/text%3E%3C/svg%3E",
    text: "Incinta del mio secondo figlio, cercavo una nutrizionista che capisse le mie esigenze vegane. Arianna è stata perfetta: competente, disponibile e sempre pronta a rispondere ai miei dubbi. Consigliatissima!",
    rating: 5
  },
  {
    id: 5,
    name: "Alessandro T.",
    role: "Sportivo vegano",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E6EFCC'/%3E%3Ctext x='50' y='50' font-size='40' font-weight='bold' text-anchor='middle' dy='.35em' fill='%234A5D23'%3EA%3C/text%3E%3C/svg%3E",
    text: "Pratico CrossFit e temevo che una dieta vegana non mi desse abbastanza energia. Arianna mi ha dimostrato il contrario con un piano alimentare ottimizzato. Le mie performance sono migliorate!",
    rating: 5
  },
  {
    id: 6,
    name: "Francesca B.",
    role: "Neomamma vegana",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E6EFCC'/%3E%3Ctext x='50' y='50' font-size='40' font-weight='bold' text-anchor='middle' dy='.35em' fill='%234A5D23'%3EF%3C/text%3E%3C/svg%3E",
    text: "Ho conosciuto Arianna durante la gravidanza e continuo a seguirla per l'allattamento. La sua preparazione e il suo approccio empatico mi hanno dato sicurezza in un periodo delicato. Grazie di cuore!",
    rating: 5
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerPage = 3;

  const nextTestimonials = () => {
    setCurrentIndex((prev) => 
      (prev + testimonialsPerPage) >= testimonials.length ? 0 : prev + testimonialsPerPage
    );
  };

  const prevTestimonials = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, testimonials.length - testimonialsPerPage) : prev - testimonialsPerPage
    );
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + testimonialsPerPage);

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
            Storie di Successo
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--text-dark-green)' }}>
            Scopri come altre mamme, famiglie e persone hanno trasformato la loro vita con la nutrizione vegetale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {visibleTestimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="transform transition-all duration-300 hover:scale-105"
              style={{
                animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`
              }}
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
                {/* Quote decoration */}
                <div className="absolute top-6 right-6 text-6xl opacity-10" style={{ color: 'var(--color-main)' }}>
                  "
                </div>

                <div className="flex items-center mb-6 relative z-10">
                  <div className="relative w-20 h-20 mr-4 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full" style={{ 
                      background: 'linear-gradient(135deg, var(--color-main-light) 0%, var(--color-main) 100%)',
                      padding: '3px'
                    }}>
                      <div className="relative w-full h-full rounded-full overflow-hidden" style={{ background: 'white' }}>
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          loading="lazy"
                          quality={75}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg" style={{ color: 'var(--brand-title)' }}>
                      {testimonial.name}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-dark-green)' }}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-2xl">★</span>
                  ))}
                </div>

                <p className="text-base italic leading-relaxed flex-grow" style={{ color: 'var(--text-dark-green)' }}>
                  "{testimonial.text}"
                </p>

                {/* Decorative bottom accent */}
                <div className="mt-6 pt-4 border-t-2" style={{ borderColor: 'var(--color-main-light)' }}>
                  <div className="flex items-center justify-center gap-2" style={{ color: 'var(--color-main)' }}>
                    <span className="text-sm font-semibold">Cliente Verificata</span>
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
            aria-label="Testimonianze precedenti"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div className="flex gap-3">
            {Array.from({ length: Math.ceil(testimonials.length / testimonialsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * testimonialsPerPage)}
                className="rounded-full transition-all"
                style={{
                  background: currentIndex === index * testimonialsPerPage ? 'var(--brand-title)' : 'var(--color-main-light)',
                  width: currentIndex === index * testimonialsPerPage ? '40px' : '12px',
                  height: '12px'
                }}
                aria-label={`Vai al gruppo ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonials}
            className="p-4 rounded-full transition-all hover:scale-110 shadow-lg"
            style={{ background: 'var(--brand-title)', color: 'white' }}
            aria-label="Testimonianze successive"
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
              <span>Vuoi essere anche tu una storia di successo?</span>
              {/* <Icon name="sparkles" size={28} animated={true} /> */}
            </p>
            <a
              href="/prenota"
              className="inline-flex items-center justify-center px-6 py-4 sm:px-10 sm:py-5 rounded-full font-bold transition-all duration-200 text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
              style={{ background: 'var(--brand-title)', color: 'white' }}
            >
              <span className="text-center leading-tight">
                Prenota la Tua<br className="sm:hidden" /> Consulenza Gratuita →
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
