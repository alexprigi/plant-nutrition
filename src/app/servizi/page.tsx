import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export const metadata = {
  title: 'Servizi - Pura Essenza Vegetale | Consulenze Nutrizionali Vegane',
  description: 'Scopri tutti i servizi di Pura Essenza Vegetale: consulenze nutrizionali personalizzate, piani alimentari vegani, corsi di educazione alimentare e supporto per la transizione.',
};

export default function Servizi() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

      {/* Servizi Principali */}
      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Consulenza Nutrizionale */}
            <Card className="p-8">
              <div className="text-4xl mb-4">🌿</div>
              <h2 className="text-3xl font-bold mb-4">Consulenza Nutrizionale</h2>
              <p className="text-lg mb-6" style={{ color: 'var(--foreground)' }}>
                Un percorso completamente personalizzato per raggiungere i tuoi obiettivi di salute 
                attraverso un'alimentazione vegana bilanciata e gustosa.
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Cosa Include:</h3>
                <ul className="space-y-2" style={{ color: 'var(--foreground)' }}>
                  <li className="flex items-center"><span className="mr-2" style={{ color: 'var(--brand-title)' }}>✓</span> Analisi completa dello stato nutrizionale</li>
                  <li className="flex items-center"><span className="mr-2" style={{ color: 'var(--brand-title)' }}>✓</span> Piano alimentare personalizzato</li>
                  <li className="flex items-center"><span className="mr-2" style={{ color: 'var(--brand-title)' }}>✓</span> Lista della spesa e ricette</li>
                  <li className="flex items-center"><span className="mr-2" style={{ color: 'var(--brand-title)' }}>✓</span> Monitoraggio costante dei progressi</li>
                  <li className="flex items-center"><span className="mr-2" style={{ color: 'var(--brand-title)' }}>✓</span> Supporto WhatsApp per 30 giorni</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(157, 207, 205, 0.1)', border: '2px solid var(--brand-title)' }}>
                <div className="text-2xl font-bold" style={{ color: 'white' }}>€120</div>
                <div style={{ color: 'var(--foreground)' }}>Prima consulenza (90 minuti)</div>
                <div className="text-sm mt-1" style={{ color: 'var(--foreground)' }}>Controlli successivi €60 (45 minuti)</div>
              </div>
              
              <Button href="/contatti" variant="outline" className="w-full !bg-white !text-[var(--brand-title)] !border-[var(--brand-title)]">
                Prenota Consulenza
              </Button>
            </Card>

            {/* Piano Transizione Graduale */}
            <Card className="p-8">
              <div className="text-4xl mb-4">🌱</div>
              <h2 className="text-3xl font-bold mb-4">Piano Transizione Graduale</h2>
              <p className="text-lg mb-6" style={{ color: 'var(--foreground)' }}>
                Un percorso di 3 mesi per passare gradualmente ad un'alimentazione vegana, 
                senza stress e con il pieno controllo dei nutrienti.
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Il Percorso:</h3>
                <ul className="space-y-2" style={{ color: 'var(--foreground)' }}>
                  <li className="flex items-center"><span className="mr-2" style={{ color: 'var(--brand-title)' }}>✓</span> Mese 1: Eliminazione carni rosse</li>
                  <li className="flex items-center"><span className="mr-2" style={{ color: 'var(--brand-title)' }}>✓</span> Mese 2: Eliminazione carni bianche e pesce</li>
                  <li className="flex items-center"><span className="mr-2" style={{ color: 'var(--brand-title)' }}>✓</span> Mese 3: Eliminazione latticini e uova</li>
                  <li className="flex items-center"><span className="mr-2" style={{ color: 'var(--brand-title)' }}>✓</span> 3 consulenze di follow-up</li>
                  <li className="flex items-center"><span className="mr-2" style={{ color: 'var(--brand-title)' }}>✓</span> Ricettario personalizzato</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(157, 207, 205, 0.1)', border: '2px solid var(--brand-title)' }}>
                <div className="text-2xl font-bold" style={{ color: 'white' }}>€300</div>
                <div style={{ color: 'var(--foreground)' }}>Pacchetto completo 3 mesi</div>
                <div className="text-sm mt-1" style={{ color: 'var(--foreground)' }}>Risparmi €60 rispetto alle singole consulenze</div>
              </div>
              
              <Button href="/contatti" variant="outline" className="w-full !bg-transparent !text-white !border-white hover:!bg-white hover:!text-[var(--brand-title)]">
                Scopri di Più
              </Button>
            </Card>
          </div>

          {/* Altri Servizi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">

            <Card hover className="p-6 flex flex-col">
              <div className="text-3xl mb-4">💚</div>
              <h3 className="text-xl font-semibold mb-4">Gestione Patologie</h3>
              <p className="mb-6 flex-grow" style={{ color: 'var(--foreground)' }}>
                Supporto nutrizionale per la gestione di patologie croniche come diabete, 
                ipertensione e problemi cardiovascolari attraverso l'alimentazione vegana.
              </p>
              <div className="mt-auto">
                <div className="text-lg font-bold mb-4" style={{ color: 'white' }}>€150</div>
                <Button href="/contatti" variant="outline" size="sm" className="w-full !bg-transparent !text-white !border-white hover:!bg-white hover:!text-[var(--brand-title)]">
                  Informazioni
                </Button>
              </div>
            </Card>


            <Card hover className="p-6 flex flex-col">
              <div className="text-3xl mb-4">🤰</div>
              <h3 className="text-xl font-semibold mb-4">Nutrizione in Gravidanza</h3>
              <p className="mb-6 flex-grow" style={{ color: 'var(--foreground)' }}>
                Supporto nutrizionale specializzato per mamme vegane, 
                dalla pre-gravidanza all'allattamento.
              </p>
              <div className="mt-auto">
                <div className="text-lg font-bold mb-4" style={{ color: 'white' }}>€140</div>
                <Button href="/contatti" variant="outline" size="sm" className="w-full !bg-transparent !text-white !border-white hover:!bg-white hover:!text-[var(--brand-title)]">
                  Informazioni
                </Button>
              </div>
            </Card>


            <Card hover className="p-6 flex flex-col">
              <div className="text-3xl mb-4">🏃‍♀️</div>
              <h3 className="text-xl font-semibold mb-4">Nutrizione Sportiva</h3>
              <p className="mb-6 flex-grow" style={{ color: 'var(--foreground)' }}>
                Piani alimentari vegani per atleti e sportivi, 
                per massimizzare performance e recupero.
              </p>
              <div className="mt-auto">
                <div className="text-lg font-bold mb-4" style={{ color: 'white' }}>€130</div>
                <Button href="/contatti" variant="outline" size="sm" className="w-full !bg-transparent !text-white !border-white hover:!bg-white hover:!text-[var(--brand-title)]">
                  Informazioni
                </Button>
              </div>
            </Card>
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
              <div className="text-4xl mb-4">📚</div>
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
              <div className="text-4xl mb-4">👥</div>
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
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-main-light)' }}>
                <span className="text-2xl" style={{ color: 'var(--brand-title)' }}>1️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Consulenza Iniziale</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Analizziamo insieme la tua situazione attuale, 
                i tuoi obiettivi e le tue preferenze alimentari.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-main-light)' }}>
                <span className="text-2xl" style={{ color: 'var(--brand-title)' }}>2️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Piano Personalizzato</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Creo un piano nutrizionale specifico per te, 
                con ricette, liste della spesa e consigli pratici.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-main-light)' }}>
                <span className="text-2xl" style={{ color: 'var(--brand-title)' }}>3️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Supporto Costante</h3>
              <p style={{ color: 'var(--text-darker)' }}>
                Ti accompagno nel percorso con controlli regolari 
                e supporto quotidiano via WhatsApp.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-main-light)' }}>
                <span className="text-2xl" style={{ color: 'var(--brand-title)' }}>4️⃣</span>
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