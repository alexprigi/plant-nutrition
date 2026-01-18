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
            I Miei Servizi
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
            Percorsi personalizzati per guidarti verso uno stile di vita vegano
            sano, equilibrato e sostenibile. Ogni servizio di Pura Essenza Vegetale è pensato per le tue esigenze specifiche.
          </p>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* Come Funziona - Prima Sezione */}
      <section className="pt-16 pb-20 relative overflow-hidden" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <Icon name="route" size={64} animated={true} variant="mint" />
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Come Funziona</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
              Un percorso personalizzato che ti accompagna passo dopo passo verso il tuo benessere
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 relative">
            <div className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-section-warm)' }}>
                  <Icon name="numberOne" size={52} shape='circle' />
                </div>
                {/* Freccia ondulata verso il prossimo step */}
                <svg className="hidden lg:block absolute left-full top-1/2 w-[200%] xl:w-[240%] 2xl:w-[260%] h-16 pointer-events-none" viewBox="0 0 160 40" style={{ transform: 'translate(8%, -50%)' }}>
                  <defs>
                    <marker id="arrow1" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                      <polygon points="0 0, 8 4, 0 8" fill="#6B8E7F" opacity="0.5" />
                    </marker>
                  </defs>
                  <path d="M 5 20 Q 45 5, 85 20 Q 125 35, 155 20" stroke="#6B8E7F" strokeWidth="2" fill="none" opacity="0.5" markerEnd="url(#arrow1)" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>Conosciamoci</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Iniziamo con una <strong>consulenza gratuita di 15 minuti</strong> per capire i tuoi obiettivi,
                le tue esigenze e rispondere a tutte le tue domande.
              </p>
            </div>
            <div className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-section-warm)' }}>
                  <Icon name="numberTwo" size={52} shape='circle' />
                </div>
                {/* Freccia ondulata verso il prossimo step */}
                <svg className="hidden lg:block absolute left-full top-1/2 w-[200%] xl:w-[240%] 2xl:w-[260%] h-16 pointer-events-none" viewBox="0 0 160 40" style={{ transform: 'translate(8%, -50%)' }}>
                  <defs>
                    <marker id="arrow2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                      <polygon points="0 0, 8 4, 0 8" fill="#6B8E7F" opacity="0.5" />
                    </marker>
                  </defs>
                  <path d="M 5 20 Q 45 35, 85 20 Q 125 5, 155 20" stroke="#6B8E7F" strokeWidth="2" fill="none" opacity="0.5" markerEnd="url(#arrow2)" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>Analisi Completa</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Analizziamo insieme la tua situazione attuale: abitudini alimentari,
                stile di vita, eventuali analisi del sangue e preferenze personali.
              </p>
            </div>
            <div className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-section-warm)' }}>
                  <Icon name="numberThree" size={52} shape='circle' />
                </div>
                {/* Freccia ondulata verso il prossimo step */}
                <svg className="hidden lg:block absolute left-full top-1/2 w-[200%] xl:w-[240%] 2xl:w-[260%] h-16 pointer-events-none" viewBox="0 0 160 40" style={{ transform: 'translate(8%, -50%)' }}>
                  <defs>
                    <marker id="arrow3" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                      <polygon points="0 0, 8 4, 0 8" fill="#6B8E7F" opacity="0.5" />
                    </marker>
                  </defs>
                  <path d="M 5 20 Q 45 5, 85 20 Q 125 35, 155 20" stroke="#6B8E7F" strokeWidth="2" fill="none" opacity="0.5" markerEnd="url(#arrow3)" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>Piano Su Misura</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Creo un piano nutrizionale specifico per te, completo di ricette,
                liste della spesa, consigli pratici e materiale educativo.
              </p>
            </div>
            <div className="text-center relative">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-section-warm)' }}>
                  <Icon name="numberFour" size={52} shape='circle' />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>Supporto Continuo</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Ti accompagno nel percorso con controlli regolari, aggiustamenti del piano
                e supporto via WhatsApp per domande urgenti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-section-warm) 100%)' }} />

      {/* Sezione Specializzazione Principale - Gravidanza */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <Icon name="heartMom" size={64} animated={true} variant="pink" />
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>La Mia Specializzazione Principale</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
              Gravidanza, Allattamento e Nutrizione Materno-Infantile
            </p>
          </div>

          {/* Card Container - con spazio per il badge */}
          <div className="max-w-6xl mx-auto relative pt-6">
            {/* Badge SPECIALIZZAZIONE PRINCIPALE */}
            <div className="absolute -top-0 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg z-10 flex items-center gap-2" style={{ background: 'var(--brand-title)' }}>
              <span>❤️ IL MIO CUORE PULSANTE</span>
            </div>

            <Card className="overflow-hidden relative" style={{ 
              background: 'white',
              borderRadius: '2rem',
              border: '3px solid var(--brand-title)',
              boxShadow: '0 20px 60px rgba(37, 105, 67, 0.15)'
            }}>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Immagine */}
              <div className="relative h-[400px] lg:h-auto">
                <img 
                  src="/images/professional/arianna-pregnant.jpg" 
                  alt="Arianna durante la gravidanza - Specializzazione nutrizione materno-infantile" 
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 30%' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
                }}>
                  <p className="text-white text-base font-medium italic">
                    "La mia esperienza personale come mamma vegana mi permette di accompagnarti con empatia e competenza."
                  </p>
                </div>
              </div>

              {/* Contenuto */}
              <div className="p-8 lg:p-12">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
                  Gravidanza, Allattamento e Post-Partum Vegano
                </h3>
                
                <p className="text-base mb-4" style={{ color: 'var(--text-dark-green)', lineHeight: '1.7' }}>
                  Ti accompagno in questo <strong>viaggio straordinario</strong> con piani nutrizionali sicuri, bilanciati e scientificamente validati.
                  Il mio obiettivo è garantire la <strong>perfetta crescita del tuo bambino</strong> preservando le tue energie e il tuo benessere.
                </p>

                <p className="text-base mb-6" style={{ color: 'var(--text-dark-green)', lineHeight: '1.7' }}>
                  Un supporto costante che continua anche dopo il parto, per un <strong>recupero dolce e consapevole</strong>.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon name="molecule" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-0.5" style={{ color: 'var(--brand-title)' }}>Apporto Completo di Nutrienti</h4>
                      <p className="text-xs" style={{ color: 'var(--text-dark-green)' }}>
                        Tutti i nutrienti essenziali per lo sviluppo ottimale del bambino
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon name="drop" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-0.5" style={{ color: 'var(--brand-title)' }}>Prevenzione Diabete Gestazionale</h4>
                      <p className="text-xs" style={{ color: 'var(--text-dark-green)' }}>
                        Controllo glicemico e prevenzione delle complicanze
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon name="baby" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-0.5" style={{ color: 'var(--brand-title)' }}>Supporto Allattamento</h4>
                      <p className="text-xs" style={{ color: 'var(--text-dark-green)' }}>
                        Nutrizione ottimale per la produzione e qualità del latte materno
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <Icon name="lightning" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-0.5" style={{ color: 'var(--brand-title)' }}>Recupero Post-Parto</h4>
                      <p className="text-xs" style={{ color: 'var(--text-dark-green)' }}>
                        Ricomposizione corporea gentile e recupero energetico
                      </p>
                    </div>
                  </div>
                </div>

                <Button href="/prenota" size="lg" className="w-full lg:w-auto">
                  Prenota Consulenza Gratuita
                </Button>
              </div>
            </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-warm) 0%, var(--bg-section-warm) 100%)' }} />

      {/* Altre Specializzazioni */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Altre Specializzazioni</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
              Un approccio scientifico ed empatico per ogni fase della vita
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 1. Svezzamento */}
            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #F2E4C1 100%)' }}>
                <Icon name="carrot" size={40} variant="peach" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>Svezzamento e Bambini</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>
                Dalle prime pappe all'autonomia a tavola. Ti guido nell'autosvezzamento (o svezzamento classico)
                con particolare attenzione ai tagli sicuri e alla <strong>costruzione di un rapporto sereno con il cibo</strong> fin da piccoli, per crescere bambini curiosi e sani.
              </p>
            </Card>

            {/* 2. Patologie e Allergie */}
            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #E0F5EE 0%, #D4F1E8 100%)' }}>
                <Icon name="activity" size={40} variant="lavender" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>Patologie e Allergie</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>
                Non solo dieta, ma terapia. Ti aiuto a gestire patologie come IBS (colon irritabile), gastrite,
                insulino-resistenza, diabete o squilibri ormonali (PCOS, endometriosi).
                Costruiamo protocolli specifici per ridurre i sintomi e ritrovare il benessere quotidiano.
              </p>
            </Card>

            {/* 3. Nutrizione per la Famiglia */}
            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #e8f0d8 0%, #f5f9ec 100%)' }}>
                <Icon name="users" size={40} variant="blue" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>Nutrizione per la Famiglia</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>
                Basta cucinare tre pasti diversi! Elaboriamo un menu unico, sano e gustoso che concili le esigenze di adulti e bambini.
                Riduciamo lo stress in cucina migliorando la salute di tutta la famiglia, senza rinunciare al gusto.
              </p>
            </Card>

            {/* 4. Transizione Vegana */}
            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #E8F0E8 0%, #F0F5F0 100%)' }}>
                <Icon name="leaf" size={40} variant="mint" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>Transizione Vegana</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>
                Vuoi avvicinarti al mondo vegetale? Ti accompagno in una transizione graduale,
                senza carenze e senza rinunce. Scoprirai nuovi sapori e imparerai come bilanciare
                perfettamente il piatto veg, per te o per i tuoi figli.
              </p>
            </Card>

            {/* 5. Gestione del Peso */}
            {/* <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #FFF0E5 0%, #FFE5D9 100%)' }}>
                <Icon name="target" size={40} variant="peach" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>Gestione del Peso</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>
                Dimagrimento o aumento di peso in modo sano ed equilibrato, con un approccio sostenibile nel tempo.
              </p>
            </Card> */}

            {/* 6. Menopausa */}
            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #F9F0F5 0%, #F5E6F0 100%)' }}>
                <Icon name="lotus" size={40} variant="pink" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>Menopausa</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>
                Gestione dei sintomi attraverso l'alimentazione. Supporto per questa fase di transizione naturale della vita.
              </p>
            </Card>

            {/* 7. Sport & Performance */}
            <Card hover className="p-8 text-center group transition-all duration-300"
              style={{ borderRadius: '1.5rem', border: '2px solid rgba(37, 105, 67, 0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#ffffff' }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #E8E0F5 0%, #F0E8F8 100%)' }}>
                <Icon name="lightning" size={40} variant="lemon" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>Sport & Performance</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#2d5f3f' }}>
                Massimizza i risultati del tuo allenamento. Miglioriamo performance e recupero muscolare attraverso strategie nutrizionali mirate.
                Dimostriamo insieme che si possono raggiungere alti livelli atletici anche con un'alimentazione a base vegetale.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-warm) 0%, var(--bg-section-light) 100%)' }} />

      {/* Consulenze e Percorsi - SEZIONE PREZZI INTEGRATA */}
      <section className="pt-12 pb-20 relative overflow-hidden" style={{ background: 'var(--bg-section-light)' }}>
        {/* Decorative circles */}
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
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Tariffe e Percorsi</h2>
            <p className="text-lg max-w-3xl mx-auto mb-8" style={{ color: 'var(--brand-title)' }}>
              Trasparenza e chiarezza sono alla base del nostro rapporto. <br />
              Scegli la soluzione più adatta per iniziare il tuo percorso di salute.
            </p>
          </div>

          {/* Call to Action - Consulenza Gratuita 15 min */}
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="relative rounded-2xl p-8 text-center shadow-xl transform hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #F2E4C1 100%)', border: '3px solid var(--brand-title)' }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg animate-pulse flex items-center gap-2" style={{ background: 'var(--brand-title)' }}>
                <Icon name="gift" size={16} />
                <span>SENZA IMPEGNO</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-3 mt-2" style={{ color: 'var(--brand-title)' }}>
                Colloquio Conoscitivo Gratuito
              </h3>
              <p className="text-lg mb-6" style={{ color: 'var(--text-dark-green)' }}>
                <strong>15 minuti</strong> per conoscerci. Mi racconterai i tuoi obiettivi e valuteremo insieme se i miei percorsi sono la soluzione giusta per te.
              </p>
              <Button
                href="/prenota"
                size="lg"
                className="font-bold text-lg shadow-lg"
                style={{ background: 'var(--brand-title)', color: 'white' }}
              >
                Prenota i 15 Minuti Gratuiti
              </Button>
            </div>
          </div>

          {/* Titolo Sezione Singole */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Consulenze Singole</h3>
            <p className="text-base" style={{ color: 'var(--text-dark-green)' }}>Flessibilità per ogni fase del percorso</p>
          </div>

          {/* Grid 2 card consulenze singole */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">

            {/* 1. Visita di Controllo - 50€ */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f5 50%, #f0f0e8 100%)', borderRadius: '1.5rem', border: '2px solid var(--brand-title)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'visible' }}>
              <div className="p-6 text-center border-b-4 pt-8 flex flex-col justify-between" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #f8f8f5 0%, #f0f0e8 50%, white 100%)', borderRadius: '1.5rem 1.5rem 0 0', height: '230px' }}>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Visita di Controllo</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-dark-green)' }}>Monitoraggio e aggiornamenti</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-1" style={{ minHeight: '72px' }}>
                  <div style={{ height: '28px' }}></div>
                  <div className="text-5xl font-extrabold" style={{ color: 'var(--brand-title)' }}>50€</div>
                  <p className="text-sm font-semibold" style={{ color: '#256943' }}>30 Minuti</p>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <ul className="space-y-4 mb-6 text-left flex-grow">
                  <li className="flex items-start gap-3">
                    <Icon name="video" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}><strong>1 x 30 min</strong> videocall focus</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="checkCircle" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Analisi esami o integrazione</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="refreshCcw" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Aggiornamento piano esistente</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="info" size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#EAB308' }} />
                    <span className="text-xs font-bold" style={{ color: '#854D0E' }}>NOTA: Non include piano nutrizionale ex-novo</span>
                  </li>
                </ul>

                <Button
                  href="/prenota?type=controllo"
                  className="w-full mt-auto"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  Prenota Controllo
                </Button>
              </div>
            </Card>

            {/* 2. Prima Visita Completa - 85€ */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col" style={{ background: 'linear-gradient(135deg, #D4F1E8 0%, #E0F5EE 50%, #EDF9F5 100%)', borderRadius: '1.5rem', border: '3px solid var(--brand-title)', boxShadow: '0 8px 30px rgba(37, 105, 67, 0.15)', overflow: 'visible' }}>
              {/* Badge POPOLARE */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1" style={{ background: 'var(--brand-title)', zIndex: 10 }}>
                <Icon name="star" size={12} style={{ color: 'white' }} />
                <span>PER INIZIARE</span>
              </div>
              <div className="p-6 text-center border-b-4 pt-8 flex flex-col justify-between" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #d8e8c4 0%, #e8f0d8 50%, white 100%)', borderRadius: '1.5rem 1.5rem 0 0', height: '230px' }}>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Prima Visita</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-dark-green)' }}>Anamnesi completa e piano</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-1" style={{ minHeight: '72px' }}>
                  <div style={{ height: '28px' }}></div>
                  <div className="text-5xl font-extrabold" style={{ color: 'var(--brand-title)' }}>85€</div>
                  <p className="text-sm font-semibold" style={{ color: '#256943' }}>60 Min + Elaborazione</p>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <ul className="space-y-4 mb-6 text-left flex-grow">
                  <li className="flex items-start gap-3">
                    <Icon name="video" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}><strong>1 x 60 min</strong> Anamnesi approfondita</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="apple" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}><strong>Piano Nutrizionale</strong> su misura (PDF)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="pill" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Protocollo Integrazione (B12, Vit D, ecc.)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="fileText" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Ricettario base e guida alla spesa</span>
                  </li>
                </ul>

                <Button
                  href="/prenota?type=first"
                  className="w-full mt-auto"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  Prenota Prima Visita
                </Button>
              </div>
            </Card>
          </div>

          {/* Percorsi Continuativi */}
          <div className="text-center mb-8 mt-20">
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Percorsi Continuativi</h3>
            <p className="text-base mb-6" style={{ color: 'var(--text-dark-green)' }}>Risparmia e ottieni risultati duraturi con un supporto costante</p>
          </div>

          {/* Grid 2 card percorsi continuativi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-5xl mx-auto">
            {/* Percorso 3 Mesi - 237€ */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col" style={{ background: 'linear-gradient(135deg, #D4E8F1 0%, #E0EEF5 50%, #EDF5F9 100%)', borderRadius: '1.5rem', border: '2px solid var(--color-main)', boxShadow: '0 4px 20px rgba(37, 105, 67, 0.1)' }}>
              <div className="p-6 text-center border-b-4 pt-8 flex flex-col justify-between" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #D4E8F1 0%, #E0EEF5 50%, white 100%)', borderRadius: '1.5rem 1.5rem 0 0', height: '230px' }}>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Percorso 3 Mesi</h3>
                  <p className="text-sm mb-1 font-medium" style={{ color: 'var(--text-dark-green)' }}>Consolidamento abitudini</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(255, 182, 193, 0.2)', color: '#256943' }}>Gravidanza</span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(157, 207, 205, 0.2)', color: '#256943' }}>Sport</span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(232, 240, 216, 0.4)', color: '#256943' }}>Lifestyle</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-1" style={{ minHeight: '72px' }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-xl line-through opacity-60" style={{ color: 'var(--text-dark-green)' }}>255€</span>
                    <span className="text-5xl font-extrabold" style={{ color: 'var(--brand-title)' }}>237€</span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#256943' }}>3 Visite + Supporto</p>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <ul className="space-y-4 mb-6 text-left flex-grow">
                  <li className="flex items-start gap-3">
                    <Icon name="video" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}><strong>3 x Consulenze</strong> (1 al mese)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="clipboard" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Analisi diario alimentare e monitoraggio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="checkCircle" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}><strong>Kit "Vegan Safe"</strong>: Checklist Ferro/Calcio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="mail" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Supporto via email prioritario</span>
                  </li>
                </ul>

                <Button
                  href="/prenota?type=3mesi"
                  className="w-full mt-auto"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  Inizia il Percorso
                </Button>
              </div>
            </Card>

            {/* Percorso 6 Mesi - 450€ */}
            <Card className="relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col" style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #FBF3E3 50%, #FDF8F0 100%)', borderRadius: '1.5rem', border: '2px solid var(--color-main)', boxShadow: '0 4px 20px rgba(37, 105, 67, 0.1)', overflow: 'visible' }}>
              {/* Badge MASSIMO VALORE */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap flex items-center gap-1" style={{ background: 'var(--brand-title)', zIndex: 10 }}>
                <Icon name="sparkles" size={12} style={{ color: 'white' }} />
                <span>MASSIMO VALORE</span>
              </div>
              <div className="p-6 text-center border-b-4 pt-8 flex flex-col justify-between" style={{ borderColor: 'var(--brand-title)', background: 'linear-gradient(180deg, #F9EED5 0%, #FBF3E3 50%, white 100%)', borderRadius: '1.5rem 1.5rem 0 0', height: '230px' }}>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Percorso 6 Mesi</h3>
                  <p className="text-sm mb-1 font-medium" style={{ color: 'var(--text-dark-green)' }}>Supporto completo & VIP</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(255, 182, 193, 0.2)', color: '#256943' }}>Gravidanza</span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(157, 207, 205, 0.2)', color: '#256943' }}>Sport</span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(232, 240, 216, 0.4)', color: '#256943' }}>Tutti</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-1" style={{ minHeight: '72px' }}>
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <span className="text-xl line-through opacity-70 font-semibold" style={{ color: 'var(--text-dark-green)' }}>510€</span>
                    <span className="text-5xl font-extrabold" style={{ color: 'var(--brand-title)' }}>450€</span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#256943' }}>6 Visite + Chat Diretta</p>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <ul className="space-y-4 mb-6 text-left flex-grow">
                  <li className="flex items-start gap-3">
                    <Icon name="video" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}><strong>6 Consulenze</strong> (1 al mese)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="messageCircle" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}><strong>Chat WhatsApp</strong> (Dubbi, foto, etichette)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="bookOpen" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}><strong>Libreria PDF</strong> (Fame nervosa, Meal Prep)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="gift" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Analisi etichette alimentari personalizzata</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="activity" size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-title)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-dark-green)' }}>Analisi e interpretazione esami del sangue</span>
                  </li>
                </ul>

                <div className="mb-4 p-3 rounded-lg text-xs" style={{ background: 'rgba(255, 182, 193, 0.15)', border: '1px solid rgba(255, 182, 193, 0.3)' }}>
                  <p className="font-bold mb-1" style={{ color: 'var(--brand-title)' }}>👶 Add-on Svezzamento</p>
                  <p style={{ color: 'var(--text-dark-green)' }}>Guida completa svezzamento vegano: <strong>+80€</strong> (invece di 120€)</p>
                </div>

                <Button
                  href="/prenota?type=6mesi"
                  className="w-full mt-auto"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  Scegli il Percorso VIP
                </Button>
              </div>
            </Card>
          </div>

          {/* SEZIONE EXTRA: PRODOTTO DIGITALE (SVEZZAMENTO) */}
          <div className="max-w-4xl mx-auto mt-20 mb-8">
            <div className="relative rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg overflow-hidden"
              style={{ background: 'white', border: '2px solid #F2E4C1' }}>

              {/* Badge "Novità" */}
              <div className="absolute top-4 right-4 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                PRODOTTO DIGITALE
              </div>

              {/* Icona/Immagine */}
              <div className="flex-shrink-0 w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F9EED5 0%, #F2E4C1 100%)' }}>
                <Icon name="bookOpen" size={40} variant="peach" />
              </div>

              {/* Testo */}
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>
                  Guida Completa allo Svezzamento Vegano
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-dark-green)' }}>
                  Preferisci fare da sola? Acquista la guida completa in PDF: menu settimanali,
                  tagli sicuri, gestione dei nutrienti critici e ricette. Tutto quello che ti serve per partire.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <span className="text-2xl font-bold" style={{ color: 'var(--brand-title)' }}>120€</span>
                  <Button
                    href="/prenota?type=guida-svezzamento"
                    size="sm"
                    style={{ background: 'var(--brand-title)', color: 'white' }}
                  >
                    Acquista Solo la Guida
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Nota informativa finale (Metodo personalizzato) */}
          <div className="text-center max-w-3xl mx-auto p-6 rounded-lg mb-12" style={{ background: 'rgba(255,255,255,0.7)' }}>
            <p className="text-sm flex items-center justify-center gap-2" style={{ color: 'var(--text-dark-green)' }}>
              <Icon name="heart" size={20} />
              <span>
                Ogni percorso è unico, come te. Non riceverai una dieta rigida, ma un progetto nutrizionale sostenibile,
                costruito sui tuoi gusti e sui ritmi della tua famiglia.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      {/* <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-hero) 100%)' }} /> */}

      {/* Corsi e Workshop (COMMENTATO) */}
      {/* <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>
            Corsi e Workshop
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 flex flex-col">
              <div className="mb-4">
                <Icon name="book" size={48} style={{ color: 'var(--brand-title)' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
                Corso "Diventa Vegano in 30 Giorni"
              </h3>
              <p className="mb-6" style={{ color: 'var(--text-darker)' }}>
                Un corso online completo con video-lezioni, ricette, 
                liste della spesa e supporto di gruppo per iniziare il tuo percorso vegano.
              </p>
              <div className="mb-6 flex-grow">
                <h4 className="font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Include:</h4>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-darker)' }}>
                  <li>• 20 video-lezioni (5 ore totali)</li>
                  <li>• 50+ ricette scaricabili</li>
                  <li>• Gruppo Facebook privato</li>
                  <li>• Q&A settimanali dal vivo</li>
                  <li>• Certificato di completamento</li>
                </ul>
              </div>
              <div className="mt-auto">
                <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(157, 207, 205, 0.1)', border: '2px solid var(--brand-title)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--brand-title)' }}>€97</div>
                  <div style={{ color: 'var(--text-darker)' }}>Accesso a vita</div>
                  <div className="text-sm mt-1" style={{ color: 'transparent' }}> </div>
                </div>
                <Button 
                  href="/contatti" 
                  className="w-full"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  Iscriviti al Corso
                </Button>
              </div>
            </Card>
            <Card className="p-8 flex flex-col">
              <div className="mb-4">
                <Icon name="users" size={48} style={{ color: 'var(--brand-title)' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
                Workshop "Cucina Vegana per Principianti"
              </h3>
              <p className="mb-6" style={{ color: 'var(--text-darker)' }}>
                Workshop pratici in presenza per imparare le basi della cucina vegana: 
                tecniche, ingredienti e preparazioni essenziali.
              </p>
              <div className="mb-6 flex-grow">
                <h4 className="font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Include:</h4>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-darker)' }}>
                  <li>• 4 ore di corso pratico</li>
                  <li>• Preparazione di 6 ricette</li>
                  <li>• Degustazione completa</li>
                  <li>• Ricettario cartaceo</li>
                  <li>• Lista ingredienti essenziali</li>
                </ul>
              </div>
              <div className="mt-auto">
                <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(157, 207, 205, 0.1)', border: '2px solid var(--brand-title)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--brand-title)' }}>€80</div>
                  <div style={{ color: 'var(--text-darker)' }}>Workshop singolo</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-darker)' }}>Prossima data: 15 Dicembre</div>
                </div>
                <Button 
                  href="/contatti" 
                  className="w-full"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  Prenota Posto
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-section-warm) 100%)' }} />

      {/* FAQ */}
      <section className="py-20" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Domande Frequenti</h2>
            <p className="text-xl" style={{ color: 'var(--brand-title)' }}>
              Le risposte alle domande più comuni sui miei servizi
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