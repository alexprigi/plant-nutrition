import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export const metadata = {
  title: 'Chi Sono - Dott.ssa Arianna Ciervo | Pura Essenza Vegetale',
  description: 'Scopri la storia della Dott.ssa Arianna Ciervo, biologa nutrizionista specializzata in alimentazione vegana e fondatrice di Pura Essenza Vegetale.',
};

export default function ChiSono() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>
                Ciao, sono la Dott.ssa Arianna Ciervo
              </h1>
              <p className="text-xl mb-6" style={{ color: 'var(--color-main-dark)' }}>
                Biologa Nutrizionista, fondatrice di Pura Essenza Vegetale, 
                con oltre 10 anni di esperienza nel guidare le persone verso 
                uno stile di vita più sano e sostenibile.
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
              <div className="rounded-full p-8 mx-auto w-80 h-80 flex items-center justify-center" style={{ background: 'var(--color-main)' }}>
                <span className="text-6xl">👩‍⚕️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* La Mia Storia */}
      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--brand-title)' }}>La Mia Storia</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6" style={{ color: 'var(--color-main-dark)' }}>
              Il mio percorso verso la nutrizione vegana è iniziato più di 15 anni fa, 
              quando ho deciso di abbracciare uno stile di vita più consapevole e sostenibile. 
              Quello che è iniziato come una scelta personale si è trasformato nella mia passione professionale.
            </p>
            <p className="text-lg mb-6" style={{ color: 'var(--text-darker)' }}>
              Durante i miei studi in Biologia e successivamente in Scienze dell'Alimentazione, 
              ho approfondito sempre di più i benefici dell'alimentazione plant-based, 
              scoprendo un mondo di possibilità nutrizionali che spesso viene sottovalutato.
            </p>
            <p className="text-lg mb-6" style={{ color: 'var(--text-darker)' }}>
              Oggi, dopo aver seguito centinaia di pazienti nel loro percorso di transizione 
              verso un'alimentazione vegana, posso dire con certezza che questa scelta 
              porta benefici incredibili sia per la salute individuale che per quella del pianeta.
            </p>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-hero) 100%)' }} />

      {/* Formazione e Qualifiche */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>Formazione e Qualifiche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-4">Laurea in Biologia</h3>
              <p className="mb-2" style={{ color: 'var(--foreground)' }}>Università degli Studi di Milano</p>
              <p style={{ color: 'var(--color-main)' }}>Voto: 110/110 con lode</p>
            </Card>

            <Card className="p-8">
              <div className="text-3xl mb-4">🍎</div>
              <h3 className="text-xl font-semibold mb-4">Specializzazione in Scienze dell'Alimentazione</h3>
              <p className="mb-2" style={{ color: 'var(--foreground)' }}>Università degli Studi di Pavia</p>
              <p style={{ color: 'var(--color-main)' }}>Master biennale</p>
            </Card>

            <Card className="p-8">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-4">Certificazione Plant-Based Nutrition</h3>
              <p className="mb-2" style={{ color: 'var(--foreground)' }}>T. Colin Campbell Center for Nutrition Studies</p>
              <p style={{ color: 'var(--color-main)' }}>Cornell University</p>
            </Card>

            <Card className="p-8">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-4">Formazione Continua</h3>
              <p className="mb-2" style={{ color: 'var(--foreground)' }}>Partecipazione regolare a congressi internazionali</p>
              <p style={{ color: 'var(--color-main)' }}>Aggiornamento costante sulle ricerche scientifiche</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* Filosofia e Approccio */}
      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>Il Mio Approccio</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🔬</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Basato sulla Scienza</h3>
                    <p style={{ color: 'var(--text-darker)' }}>
                      Ogni consiglio è supportato dalle più recenti ricerche scientifiche 
                      in ambito nutrizionale e di medicina preventiva.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">👤</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Personalizzato</h3>
                    <p style={{ color: 'var(--text-darker)' }}>
                      Ogni piano nutrizionale è studiato specificatamente per te, 
                      considerando la tua storia, i tuoi obiettivi e le tue preferenze.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🤗</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Empatico e Supportivo</h3>
                    <p style={{ color: 'var(--text-darker)' }}>
                      Ti accompagno passo dopo passo, senza giudizi, 
                      celebrando ogni piccolo progresso nel tuo percorso.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🌍</div>
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
              <p className="font-semibold" style={{ color: 'var(--brand-title)' }}>- Dott.ssa Arianna Ciervo, Fondatrice di Pura Essenza Vegetale</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-section-warm) 100%)' }} />

      {/* Esperienza Professionale */}
      <section className="py-20" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>Esperienza Professionale</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="border-l-4 pl-8" style={{ borderColor: 'var(--color-main)' }}>
                <div className="font-semibold text-lg" style={{ color: 'var(--brand-title)' }}>2020 - Presente</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Studio Privato di Nutrizione</h3>
                <p style={{ color: 'var(--text-darker)' }}>
                  Consulenze nutrizionali specializzate in alimentazione vegana. 
                  Oltre 500 pazienti seguiti con successo nella transizione verso uno stile di vita plant-based.
                </p>
              </div>
              
              <div className="border-l-4 pl-8" style={{ borderColor: 'var(--color-main)' }}>
                <div className="font-semibold text-lg" style={{ color: 'var(--brand-title)' }}>2018 - 2020</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Collaborazione con Centro Benessere "Vita Sana"</h3>
                <p style={{ color: 'var(--text-darker)' }}>
                  Sviluppo di protocolli nutrizionali per pazienti con patologie metaboliche. 
                  Conduzione di workshop educativi sull'alimentazione consapevole.
                </p>
              </div>
              
              <div className="border-l-4 pl-8" style={{ borderColor: 'var(--color-main)' }}>
                <div className="font-semibold text-lg" style={{ color: 'var(--brand-title)' }}>2015 - 2018</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-title)' }}>Ricerca presso Università di Milano</h3>
                <p style={{ color: 'var(--text-darker)' }}>
                  Ricerca sui benefici cardiovascolari dell'alimentazione plant-based. 
                  Pubblicazione di 3 articoli su riviste scientifiche internazionali.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-warm) 0%, var(--bg-hero) 100%)' }} />

      {/* Call to Action */}
      <section className="py-24" style={{ background: 'var(--accent)', color: 'var(--foreground)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center rounded-3xl shadow-2xl bg-white/20 backdrop-blur-md py-16 border-2 border-white/20" style={{ boxShadow: '0 8px 40px 0 rgba(39, 89, 67, 0.18)' }}>
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight" style={{ color: 'white', textShadow: '0 2px 16px rgba(39,89,67,0.18)' }}>
            Vuoi Saperne di Più sul Mio Approccio?
          </h2>
          <p className="text-2xl mb-10 font-medium" style={{ color: 'white', textShadow: '0 1px 8px rgba(39,89,67,0.10)' }}>
            Prenota una consulenza gratuita per scoprire come posso aiutarti <br />
            a raggiungere i tuoi obiettivi di salute e benessere.
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
    </div>
  );
}