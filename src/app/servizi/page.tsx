import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export const metadata = {
  title: 'Servizi - Pura Essenza Vegetale | Consulenze Nutrizionali Vegane',
  description: 'Scopri tutti i servizi di Pura Essenza Vegetale: consulenze nutrizionali personalizzate, piani alimentari vegani, corsi di educazione alimentare e supporto per la transizione.',
};

export default function Servizi() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            I Nostri Servizi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Percorsi personalizzati per guidarti verso uno stile di vita vegano 
            sano, equilibrato e sostenibile. Ogni servizio di Pura Essenza Vegetale è pensato per le tue esigenze specifiche.
          </p>
        </div>
      </section>

      {/* Servizi Principali */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Consulenza Nutrizionale */}
            <Card className="p-8">
              <div className="text-4xl mb-4">🥕</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Consulenza Nutrizionale</h2>
              <p className="text-lg text-gray-600 mb-6">
                Un percorso completamente personalizzato per raggiungere i tuoi obiettivi di salute 
                attraverso un'alimentazione vegana bilanciata e gustosa.
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Cosa Include:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Analisi completa dello stato nutrizionale</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Piano alimentare personalizzato</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Lista della spesa e ricette</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Monitoraggio costante dei progressi</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Supporto WhatsApp per 30 giorni</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="text-2xl font-bold text-green-600">€120</div>
                <div className="text-green-600">Prima consulenza (90 minuti)</div>
                <div className="text-sm text-gray-500 mt-1">Controlli successivi €60 (45 minuti)</div>
              </div>
              
              <Button href="/contatti" className="w-full">
                Prenota Consulenza
              </Button>
            </Card>

            {/* Piano Transizione Graduale */}
            <Card className="p-8">
              <div className="text-4xl mb-4">🌱</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Piano Transizione Graduale</h2>
              <p className="text-lg text-gray-600 mb-6">
                Un percorso di 3 mesi per passare gradualmente ad un'alimentazione vegana, 
                senza stress e con il pieno controllo dei nutrienti.
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Il Percorso:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Mese 1: Eliminazione carni rosse</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Mese 2: Eliminazione carni bianche e pesce</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Mese 3: Eliminazione latticini e uova</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 3 consulenze di follow-up</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Ricettario personalizzato</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="text-2xl font-bold text-green-600">€300</div>
                <div className="text-green-600">Pacchetto completo 3 mesi</div>
                <div className="text-sm text-gray-500 mt-1">Risparmi €60 rispetto alle singole consulenze</div>
              </div>
              
              <Button href="/contatti" variant="outline" className="w-full">
                Scopri di Più
              </Button>
            </Card>
          </div>

          {/* Altri Servizi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <Card hover className="p-6">
              <div className="text-3xl mb-4">👶</div>
              <h3 className="text-xl font-semibold mb-4">Nutrizione Pediatrica Vegana</h3>
              <p className="text-gray-600 mb-4">
                Piani nutrizionali specifici per bambini e adolescenti vegani, 
                garantendo una crescita sana e ottimale.
              </p>
              <div className="text-lg font-bold text-green-600 mb-4">€150</div>
              <Button href="/contatti" variant="outline" size="sm" className="w-full">
                Informazioni
              </Button>
            </Card>

            <Card hover className="p-6">
              <div className="text-3xl mb-4">🤰</div>
              <h3 className="text-xl font-semibold mb-4">Nutrizione in Gravidanza</h3>
              <p className="text-gray-600 mb-4">
                Supporto nutrizionale specializzato per mamme vegane, 
                dalla pre-gravidanza all'allattamento.
              </p>
              <div className="text-lg font-bold text-green-600 mb-4">€140</div>
              <Button href="/contatti" variant="outline" size="sm" className="w-full">
                Informazioni
              </Button>
            </Card>

            <Card hover className="p-6">
              <div className="text-3xl mb-4">🏃‍♂️</div>
              <h3 className="text-xl font-semibold mb-4">Nutrizione Sportiva</h3>
              <p className="text-gray-600 mb-4">
                Piani alimentari vegani per atleti e sportivi, 
                per massimizzare performance e recupero.
              </p>
              <div className="text-lg font-bold text-green-600 mb-4">€130</div>
              <Button href="/contatti" variant="outline" size="sm" className="w-full">
                Informazioni
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Corsi e Workshop */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Corsi e Workshop
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Corso "Diventa Vegano in 30 Giorni"
              </h3>
              <p className="text-gray-600 mb-6">
                Un corso online completo con video-lezioni, ricette, 
                liste della spesa e supporto di gruppo per iniziare il tuo percorso vegano.
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Include:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 20 video-lezioni (5 ore totali)</li>
                  <li>• 50+ ricette scaricabili</li>
                  <li>• Gruppo Facebook privato</li>
                  <li>• Q&A settimanali dal vivo</li>
                  <li>• Certificato di completamento</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="text-2xl font-bold text-green-600">€97</div>
                <div className="text-green-600">Accesso a vita</div>
              </div>
              
              <Button href="/contatti" className="w-full">
                Iscriviti al Corso
              </Button>
            </Card>

            <Card className="p-8">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Workshop "Cucina Vegana per Principianti"
              </h3>
              <p className="text-gray-600 mb-6">
                Workshop pratici in presenza per imparare le basi della cucina vegana: 
                tecniche, ingredienti e preparazioni essenziali.
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Include:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 4 ore di corso pratico</li>
                  <li>• Preparazione di 6 ricette</li>
                  <li>• Degustazione completa</li>
                  <li>• Ricettario cartaceo</li>
                  <li>• Lista ingredienti essenziali</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="text-2xl font-bold text-green-600">€80</div>
                <div className="text-green-600">Workshop singolo</div>
                <div className="text-sm text-gray-500 mt-1">Prossima data: 15 Dicembre</div>
              </div>
              
              <Button href="/contatti" variant="outline" className="w-full">
                Prenota Posto
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Come Lavoriamo Insieme
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Consulenza Iniziale</h3>
              <p className="text-gray-600">
                Analizziamo insieme la tua situazione attuale, 
                i tuoi obiettivi e le tue preferenze alimentari.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Piano Personalizzato</h3>
              <p className="text-gray-600">
                Creo un piano nutrizionale specifico per te, 
                con ricette, liste della spesa e consigli pratici.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Supporto Costante</h3>
              <p className="text-gray-600">
                Ti accompagno nel percorso con controlli regolari 
                e supporto quotidiano via WhatsApp.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">4️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Risultati Duraturi</h3>
              <p className="text-gray-600">
                Raggiungiamo insieme i tuoi obiettivi 
                e costruiamo abitudini che dureranno nel tempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Domande Frequenti
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Le consulenze sono disponibili anche online?
              </h3>
              <p className="text-gray-600">
                Sì, offro consulenze sia in presenza nel mio studio che online via video-chiamata. 
                L'efficacia del percorso è la stessa in entrambe le modalità.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Quanto tempo ci vuole per vedere i primi risultati?
              </h3>
              <p className="text-gray-600">
                I primi benefici si notano già dopo 2-3 settimane: più energia, 
                migliore digestione e senso di benessere generale. I risultati a lungo termine 
                dipendono dagli obiettivi specifici.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                È adatta anche a chi fa sport a livello agonistico?
              </h3>
              <p className="text-gray-600">
                Assolutamente sì! Ho seguito diversi atleti professionisti nella transizione 
                verso l'alimentazione vegana, con risultati eccellenti in termini di performance e recupero.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Cosa succede se non riesco a seguire il piano alimentare?
              </h3>
              <p className="text-gray-600">
                Nessun problema! Il piano è sempre flessibile e adattabile. 
                Durante i controlli valutiamo insieme le difficoltà e modifichiamo il percorso 
                per renderlo più sostenibile per te.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto a Iniziare il Tuo Percorso?
          </h2>
          <p className="text-xl mb-8">
            Prenota una consulenza gratuita di 30 minuti per parlare dei tuoi obiettivi 
            e scoprire quale servizio è più adatto a te.
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