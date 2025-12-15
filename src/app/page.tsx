import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ParallaxEffect from '@/components/ParallaxEffect';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <ParallaxEffect />

      {/* Hero Section - Full Width */}
      <section className="relative h-screen overflow-hidden" style={{ background: 'var(--bg-hero)' }}>
        <div className="absolute inset-0 parallax-hero" id="heroImage">
          {/* Box per la foto reale della nutrizionista */}
          <div className="w-full h-full relative" style={{ 
            background: 'linear-gradient(135deg, rgba(198, 228, 227, 0.3) 0%, rgba(157, 207, 205, 0.2) 100%)',
          }}>
            {/* Immagine hero della nutrizionista */}
            <img 
              src="/images/nutritionist-hero.jpg" 
              alt="Dott.ssa Arianna Ciervo" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        
        {/* Overlay gradient per leggibilità testo */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
        
        {/* Content sovrapposto */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg">
                Ritrova energia e forma con <span style={{ color: '#a8e6e3', textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>la nutrizione vegetale</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-white drop-shadow-md">
                Benvenuto in Pura Essenza Vegetale, il centro specializzato in nutrizione vegana. <br />
                <span style={{ color: '#a8e6e3', textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>Sono la Dott.ssa Arianna Ciervo e ti accompagno verso uno stile di vita sano, equilibrato e sostenibile.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/prenota" size="lg" variant="primary">
                  Prenota Consulenza Gratuita
                </Button>
                <Button href="/chi-sono" variant="outline" size="lg" className="!bg-white/90 !text-[#256943] !border-white">
                  Scopri la Mia Storia
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-white text-sm mb-2">Scorri</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </section>


      {/* Transizione sfumata accentuata tra Hero e Presentazione Personale */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />
      
      {/* Decorazioni botaniche per sezioni centrali */}
      <div className="content-decorations" style={{ position: 'relative' }}>
        {/* Eucalipto curvo - sezione superiore */}
        <div style={{ 
          position: 'absolute', 
          left: '5px', 
          top: '200px',
          width: '110px',
          opacity: 0.78,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <img 
            src="/images/plants/eucalyptus-curved.svg" 
            alt="" 
            style={{ width: '100%', height: 'auto', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
          />
        </div>
        
        {/* Pianta in vaso - sezione servizi */}
        <div style={{ 
          position: 'absolute', 
          right: '8px', 
          top: '850px',
          width: '120px',
          opacity: 0.76,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <img 
            src="/images/plants/potted-plant.svg" 
            alt="" 
            style={{ width: '100%', height: 'auto', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
          />
        </div>
        
        {/* Fascio di grano - sezione CTA */}
        <div style={{ 
          position: 'absolute', 
          right: '8px', 
          top: '3200px',
          width: '100px',
          opacity: 0.78,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <img 
            src="/images/plants/wheat-bundle.svg" 
            alt="" 
            style={{ width: '100%', height: 'auto', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
          />
        </div>
        
        {/* Ramo di agrumi - sezione testimonianze */}
        <div style={{ 
          position: 'absolute', 
          right: '8px', 
          top: '2050px',
          width: '115px',
          opacity: 0.76,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <img 
            src="/images/plants/citrus-branch.svg" 
            alt="" 
            style={{ width: '100%', height: 'auto', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
          />
        </div>
        
        {/* Eucalipto curvo - sezione FAQ */}
        <div style={{ 
          position: 'absolute', 
          left: '5px', 
          top: '2700px',
          width: '110px',
          opacity: 0.78,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <img 
            src="/images/plants/eucalyptus-curved.svg" 
            alt="" 
            style={{ width: '100%', height: 'auto', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
          />
        </div>
        
        {/* Dente di leone - sezione CTA */}
        <div style={{ 
          position: 'absolute', 
          right: '8px', 
          top: '3200px',
          width: '140px',
          opacity: 0.78,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <img 
            src="/images/plants/dandelion.svg" 
            alt="" 
            style={{ width: '100%', height: 'auto', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
          />
        </div>
      
      {/* Sezione Presentazione Personale */}
      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>
                Ciao, sono la Dott.ssa Arianna Ciervo
              </h2>
              <p className="text-lg mb-6" style={{ color: 'var(--color-main-dark)' }}>
                Biologa Nutrizionista e fondatrice di Pura Essenza Vegetale. <br />
                La mia passione per la nutrizione vegana nasce dalla convinzione che il cibo sia la medicina più potente che abbiamo a disposizione.
              </p>
              <p className="text-lg mb-8" style={{ color: '#1E3232' }}>
                Dal mio studio domestico professionale, circondato dalle piante che amo e con la strumentazione più avanzata, offro consulenze online personalizzate in tutta Italia. <br />
                <span style={{ color: 'var(--color-main-dark)' }}>Ogni consulenza è un viaggio verso il benessere che intraprendiamo insieme.</span>
              </p>
              
              <div className="p-6 rounded-lg mb-8" style={{ background: 'var(--bg-section-warm)', color: 'var(--brand-title)' }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                  💚 La Mia Filosofia
                </h3>
                <p style={{ color: 'var(--brand-title)' }}>
                  "Credo che l'ambiente di lavoro influenzi profondamente il nostro benessere. <br />
                  Per questo ho creato uno studio domestico dove natura e scienza si incontrano, <br />
                  dove ogni pianta rappresenta la vita che nutriamo attraverso le nostre scelte alimentari."
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-main)' }}></div>
                  <span style={{ color: 'var(--color-main-dark)' }}>10+ anni di esperienza in nutrizione vegana</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-main)' }}></div>
                  <span style={{ color: 'var(--color-main-dark)' }}>500+ pazienti seguiti con successo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-main)' }}></div>
                  <span style={{ color: 'var(--color-main-dark)' }}>Formazione internazionale certificata</span>
                </div>
              </div>
              
              <Button href="/chi-sono" variant="outline" size="lg">
                Scopri la Mia Storia
              </Button>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="relative">
                {/* Box per foto reale dello studio/cucina */}
                <div className="image-box-hover w-full h-[500px] rounded-2xl shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E6EFE6 0%, #d0e3c4 100%)' }}>
                  
                  {/* Placeholder per foto reale - sostituisci con: */}
                  {/* <img src="/images/studio-kitchen.jpg" alt="Studio con piante" className="w-full h-full object-cover" /> */}
                  
                  {/* Temporaneo: Indicatore posizione foto */}
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(230, 239, 230, 0.95) 0%, rgba(208, 227, 196, 0.95) 100%)' }}>
                    <div className="text-center p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                      <div className="flex gap-4 justify-center mb-4">
                        <span className="text-5xl">🌿</span>
                        <span className="text-5xl">💻</span>
                        <span className="text-5xl">🪴</span>
                      </div>
                      <p className="text-2xl font-bold mb-2" style={{ color: '#256943' }}>Foto Studio/Cucina</p>
                      <p className="text-lg" style={{ color: '#6fa7a5' }}>Con piante e setup professionale</p>
                      <p className="text-sm mt-2" style={{ color: '#9dcfcd' }}>Suggerito: 800x600px</p>
                    </div>
                  </div>
                  
                  {/* Pattern decorativo di sfondo (visibile solo senza foto) */}
                  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }}>
                    <defs>
                      <pattern id="studioPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="30" cy="30" r="15" fill="#9dcfcd"/>
                        <path d="M60,40 Q70,30 60,20 Q50,30 60,40 Z" fill="#7bbab8"/>
                        <rect x="10" y="60" width="20" height="30" rx="3" fill="#c6e4e3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#studioPattern)"/>
                  </svg>
                </div>
                
                {/* Floating stats card con animazione */}
                <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-2xl p-6 max-w-xs image-box-hover" style={{ backdropFilter: 'blur(10px)' }}>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full pulse-glow" style={{ background: 'var(--color-main-light)' }}>
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--color-main)' }}>95%</div>
                      <div className="text-sm text-gray-600">dei pazienti raggiunge i propri obiettivi</div>
                    </div>
                  </div>
                </div>
                
                {/* Specialization badge con animazione */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-medium image-box-float" style={{ background: 'var(--color-main)', color: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                  Consulenze Online
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transizione sfumata accentuata tra Presentazione Personale e Servizi Principali */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-hero) 100%)' }} />
      {/* Servizi Principali */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>I Miei Servizi</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-main-dark)' }}>
              Ogni percorso è personalizzato per le tue esigenze specifiche, 
              basato su evidenze scientifiche e amore per il benessere naturale.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              hover
              className="p-10 text-center transition-all duration-300 border-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 relative"
              style={{
                background: 'var(--bg-card-warm)',
                color: 'var(--foreground)',
                borderRadius: '1.5rem',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12), 0 -8px 24px -8px #e0c9a6',
                borderTop: '6px solid #d2b48c',
                transform: 'rotate(-2deg)'
              }}
            >
              <div className="text-4xl mb-4">🥕</div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--brand-title)' }}>Consulenze Nutrizionali</h3>
              <p className="mb-6" style={{ color: '#1a5233' }}>
                Piani alimentari personalizzati per ogni fase della vita, 
                dall'infanzia alla terza età.
              </p>
              <Button href="/servizi" variant="outline">
                Scopri di più
              </Button>
            </Card>

            <Card
              hover
              className="p-10 text-center transition-all duration-300 border-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 relative"
              style={{
                background: 'var(--bg-card-warm)',
                color: 'var(--foreground)',
                borderRadius: '1.5rem',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12), 0 -8px 24px -8px #e0c9a6',
                borderTop: '6px solid #d2b48c',
                transform: 'rotate(0.5deg)'
              }}
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--brand-title)' }}>Educazione Alimentare</h3>
              <p className="mb-6" style={{ color: '#1a5233' }}>
                Workshop e corsi per imparare a nutrirsi consapevolmente 
                e in modo sostenibile.
              </p>
              <Button href="/servizi" variant="outline">
                Scopri di più
              </Button>
            </Card>

            <Card
              hover
              className="p-10 text-center transition-all duration-300 border-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 relative"
              style={{
                background: 'var(--bg-card-warm)',
                color: 'var(--foreground)',
                borderRadius: '1.5rem',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12), 0 -8px 24px -8px #e0c9a6',
                borderTop: '6px solid #d2b48c',
                transform: 'rotate(2deg)'
              }}
            >
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--brand-title)' }}>Supporto Transizione</h3>
              <p className="mb-6" style={{ color: '#1a5233' }}>
                Ti accompagno nel passaggio graduale verso 
                un'alimentazione 100% vegetale.
              </p>
              <Button href="/servizi" variant="outline">
                Scopri di più
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Transizione sfumata accentuata tra Servizi Principali e Perché Scegliere l'Alimentazione Vegana */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />
      {/* Perché Scegliere l'Alimentazione Vegana */}
      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>
                Nutri il tuo corpo, rispetta il pianeta
              </h2>
              <p className="text-xl mb-8" style={{ color: 'var(--color-main-dark)' }}>
                L'alimentazione vegana è la scelta perfetta per chi vuole prendersi cura di sé stesso e dell'ambiente che ci circonda.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">💪</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Salute Ottimale</h3>
                    <p style={{ color: 'var(--color-main-dark)' }}>
                      Riduzione del rischio di malattie cardiovascolari, diabete e alcuni tumori.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Sostenibilità Ambientale</h3>
                    <p style={{ color: 'var(--color-main-dark)' }}>
                      Riduce l'impatto ambientale del 70% rispetto a diete omnivore.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">❤️</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Benessere Animale</h3>
                    <p style={{ color: 'var(--color-main-dark)' }}>
                      Una scelta etica che rispetta la vita di tutti gli esseri senzienti.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-main)' }}>70%</div>
                <p style={{ color: '#1a5233' }}>Riduzione impatto CO₂</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-main)' }}>50%</div>
                <p style={{ color: '#1a5233' }}>Meno rischio diabete</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-main)' }}>30%</div>
                <p style={{ color: '#1a5233' }}>Riduzione malattie cardiache</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-main)' }}>+5</div>
                <p style={{ color: '#1a5233' }}>Anni di vita in salute</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonianze */}
      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Cosa Dicono i Miei Pazienti</h2>
            <p className="text-xl" style={{ color: 'var(--color-main-dark)' }}>
              Le loro storie di trasformazione parlano più di mille parole.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6" style={{ background: 'var(--bg-section-warm)', color: 'var(--brand-title)' }}>
              <div className="text-yellow-400 text-xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="mb-4" style={{ color: 'var(--brand-title)' }}>
                "Grazie alla Dottoressa ho scoperto un mondo di sapori e energia che non sapevo esistesse. 
                La mia vita è cambiata in meglio!"
              </p>
              <div className="font-semibold">- Maria, 34 anni</div>
            </Card>
            <Card className="p-6" style={{ background: 'var(--bg-section-warm)', color: 'var(--brand-title)' }}>
              <div className="text-yellow-400 text-xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="mb-4" style={{ color: 'var(--brand-title)' }}>
                "Professionale, empatica e sempre disponibile. I miei valori del sangue 
                sono migliorati incredibilmente in soli 3 mesi."
              </p>
              <div className="font-semibold">- Giuseppe, 45 anni</div>
            </Card>
            <Card className="p-6" style={{ background: 'var(--bg-section-warm)', color: 'var(--brand-title)' }}>
              <div className="text-yellow-400 text-xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="mb-4" style={{ color: 'var(--brand-title)' }}>
                "Ho perso 15 kg senza rinunce, anzi mangiando di più! 
                Non tornerò mai indietro alla mia alimentazione precedente."
              </p>
              <div className="font-semibold">- Alessandra, 28 anni</div>
            </Card>
          </div>
        </div>

      </section>
      {/* Transizione sfumata accentuata tra Testimonianze e FAQ */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-section-warm) 100%)' }} />

      {/* FAQ Section */}
      <section className="py-20" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Domande Frequenti</h2>
            <p className="text-xl" style={{ color: 'var(--color-main-dark)' }}>
              Le risposte alle domande più comuni sulla nutrizione vegana
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                🌱 È davvero possibile ottenere tutti i nutrienti da una dieta vegana?
              </h3>
              <p style={{ color: 'var(--color-main-dark)' }}>
                Assolutamente sì! Una dieta vegana ben pianificata fornisce tutti i nutrienti essenziali. 
                Ti guiderò nella scelta degli alimenti giusti e, quando necessario, degli integratori appropriati 
                per garantire il massimo benessere.
              </p>
            </div>

            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                ⏰ Quanto tempo ci vuole per vedere i primi risultati?
              </h3>
              <p style={{ color: 'var(--color-main-dark)' }}>
                I primi benefici si notano già nelle prime 2-3 settimane: più energia, 
                migliore digestione e senso di leggerezza. I risultati più significativi 
                su peso e parametri ematici si vedono generalmente entro 2-3 mesi.
              </p>
            </div>

            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                💰 Quanto costa seguire una dieta vegana?
              </h3>
              <p style={{ color: 'var(--color-main-dark)' }}>
                Contrariamente a quanto si pensa, l'alimentazione vegana può essere più economica! 
                Legumi, cereali, verdure e frutta sono spesso meno costosi della carne. 
                Ti insegnerò a fare la spesa in modo intelligente e conveniente.
              </p>
            </div>

            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                👨‍👩‍👧‍👦 È adatta anche per bambini e anziani?
              </h3>
              <p style={{ color: 'var(--color-main-dark)' }}>
                Sì, l'alimentazione vegana è adatta a tutte le età quando ben pianificata. 
                Creo piani specifici per bambini, adolescenti, gravidanza, allattamento e terza età, 
                sempre con il supporto del pediatra o medico curante.
              </p>
            </div>

            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                🏃‍♀️ Posso fare sport con l'alimentazione vegana?
              </h3>
              <p style={{ color: 'var(--color-main-dark)' }}>
                Certamente! Molti atleti professionisti seguono diete vegane con ottimi risultati. 
                Ti aiuterò a ottimizzare l'alimentazione per le tue attività sportive, 
                garantendo energia e recupero ottimali.
              </p>
            </div>

            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--bg-card-dark)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                📱 Come funzionano le consulenze online?
              </h3>
              <p style={{ color: 'var(--color-main-dark)' }}>
                Le consulenze si svolgono tramite videochiamate su piattaforme sicure. 
                Riceverai questionari preliminari, piani alimentari personalizzati via email 
                e supporto continuo via WhatsApp per domande urgenti.
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>
      {/* Fine decorazioni */}

      {/* Call to Action Finale */}
      <section className="py-24" style={{ background: 'var(--accent)', color: 'var(--foreground)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center rounded-3xl shadow-2xl bg-white/20 backdrop-blur-md py-16 border-2 border-white/20" style={{ boxShadow: '0 8px 40px 0 rgba(39, 89, 67, 0.18)' }}>
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight" style={{ color: 'white', textShadow: '0 2px 16px rgba(39,89,67,0.18)' }}>
            Pronto a Iniziare il Tuo Percorso di Benessere?
          </h2>
          <p className="text-2xl mb-10 font-medium" style={{ color: 'white', textShadow: '0 1px 8px rgba(39,89,67,0.10)' }}>
            Prenota una consulenza gratuita di 30 minuti per scoprire come <br />
            l'alimentazione vegana può trasformare la tua vita.
          </p>
          <Button 
            href="/contatti" 
            variant="primary" 
            size="lg"
          >
            Prenota Consulenza Gratuita
          </Button>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20" style={{ background: 'var(--background-pastel)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            Seguimi sui Social
          </h2>
          <p className="text-xl mb-12" style={{ color: 'var(--color-main-dark)' }}>
            Ricette, consigli e ispirazione quotidiana per il tuo percorso vegano
          </p>
          
          <div className="flex justify-center space-x-8 mb-12">
            <a 
              href="https://wa.me/393123456789" 
              className="group flex flex-col items-center space-y-3 hover:scale-105 transition-transform duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <span className="font-semibold" style={{ color: 'var(--color-main-dark)' }}>WhatsApp</span>
            </a>

            <a 
              href="https://t.me/puraessenzavegetale" 
              className="group flex flex-col items-center space-y-3 hover:scale-105 transition-transform duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <span className="font-semibold" style={{ color: 'var(--color-main-dark)' }}>Telegram</span>
            </a>
            
            <a 
              href="https://instagram.com/pura_essenza_vegetale" 
              className="group flex flex-col items-center space-y-3 hover:scale-105 transition-transform duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className="font-semibold" style={{ color: 'var(--color-main-dark)' }}>Instagram</span>
            </a>
            
            <a 
              href="https://facebook.com/pura.essenza.vegetale" 
              className="group flex flex-col items-center space-y-3 hover:scale-105 transition-transform duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="font-semibold" style={{ color: 'var(--color-main-dark)' }}>Facebook</span>
            </a>
          </div>

          {/* Nessun contenuto aggiuntivo sotto i link social */}
        </div>
      </section>
    </div>
  );
}
