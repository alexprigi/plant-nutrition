import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/icons/Icon';

export const metadata = {
  title: 'Servizi - Pura Essenza Vegetale | Consulenze Nutrizionali Vegane',
  description: 'Scopri tutti i servizi di Pura Essenza Vegetale: consulenze nutrizionali personalizzate, piani alimentari vegani, corsi di educazione alimentare e supporto per la transizione.',
};

export default function Servizi() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-hero)' }}>
        {/* Decorative circles */}
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
            I Nostri Servizi
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
            Percorsi personalizzati per guidarti verso uno stile di vita vegano 
            sano, equilibrato e sostenibile. Ogni servizio di Pura Essenza Vegetale è pensato per le tue esigenze specifiche.
          </p>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* Servizi e Prezzi - allineato con Home */}
      <section className="pt-12 pb-20 relative overflow-hidden" style={{ background: 'var(--bg-section-light)' }}>
        {/* Decorative circles */}
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full opacity-8" 
          style={{ background: 'linear-gradient(135deg, var(--color-main-light) 0%, var(--color-main) 100%)', transform: 'translate(40%, 0)' }}
        />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full opacity-8" 
          style={{ background: 'linear-gradient(135deg, var(--bg-hero) 0%, #F4E5C2 100%)', transform: 'translate(-40%, 0)' }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block mb-3">
              <Icon name="tag" size={64} animated={true} variant='pink' />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Pacchetti e Prezzi</h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
              Scegli il percorso più adatto alle tue esigenze. Ogni consulenza è personalizzata 
              e basata su evidenze scientifiche per supportarti nel tuo viaggio verso il benessere.
            </p>
          </div>

          {/* Call to Action - Consulenza Gratuita 15 min */}
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="relative rounded-2xl p-8 text-center shadow-xl transform hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #F2E4C1 100%)', border: '3px solid var(--brand-title)' }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg animate-pulse flex items-center gap-2" style={{ background: 'var(--brand-title)' }}>
                <Icon name="gift" size={16}  />
                <span>GRATUITO</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-3 mt-2" style={{ color: 'var(--brand-title)' }}>
                Consulenza Conoscitiva Gratuita
              </h3>
              <p className="text-lg mb-6" style={{ color: 'var(--text-dark-green)' }}>
                <strong>15 minuti</strong> per conoscerci, parlare dei tuoi obiettivi e capire insieme quale percorso è più adatto a te. Senza impegno!
              </p>
              <Button 
                href="/prenota" 
                size="lg"
                className="font-bold text-lg shadow-lg"
                style={{ background: 'var(--brand-title)', color: 'white' }}
              >
                Prenota i Tuoi 15 Minuti Gratuiti
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            
            {/* Consulenza Singola - Check rapido */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f5f0 50%, #e8f0e8 100%)', borderRadius: '1.5rem', border: '2px solid var(--brand-title)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'visible' }}>
              {/* Badge NUOVO */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg flex items-center gap-1" style={{ background: 'var(--brand-title)', zIndex: 10 }}>
                <Icon name="sparkles" size={12} />
                <span>NUOVO</span>
              </div>
              
              <div className="p-6 text-center border-b-4 pt-8" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #e8f0e8 0%, #f0f5f0 50%, white 100%)', borderRadius: '1.5rem 1.5rem 0 0' }}>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Consulenza Breve</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-dark-green)' }}>Check rapido 30 minuti</p>
                <div className="text-5xl font-extrabold mb-1" style={{ color: 'var(--brand-title)' }}>40-45€</div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-main)' }}>1 x 30 Min.</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-start space-x-2">
                    <Icon name="users" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>1x consulenza individuale 1:1</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="checkCircle" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Breve check per valori del sangue, supplementazione o analisi acidi grassi</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="laptop" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Online per Zoom-Videocall o Telefonata</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="helpCircle" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Risposta alle tue domande personali in 30 min</span>
                  </li>
                </ul>
                
                <Button 
                  href="/prenota" 
                  className="w-full"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  Prenota Appuntamento
                </Button>
              </div>
            </Card>

            {/* Consulenza Singola Standard */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ background: 'linear-gradient(135deg, #e8f0d8 0%, #f5f9ec 50%, #ffffff 100%)', borderRadius: '1.5rem', border: '3px solid var(--brand-title)', boxShadow: '0 8px 30px rgba(37, 105, 67, 0.15)', overflow: 'visible' }}>
              {/* Badge POPOLARE */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1" style={{ background: 'var(--brand-title)', zIndex: 10 }}>
                <Icon name="star" size={12} />
                <span>PIÙ SCELTO</span>
              </div>
              
              <div className="p-6 text-center border-b-4 pt-8" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #d8e8c4 0%, #e8f0d8 50%, white 100%)', borderRadius: '1.5rem 1.5rem 0 0' }}>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Consulenza Standard</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-dark-green)' }}>Sessione completa di consulenza</p>
                <div className="text-5xl font-extrabold mb-1" style={{ color: 'var(--brand-title)' }}>85€</div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-main)' }}>1 x 60 Min.</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-start space-x-2">
                    <Icon name="users" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>1x consulenza individuale 1:1</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="apple" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Analisi nutrizionale completa con feedback via E-Mail</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="laptop" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Online per Zoom-Videocall (con presentazione) o Telefonata</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="helpCircle" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Risposta alle tue domande in 60 min</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="fileText" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>PDF riassuntivo dei temi trattati con consigli pratici</span>
                  </li>
                </ul>
                
                <Button 
                  href="/prenota" 
                  className="w-full"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  Prenota Appuntamento
                </Button>
              </div>
            </Card>

            {/* Pacchetto Doppia Sessione */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #eef5e8 50%, #e8f0e0 100%)', borderRadius: '1.5rem', border: '2px solid var(--brand-title)', boxShadow: '0 4px 20px rgba(123, 160, 91, 0.12)', overflow: 'visible' }}>
              <div className="p-6 text-center border-b-4" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #cbe0f7 0%, #e8f0e8 50%, #f0f5f0 100%)', borderRadius: '1.5rem 1.5rem 0 0' }}>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Pacchetto Doppio</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-dark-green)' }}>Doppia sessione al prezzo vantaggioso</p>
                <div className="text-5xl font-extrabold mb-1" style={{ color: 'var(--brand-title)' }}>149€</div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>2 x 60 Min.</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-start space-x-2">
                    <Icon name="users" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>2x consulenza individuale 1:1</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="apple" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Analisi nutrizionale completa con feedback via E-Mail</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="laptop" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Online per Zoom-Videocall o Telefonata</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="helpCircle" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Risposta alle tue domande in 2x60 min</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="fileText" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>PDF riassuntivo con consigli mirati</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="medicalCross" size={20} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Su richiesta: supporto integrazione (1° appuntamento) e analisi valori (2° appuntamento)</span>
                  </li>
                </ul>
                
                <Button 
                  href="/prenota" 
                  className="w-full"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  Prenota Appuntamento
                </Button>
              </div>
            </Card>

            {/* Pacchetto Premium 3 Mesi */}
            <Card className="relative transform scale-105 hover:scale-110 transition-all duration-300 hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #F2E4C1 50%, #EBD9AD 100%)', borderRadius: '1.5rem', border: '4px solid var(--brand-title)', boxShadow: '0 12px 40px rgba(37, 105, 67, 0.25)', overflow: 'visible' }}>
              {/* Badge RISPARMIO */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap flex items-center gap-1" style={{ background: 'var(--brand-title)', zIndex: 10 }}>
                <Icon name="diamond" size={12} />
                <span>RISPARMIA 40%</span>
              </div>
              
              <div className="p-6 text-center border-b-4 pt-8" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(249,238,213,0.7) 50%, rgba(242,228,193,0.5) 100%)', borderRadius: '1.5rem 1.5rem 0 0' }}>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Percorso Completo</h3>
                <p className="text-sm mb-4 font-medium" style={{ color: 'var(--text-dark-green)' }}>Il tuo programma personalizzato</p>
                <div className="flex items-center justify-center gap-3 mb-1">
                  <span className="text-xl line-through opacity-70 font-semibold" style={{ color: 'var(--text-dark-green)' }}>836€</span>
                  <span className="text-5xl font-extrabold" style={{ color: 'var(--brand-title)' }}>499€</span>
                </div>
                <p className="text-sm font-bold flex items-center justify-center gap-2" style={{ color: 'var(--brand-title)' }}>
                  <Icon name="clock" size={16} />
                  <span>Accompagnamento 3 Mesi</span>
                </p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-start space-x-2">
                    <Icon name="users" size={20} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>6x consulenza individuale 1:1 (Valore 510€)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="apple" size={20} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>Analisi nutrizionale dettagliata con feedback completo</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="laptop" size={20} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>Online per Zoom-Videocall o Telefonata</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="helpCircle" size={20} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>Risposta a tutte le tue domande personali</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="messageCircle" size={20} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>3 mesi di supporto Chat (WhatsApp) (Valore 199€)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="clipboard" size={20} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>Checklist pratiche e tabelle con consigli (Valore 69€)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="utensils" size={20} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>Piani alimentari personalizzati e consigli per l'applicazione quotidiana (Valore 39€)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="pill" size={20} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>Raccomandazioni personalizzate per integrazione nutrizionale (Valore 19€)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="droplet" size={20} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dark-green)' }}>Supporto per prelievo ematico e successiva analisi valori</span>
                  </li>
                </ul>
                
                <Button 
                  href="/prenota" 
                  className="w-full font-bold text-lg"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  Inizia il Percorso
                </Button>
                
                <p className="text-center text-xs mt-3 italic" style={{ color: 'var(--text-dark-green)' }}>
                  Pagamento rateale su richiesta
                </p>
              </div>
            </Card>

          </div>

          {/* Nota informativa */}
          <div className="text-center max-w-3xl mx-auto p-6 rounded-lg mb-12" style={{ background: 'rgba(255,255,255,0.7)' }}>
            <p className="text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-dark-green)' }}>
              <Icon name="heart" size={20} />
              <span><strong>Tutte le consulenze includono:</strong> Materiale personalizzato, supporto via email e un approccio 
              empatico e scientifico al tuo benessere. <strong>Prima consulenza gratuita di 15 minuti</strong> per conoscerci!</span>
            </p>
          </div>

          {/* Altri Servizi Specialistici */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--brand-title)' }}>Servizi Specialistici</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <Card hover className="p-8 flex flex-col text-center group transition-all duration-300" style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #e8f0d8 0%, #f5f9ec 100%)' }}>
                <Icon name="heart" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Gestione Patologie</h3>
              <p className="mb-6 flex-grow text-sm leading-relaxed" style={{ color: 'var(--text-dark-green)' }}>
                Supporto nutrizionale per la gestione di patologie croniche come diabete, 
                ipertensione e problemi cardiovascolari attraverso l'alimentazione vegana.
              </p>
              <Button href="/prenota" className="w-full font-semibold" style={{ background: 'var(--brand-title)', color: 'white' }}>
                Scopri di Più
              </Button>
            </Card>

            <Card hover className="p-8 flex flex-col text-center group transition-all duration-300" style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #F2E4C1 100%)' }}>
                <Icon name="pregnant" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Nutrizione in Gravidanza</h3>
              <p className="mb-6 flex-grow text-sm leading-relaxed" style={{ color: 'var(--text-dark-green)' }}>
                Supporto nutrizionale specializzato per mamme vegane, 
                dalla pre-gravidanza all'allattamento.
              </p>
              <Button href="/prenota" className="w-full font-semibold" style={{ background: 'var(--brand-title)', color: 'white' }}>
                Scopri di Più
              </Button>
            </Card>

            <Card hover className="p-8 flex flex-col text-center group transition-all duration-300" style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #cbe0f7 0%, #e8f0e8 100%)' }}>
                <Icon name="activity" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Nutrizione Sportiva</h3>
              <p className="mb-6 flex-grow text-sm leading-relaxed" style={{ color: 'var(--text-dark-green)' }}>
                Piani alimentari vegani per atleti e sportivi, 
                per massimizzare performance e recupero.
              </p>
              <Button href="/prenota" className="w-full font-semibold" style={{ background: 'var(--brand-title)', color: 'white' }}>
                Scopri di Più
              </Button>
            </Card>
          </div>
        </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-hero) 100%)' }} />

      {/* Corsi e Workshop */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>
            Corsi e Workshop
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 flex flex-col">
              <div className="mb-4">
                <Icon name="book" size={48} style={{ color: 'var(--brand-title)' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Corso "Diventa Vegano in 30 Giorni"
              </h3>
              <p className="mb-6" style={{ color: 'var(--foreground)' }}>
                Un corso online completo con video-lezioni, ricette, 
                liste della spesa e supporto di gruppo per iniziare il tuo percorso vegano.
              </p>
              <div className="mb-6 flex-grow">
                <h4 className="font-semibold mb-2">Include:</h4>
                <ul className="text-sm space-y-1" style={{ color: 'var(--foreground)' }}>
                  <li>• 20 video-lezioni (5 ore totali)</li>
                  <li>• 50+ ricette scaricabili</li>
                  <li>• Gruppo Facebook privato</li>
                  <li>• Q&A settimanali dal vivo</li>
                  <li>• Certificato di completamento</li>
                </ul>
              </div>
              <div className="mt-auto">
                <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(157, 207, 205, 0.1)', border: '2px solid var(--brand-title)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'white' }}>€97</div>
                  <div style={{ color: 'var(--foreground)' }}>Accesso a vita</div>
                  <div className="text-sm mt-1" style={{ color: 'transparent' }}> </div>
                </div>
                <Button href="/contatti" variant="outline" className="w-full !bg-white !text-[var(--brand-title)] !border-[var(--brand-title)]">
                  Iscriviti al Corso
                </Button>
              </div>
            </Card>
            <Card className="p-8 flex flex-col">
              <div className="mb-4">
                <Icon name="users" size={48} style={{ color: 'var(--brand-title)' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Workshop "Cucina Vegana per Principianti"
              </h3>
              <p className="mb-6" style={{ color: 'var(--foreground)' }}>
                Workshop pratici in presenza per imparare le basi della cucina vegana: 
                tecniche, ingredienti e preparazioni essenziali.
              </p>
              <div className="mb-6 flex-grow">
                <h4 className="font-semibold mb-2">Include:</h4>
                <ul className="text-sm space-y-1" style={{ color: 'var(--foreground)' }}>
                  <li>• 4 ore di corso pratico</li>
                  <li>• Preparazione di 6 ricette</li>
                  <li>• Degustazione completa</li>
                  <li>• Ricettario cartaceo</li>
                  <li>• Lista ingredienti essenziali</li>
                </ul>
              </div>
              <div className="mt-auto">
                <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(157, 207, 205, 0.1)', border: '2px solid var(--brand-title)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'white' }}>€80</div>
                  <div style={{ color: 'var(--foreground)' }}>Workshop singolo</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--foreground)' }}>Prossima data: 15 Dicembre</div>
                </div>
                <Button href="/contatti" variant="outline" className="w-full !bg-transparent !text-white !border-white hover:!bg-white hover:!text-[var(--brand-title)]">
                  Prenota Posto
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* Processo */}
      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>
            Come Lavoriamo Insieme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--bg-section-warm)' }}>
                <Icon name="numberOne" size={32} style={{ color: 'var(--brand-title)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Consulenza Iniziale</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Analizziamo insieme la tua situazione attuale, 
                i tuoi obiettivi e le tue preferenze alimentari.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--bg-section-warm)' }}>
                <Icon name="numberTwo" size={32} style={{ color: 'var(--brand-title)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Piano Personalizzato</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Creo un piano nutrizionale specifico per te, 
                con ricette, liste della spesa e consigli pratici.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--bg-section-warm)' }}>
                <Icon name="numberThree" size={32} style={{ color: 'var(--brand-title)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Supporto Costante</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Ti accompagno nel percorso con controlli regolari 
                e supporto quotidiano via WhatsApp.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--bg-section-warm)' }}>
                <Icon name="numberFour" size={32} style={{ color: 'var(--brand-title)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Risultati Duraturi</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Raggiungiamo insieme i tuoi obiettivi 
                e costruiamo abitudini che dureranno nel tempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-section-warm) 100%)' }} />

      {/* FAQ */}
      <section className="py-20" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Domande Frequenti</h2>
            <p className="text-xl" style={{ color: 'var(--brand-title)' }}>
              Le risposte alle domande più comuni sui nostri servizi
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                Le consulenze sono disponibili anche online?
              </h3>
              <p style={{ color: 'var(--brand-title)' }}>
                Sì, offro consulenze sia in presenza nel mio studio che online via video-chiamata. 
                L'efficacia del percorso è la stessa in entrambe le modalità.
              </p>
            </div>

            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                Quanto tempo ci vuole per vedere i primi risultati?
              </h3>
              <p style={{ color: 'var(--brand-title)' }}>
                I primi benefici si notano già dopo 2-3 settimane: più energia, 
                migliore digestione e senso di benessere generale. I risultati a lungo termine 
                dipendono dagli obiettivi specifici.
              </p>
            </div>

            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                È adatta anche a chi fa sport a livello agonistico?
              </h3>
              <p style={{ color: 'var(--brand-title)' }}>
                Assolutamente sì! Ho seguito diversi atleti professionisti nella transizione 
                verso l'alimentazione vegana, con risultati eccellenti in termini di performance e recupero.
              </p>
            </div>

            <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-faq-bg)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                Cosa succede se non riesco a seguire il piano alimentare?
              </h3>
              <p style={{ color: 'var(--brand-title)' }}>
                Nessun problema! Il piano è sempre flessibile e adattabile. 
                Durante i controlli valutiamo insieme le difficoltà e modifichiamo il percorso 
                per renderlo più sostenibile per te.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-warm) 0%, var(--bg-hero) 100%)' }} />

      {/* Call to Action */}
      <section className="py-24" style={{ background: 'var(--brand-title)', color: 'var(--foreground)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center rounded-3xl shadow-2xl bg-white/20 backdrop-blur-md py-16 border-2 border-white/20" style={{ boxShadow: '0 8px 40px 0 rgba(37, 105, 67, 0.25)' }}>
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight" style={{ color: 'white', textShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
            Pronto a Iniziare il Tuo Percorso?
          </h2>
          <p className="text-2xl mb-10 font-medium" style={{ color: 'white', textShadow: '0 1px 8px rgba(0,0,0,0.15)' }}>
            Prenota una consulenza gratuita di 30 minuti per parlare dei tuoi obiettivi <br />
            e scoprire quale servizio è più adatto a te.
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