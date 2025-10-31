import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export const metadata = {
  title: 'Chi Sono - Dott.ssa Arianna Ciervo | Pura Essenza Vegetale',
  description: 'Scopri la storia della Dott.ssa Arianna Ciervo, biologa nutrizionista specializzata in alimentazione vegana e fondatrice di Pura Essenza Vegetale.',
};

export default function ChiSono() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Ciao, sono la Dott.ssa Arianna Ciervo
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Biologa Nutrizionista, fondatrice di Pura Essenza Vegetale, 
                con oltre 10 anni di esperienza nel guidare le persone verso 
                uno stile di vita più sano e sostenibile.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                La mia missione è dimostrare che l'alimentazione vegetale non è solo 
                una scelta etica, ma anche la via per il benessere ottimale.
              </p>
              <Button href="/contatti" size="lg">
                Prenota una Consulenza
              </Button>
            </div>
            <div className="relative">
              <div className="bg-green-200 rounded-full p-8 mx-auto w-80 h-80 flex items-center justify-center">
                <span className="text-6xl">👩‍⚕️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* La Mia Storia */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">La Mia Storia</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Il mio percorso verso la nutrizione vegana è iniziato più di 15 anni fa, 
              quando ho deciso di abbracciare uno stile di vita più consapevole e sostenibile. 
              Quello che è iniziato come una scelta personale si è trasformato nella mia passione professionale.
            </p>
            <p className="text-gray-600 mb-6">
              Durante i miei studi in Biologia e successivamente in Scienze dell'Alimentazione, 
              ho approfondito sempre di più i benefici dell'alimentazione plant-based, 
              scoprendo un mondo di possibilità nutrizionali che spesso viene sottovalutato.
            </p>
            <p className="text-gray-600 mb-6">
              Oggi, dopo aver seguito centinaia di pazienti nel loro percorso di transizione 
              verso un'alimentazione vegana, posso dire con certezza che questa scelta 
              porta benefici incredibili sia per la salute individuale che per quella del pianeta.
            </p>
          </div>
        </div>
      </section>

      {/* Formazione e Qualifiche */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Formazione e Qualifiche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-4">Laurea in Biologia</h3>
              <p className="text-gray-600 mb-2">Università degli Studi di Milano</p>
              <p className="text-gray-500">Voto: 110/110 con lode</p>
            </Card>

            <Card className="p-8">
              <div className="text-3xl mb-4">🍎</div>
              <h3 className="text-xl font-semibold mb-4">Specializzazione in Scienze dell'Alimentazione</h3>
              <p className="text-gray-600 mb-2">Università degli Studi di Pavia</p>
              <p className="text-gray-500">Master biennale</p>
            </Card>

            <Card className="p-8">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-4">Certificazione Plant-Based Nutrition</h3>
              <p className="text-gray-600 mb-2">T. Colin Campbell Center for Nutrition Studies</p>
              <p className="text-gray-500">Cornell University</p>
            </Card>

            <Card className="p-8">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-4">Formazione Continua</h3>
              <p className="text-gray-600 mb-2">Partecipazione regolare a congressi internazionali</p>
              <p className="text-gray-500">Aggiornamento costante sulle ricerche scientifiche</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Filosofia e Approccio */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Il Mio Approccio</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🔬</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Basato sulla Scienza</h3>
                    <p className="text-gray-600">
                      Ogni consiglio è supportato dalle più recenti ricerche scientifiche 
                      in ambito nutrizionale e di medicina preventiva.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">👤</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Personalizzato</h3>
                    <p className="text-gray-600">
                      Ogni piano nutrizionale è studiato specificatamente per te, 
                      considerando la tua storia, i tuoi obiettivi e le tue preferenze.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🤗</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Empatico e Supportivo</h3>
                    <p className="text-gray-600">
                      Ti accompagno passo dopo passo, senza giudizi, 
                      celebrando ogni piccolo progresso nel tuo percorso.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Sostenibile</h3>
                    <p className="text-gray-600">
                      Credo che prendersi cura di sé stessi significhi anche 
                      prendersi cura del nostro pianeta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-green-800 mb-6">La Mia Missione</h3>
              <blockquote className="text-lg text-green-700 italic mb-6">
                "Rendere l'alimentazione vegana accessibile, gustosa e nutrizionalmente 
                completa per tutti, dimostrando che è possibile vivere in salute 
                rispettando ogni forma di vita."
              </blockquote>
              <p className="text-green-600 font-semibold">- Dott.ssa Arianna Ciervo, Fondatrice di Pura Essenza Vegetale</p>
            </div>
          </div>
        </div>
      </section>

      {/* Esperienza Professionale */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Esperienza Professionale</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="border-l-4 border-green-500 pl-8">
                <div className="text-green-600 font-semibold">2020 - Presente</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Studio Privato di Nutrizione</h3>
                <p className="text-gray-600">
                  Consulenze nutrizionali specializzate in alimentazione vegana. 
                  Oltre 500 pazienti seguiti con successo nella transizione verso uno stile di vita plant-based.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-8">
                <div className="text-green-600 font-semibold">2018 - 2020</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Collaborazione con Centro Benessere "Vita Sana"</h3>
                <p className="text-gray-600">
                  Sviluppo di protocolli nutrizionali per pazienti con patologie metaboliche. 
                  Conduzione di workshop educativi sull'alimentazione consapevole.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-8">
                <div className="text-green-600 font-semibold">2015 - 2018</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ricerca presso Università di Milano</h3>
                <p className="text-gray-600">
                  Ricerca sui benefici cardiovascolari dell'alimentazione plant-based. 
                  Pubblicazione di 3 articoli su riviste scientifiche internazionali.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Vuoi Saperne di Più sul Mio Approccio?
          </h2>
          <p className="text-xl mb-8">
            Prenota una consulenza gratuita per scoprire come posso aiutarti 
            a raggiungere i tuoi obiettivi di salute e benessere.
          </p>
          <Button 
            href="/contatti" 
            variant="secondary" 
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            Prenota Consulenza Gratuita
          </Button>
        </div>
      </section>
    </div>
  );
}