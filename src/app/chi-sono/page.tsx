'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon, { IconName } from '@/components/icons/Icon';

export default function ChiSono() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const allQualifications: Array<{ icon: IconName; title: string; org: string; year: string; variant: 'mint' | 'blue' | 'peach' | 'pink' | 'lavender' | 'lemon' }> = [
    { icon: 'certificate', title: 'Nutrizionista Certificata', org: 'Ecodemy', year: '2024 - Generale', variant: 'mint' },
    { icon: 'pregnant', title: 'Nutrizione Materno-Infantile', org: 'Ecodemy', year: '2024 - Gravidanza, Allattamento, Svezzamento', variant: 'pink' },
    { icon: 'carrot', title: 'Nutrizione Vegetale', org: 'Accademia della Nutrizione', year: '2025', variant: 'peach' },
    { icon: 'medal', title: 'Vegana da oltre 10 anni', org: 'Esperienza personale e pratica quotidiana', year: 'Scelta etica e di vita', variant: 'lemon' },
    { icon: 'heartMom', title: 'Mamma vegana', org: 'Crescita di un figlio vegano dalla gravidanza', year: 'Esperienza diretta', variant: 'pink' },
    { icon: 'speech', title: 'Laurea in Lingue', org: 'Università di Torino', year: '2017', variant: 'blue' },
    { icon: 'gradCap', title: 'Formazione Continua', org: 'Aggiornamento costante su nutrizione', year: 'Partecipazione a congressi', variant: 'lemon' },
    { icon: 'puzzle', title: 'Educatrice', org: '(Eventuale Ente/Scuola)', year: 'Dal 2020 in Germania', variant: 'lavender' },
  ];

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(allQualifications.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleQualifications = allQualifications.slice(
    currentSlide * itemsPerSlide,
    (currentSlide + 1) * itemsPerSlide
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-hero)' }}>
        {/* Decorative circles */}
        <div className="absolute top-10 right-0 w-80 h-80 rounded-full opacity-12" 
          style={{ background: 'var(--color-main)', transform: 'translate(40%, -20%)' }}
        />
        <div className="absolute bottom-10 left-0 w-72 h-72 rounded-full opacity-10" 
          style={{ background: 'var(--brand-title)', transform: 'translate(-40%, 20%)' }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4">
                <Icon name="heart" size={64} variant="mint" animated={true} />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>
                Ciao, sono Arianna
              </h1>
              <p className="text-xl mb-6" style={{ color: 'var(--brand-title)' }}>
                Benvenuta/o nel mondo di Viva Plant Nutrition! Sono Arianna, e sono entusiasta di accompagnarti nel tuo percorso verso una nutrizione vegana consapevole, sana e gioiosa.
              </p>
              <p className="text-lg mb-8" style={{ color: 'var(--text-darker)' }}>
                La mia missione è dimostrare che l'alimentazione vegetale non è solo
                una scelta etica, ma anche la via per il benessere ottimale.
              </p>
              <Button href="/contatti" size="lg">
                Prenota una Consulenza
              </Button>
            </div>
            <div className="relative">
              <div className="relative w-80 h-80 mx-auto rounded-full overflow-hidden shadow-2xl" 
                style={{ 
                  border: '8px solid var(--color-main)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                }}
              >
                <Image
                  src="/images/professional/arianna-portrait.png"
                  alt="Arianna Ciervo - Nutrizionista Vegana"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* La Mia Storia */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-section-light)' }}>
        {/* Decorative circles */}
        <div className="absolute top-20 left-0 w-96 h-96 rounded-full opacity-8" 
          style={{ background: 'linear-gradient(135deg, var(--bg-hero) 0%, #F4E5C2 100%)', transform: 'translate(-50%, 0)' }}
        />
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full opacity-10" 
          style={{ background: 'var(--color-main)', transform: 'translate(50%, 0)' }}
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <Icon name="book" size={64} />
          </div>
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--brand-title)' }}>La Mia Storia</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6" style={{ color: 'var(--brand-title)' }}>
              Ciao! Sono Arianna, la mente e il cuore dietro Viva Plant Nutrition.
            </p>
            <p className="text-lg mb-6" style={{ color: 'var(--text-darker)' }}>
              La mia storia è un viaggio profondo, nato da una scelta etica che ha plasmato ogni passo. Vegana da oltre dieci anni, ho abbracciato questo stile di vita per amore e rispetto verso gli animali. Ricordo bene le difficoltà iniziali, la mancanza di informazioni e di una rete di supporto adeguata. Proprio da quelle sfide è nata la mia determinazione: volevo aiutare gli altri a navigare questo percorso con maggiore facilità e consapevolezza.
            </p>
            <p className="text-lg mb-6" style={{ color: 'var(--text-darker)' }}>
              Dopo una laurea in Lingue a Torino nel 2017 e una formazione professionale come educatrice in Germania dal 2020, ho deciso di unire le mie passioni. Ho trasformato il mio impegno per il mondo vegetale in una professione, diventando Nutrizionista. La mia esperienza come mamma di un figlio meraviglioso, cresciuto vegano fin dalla gravidanza, mi ha fornito una prospettiva unica e una profonda empatia per le sfide e le gioie che le donne affrontano in ogni fase della loro vita.
            </p>
            <p className="text-lg mb-6" style={{ color: 'var(--text-darker)' }}>
              Il mio obiettivo è guidarti verso un'alimentazione vegana che ti faccia sentire al meglio, sostenibile, deliziosa e in linea con i tuoi valori.
            </p>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-hero) 100%)' }} />

      {/* Formazione e Qualifiche */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>Formazione e Qualifiche</h2>
          
          <div className="relative">
            {/* Freccia sinistra */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ 
                background: 'var(--brand-title)', 
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--text-dark-green)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brand-title)')}
              aria-label="Qualifica precedente"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {/* Freccia destra */}
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ 
                background: 'var(--brand-title)', 
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--text-dark-green)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brand-title)')}
              aria-label="Qualifica successiva"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleQualifications.map((qual, index) => (
                <Card
                  key={`${currentSlide}-${index}`}
                  className="p-10 text-center transition-all duration-300 border-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 relative"
                  style={{
                    background: 'var(--bg-card-warm)',
                    color: 'var(--foreground)',
                    borderRadius: '1.5rem',
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12), 0 -8px 24px -8px var(--bg-card-warm)',
                    borderTop: '6px solid var(--bg-card-border)',
                    transform: index % 3 === 0 ? 'rotate(-1deg)' : index % 3 === 1 ? 'rotate(0.5deg)' : 'rotate(-0.5deg)',
                    animation: 'fadeIn 0.5s ease-in-out'
                  }}
                >
                  <Icon name={qual.icon} size={48} variant={qual.variant} />
                  <h3 className="text-xl font-semibold mb-4 mt-4" style={{ color: 'var(--brand-title)' }}>{qual.title}</h3>
                  <p className="mb-2" style={{ color: 'var(--text-dark-green)' }}>{qual.org}</p>
                  <p className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{qual.year}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Indicatori (dots) */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="w-3 h-3 rounded-full transition-all duration-200"
                style={{
                  background: currentSlide === index ? 'var(--brand-title)' : 'var(--color-main-light)',
                  border: 'none',
                  cursor: 'pointer',
                  transform: currentSlide === index ? 'scale(1.2)' : 'scale(1)'
                }}
                aria-label={`Vai alla slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* Filosofia e Approccio */}
      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>Il Mio Approccio</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Icon name="dna" size={32} />
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Basato sulla Scienza</h3>
                    <p style={{ color: 'var(--text-darker)' }}>
                      Ogni consiglio è supportato dalle più recenti ricerche scientifiche 
                      in ambito nutrizionale e di medicina preventiva.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Icon name="userSingle" size={32} />
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Personalizzato</h3>
                    <p style={{ color: 'var(--text-darker)' }}>
                      Ogni piano nutrizionale è studiato specificatamente per te, 
                      considerando la tua storia, i tuoi obiettivi e le tue preferenze.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Icon name="heart" size={32} />
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Empatico e Supportivo</h3>
                    <p style={{ color: 'var(--text-darker)' }}>
                      Ti accompagno passo dopo passo, senza giudizi, 
                      celebrando ogni piccolo progresso nel tuo percorso.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Icon name="leaf" size={32} />
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Sostenibile</h3>
                    <p style={{ color: 'var(--text-darker)' }}>
                      Credo che prendersi cura di sé stessi significhi anche 
                      prendersi cura del nostro pianeta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-lg" style={{ background: 'var(--bg-section-warm)' }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>La Mia Missione</h3>
              <blockquote className="text-lg italic mb-6" style={{ color: 'var(--brand-title)' }}>
                "Rendere l'alimentazione vegana accessibile, gustosa e nutrizionalmente 
                completa per tutti, dimostrando che è possibile vivere in salute 
                rispettando ogni forma di vita."
              </blockquote>
              <p className="font-semibold" style={{ color: 'var(--brand-title)' }}>- Arianna</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      {/* <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-section-warm) 100%)' }} /> */}

      {/* Esperienza Professionale */}
      {/* <section className="py-20" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>Esperienza Professionale</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="border-l-4 pl-8" style={{ borderColor: 'var(--color-main)' }}>
                <div className="font-semibold text-lg" style={{ color: 'var(--brand-title)' }}>2020 - Presente</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Educatrice in Germania</h3>
                <p style={{ color: 'var(--text-darker)' }}>
                  Ho lavorato come educatrice presso scuole dell’infanzia bilingue a Berlino, accompagnando bambini e famiglie in un percorso di crescita multiculturale e inclusiva. Questa esperienza mi ha permesso di sviluppare empatia, capacità di ascolto e attenzione alle esigenze delle famiglie, valori che porto anche nella mia attività di nutrizionista.
                </p>
              </div>
              <div className="border-l-4 pl-8" style={{ borderColor: 'var(--color-main)' }}>
                <div className="font-semibold text-lg" style={{ color: 'var(--brand-title)' }}>2023 - Presente</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Nutrizionista Vegana</h3>
                <p style={{ color: 'var(--text-darker)' }}>
                  Svolgo consulenze nutrizionali specializzate in alimentazione vegetale, con particolare attenzione a donne, mamme e famiglie che desiderano un percorso vegano consapevole e sereno. Offro supporto pratico e personalizzato, anche per gravidanza, allattamento e svezzamento, unendo la mia esperienza personale e professionale.
                </p>
              </div>
              <div className="border-l-4 pl-8" style={{ borderColor: 'var(--color-main)' }}>
                <div className="font-semibold text-lg" style={{ color: 'var(--brand-title)' }}>2017 - 2020</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Supporto a famiglie e mamme vegane</h3>
                <p style={{ color: 'var(--text-darker)' }}>
                  Ho affiancato numerose famiglie nel passaggio a un’alimentazione vegetale, offrendo consulenze, incontri informativi e percorsi di accompagnamento pratico, con particolare attenzione alle esigenze di mamme e bambini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Transizione sfumata */}
      {/* <div className="gradient-transition" style={{ background: 'linear-gradient(180deg, var(--bg-section-warm) 0%, var(--bg-hero) 100%)' }} /> */}

      {/* Call to Action */}
      <section className="py-24" style={{ background: 'var(--brand-title)', color: 'var(--foreground)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center rounded-3xl shadow-2xl bg-white/20 backdrop-blur-md py-16 border-2 border-white/20" style={{ boxShadow: '0 8px 40px 0 rgba(37, 105, 67, 0.25)' }}>
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight" style={{ color: 'white', textShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
            Vuoi Saperne di Più sul Mio Approccio?
          </h2>
          <p className="text-2xl mb-10 font-medium" style={{ color: 'white', textShadow: '0 1px 8px rgba(0,0,0,0.15)' }}>
            Prenota una consulenza gratuita per scoprire come posso aiutarti <br />
            a raggiungere i tuoi obiettivi di salute e benessere.
          </p>
          <Button 
            href="/contatti" 
            variant="outline"
            size="lg"
            className="!bg-white !text-[var(--brand-title)] !border-white hover:!bg-white/90"
          >
            Prenota Consulenza Gratuita
          </Button>
        </div>
      </section>
    </div>
  );
}