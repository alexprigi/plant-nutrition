import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'var(--bg-hero)', color: 'var(--foreground)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>
                Ritrova energia e forma con <span style={{ color: 'var(--color-main-dark)' }}>la nutrizione vegetale</span>
              </h1>
              <p className="text-xl mb-8" style={{ color: 'var(--brand-title)' }}>
                Benvenuto in Pura Essenza Vegetale, il centro specializzato in nutrizione vegana. <br />
                <span style={{ color: 'var(--color-main-dark)' }}>Sono la Dott.ssa Arianna Ciervo e ti accompagno verso uno stile di vita sano, equilibrato e sostenibile.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/prenota" size="lg" variant="primary">
                  Prenota Consulenza Gratuita
                </Button>
                <Button href="/chi-sono" variant="outline" size="lg">
                  Scopri la Mia Storia
                </Button>
              </div>
              {/* Spostato nel box decorativo */}
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-50" style={{ background: 'var(--color-main-light)' }}></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-30" style={{ background: 'var(--background)' }}></div>
            </div>
            {/* Box quadrato immagine hero */}
            <div className="hidden lg:flex items-center justify-center">
              <div style={{ width: '100%', height: 500, background: '#cbead6', borderRadius: '2.5rem', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Pattern decorativo grande e sfumato */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{
                    position: 'absolute',
                    top: -40, left: -40, width: 180, height: 180, borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--color-main-dark) 0%, transparent 80%)',
                    opacity: 0.22
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: 60, right: -30, width: 120, height: 120, borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--color-main-light) 0%, transparent 80%)',
                    opacity: 0.18
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 40, left: 60, width: 110, height: 110, borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--color-main-light) 0%, transparent 80%)',
                    opacity: 0.16
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: -30, right: -30, width: 160, height: 160, borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--accent) 0%, transparent 80%)',
                    opacity: 0.18
                  }} />
                </div>
                {/* Icona centrale grande */}
                <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'var(--color-main-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: 72 }}>🌱</span>
                  </div>
                  {/* Riga di 3 icone decorative */}
                  <div className="flex justify-center space-x-4 mb-6 mt-8">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--background)' }}>
                      <span className="text-xl">🌿</span>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                      <span className="text-xl">📋</span>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--background)' }}>
                      <span className="text-xl">🔬</span>
                    </div>
                  </div>
                  {/* Scritta e pallino */}
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--color-main)' }}></div>
                    <span className="text-base font-medium text-gray-900">Disponibile per consulenze</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Transizione sfumata accentuata tra Hero e Presentazione Personale */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />
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
                {/* Enhanced placeholder for online consultation setup */}
                <div className="w-full h-[500px] rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 relative overflow-hidden" style={{ background: 'var(--bg-section-warm)' }}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full" style={{ background: 'var(--color-main-dark)' }}></div>
                    <div className="absolute top-12 right-8 w-6 h-6 rounded-full" style={{ background: 'var(--color-main-light)' }}></div>
                    <div className="absolute bottom-8 left-12 w-10 h-10 rounded-full" style={{ background: 'var(--color-main-light)' }}></div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full" style={{ background: 'var(--accent)' }}></div>
                  </div>
                  
                  {/* Main content */}
                  <div className="relative z-10 text-center">
                    <div className="mb-6">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-main-light)' }}>
                        <span className="text-3xl">💻</span>
                      </div>
                    </div>
                    
                    {/* Decorative icons */}
                    <div className="flex justify-center space-x-4 mb-6">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--background)' }}>
                        <span className="text-xl">🌿</span>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                        <span className="text-xl">📋</span>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--background)' }}>
                        <span className="text-xl">🔬</span>
                      </div>
                    </div>
                    
                    <p className="font-medium mb-2" style={{ color: 'var(--color-main-dark)' }}>Consulenze Online</p>
                    <p className="text-sm" style={{ color: 'var(--color-main)' }}>Dalla mia cucina con piante e professionalità</p>
                  </div>
                </div>
                
                {/* Floating stats card */}
                <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-2xl p-6 max-w-xs">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full" style={{ background: 'var(--color-main-light)' }}>
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--color-main)' }}>95%</div>
                      <div className="text-sm text-gray-600">dei pazienti raggiunge i propri obiettivi</div>
                    </div>
                  </div>
                </div>
                
                {/* Specialization badge */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'var(--color-main)', color: 'white' }}>
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
              <p className="mb-6" style={{ color: 'var(--color-main-dark)' }}>
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
              <p className="mb-6" style={{ color: 'var(--color-main-dark)' }}>
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
              <p className="mb-6" style={{ color: 'var(--color-main-dark)' }}>
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
                <p style={{ color: 'var(--color-main-dark)' }}>Riduzione impatto CO₂</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-main)' }}>50%</div>
                <p style={{ color: 'var(--color-main-dark)' }}>Meno rischio diabete</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-main)' }}>30%</div>
                <p style={{ color: 'var(--color-main-dark)' }}>Riduzione malattie cardiache</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-main)' }}>+5</div>
                <p style={{ color: 'var(--color-main-dark)' }}>Anni di vita in salute</p>
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
              <span className="text-gray-700 font-medium group-hover:text-pink-600 transition-colors">Instagram</span>
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
              <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Facebook</span>
            </a>

            <a 
              href="https://youtube.com/@puraessenzavegetale" 
              className="group flex flex-col items-center space-y-3 hover:scale-105 transition-transform duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span className="text-gray-700 font-medium group-hover:text-red-600 transition-colors">YouTube</span>
            </a>

            <a 
              href="https://linkedin.com/in/arianna-ciervo-nutrizionista" 
              className="group flex flex-col items-center space-y-3 hover:scale-105 transition-transform duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <span className="text-gray-700 font-medium group-hover:text-blue-700 transition-colors">LinkedIn</span>
            </a>
          </div>

          {/* Nessun contenuto aggiuntivo sotto i link social */}
        </div>
      </section>
    </div>
  );
}
