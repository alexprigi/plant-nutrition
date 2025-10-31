import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Nutri il tuo corpo, 
                <span className="text-green-600"> rispetta il pianeta</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Benvenuto in Pura Essenza Vegetale, il centro specializzato in nutrizione vegana. 
                Sono la Dott.ssa Arianna Ciervo e ti accompagno verso uno stile di vita sano, equilibrato e sostenibile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contatti" size="lg">
                  Prenota Consulenza Gratuita
                </Button>
                <Button href="/chi-sono" variant="outline" size="lg">
                  Scopri di più
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-green-200 rounded-full p-8 mx-auto w-80 h-80 flex items-center justify-center">
                <span className="text-8xl">🥗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servizi Principali */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">I Miei Servizi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ogni percorso è personalizzato per le tue esigenze specifiche, 
              basato su evidenze scientifiche e amore per il benessere naturale.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="p-8 text-center">
              <div className="text-4xl mb-4">🥕</div>
              <h3 className="text-xl font-semibold mb-4">Consulenze Nutrizionali</h3>
              <p className="text-gray-600 mb-6">
                Piani alimentari personalizzati per ogni fase della vita, 
                dall'infanzia alla terza età.
              </p>
              <Button href="/servizi" variant="outline">
                Scopri di più
              </Button>
            </Card>

            <Card hover className="p-8 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-4">Educazione Alimentare</h3>
              <p className="text-gray-600 mb-6">
                Workshop e corsi per imparare a nutrirsi consapevolmente 
                e in modo sostenibile.
              </p>
              <Button href="/servizi" variant="outline">
                Scopri di più
              </Button>
            </Card>

            <Card hover className="p-8 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-4">Supporto Transizione</h3>
              <p className="text-gray-600 mb-6">
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

      {/* Perché Scegliere l'Alimentazione Vegana */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Perché Scegliere l'Alimentazione Vegana?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">💪</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Salute Ottimale</h3>
                    <p className="text-gray-600">
                      Riduzione del rischio di malattie cardiovascolari, diabete e alcuni tumori.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Sostenibilità Ambientale</h3>
                    <p className="text-gray-600">
                      Riduce l'impatto ambientale del 70% rispetto a diete omnivore.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">❤️</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Benessere Animale</h3>
                    <p className="text-gray-600">
                      Una scelta etica che rispetta la vita di tutti gli esseri senzienti.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">70%</div>
                <p className="text-gray-600">Riduzione impatto CO₂</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50%</div>
                <p className="text-gray-600">Meno rischio diabete</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
                <p className="text-gray-600">Riduzione malattie cardiache</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">+5</div>
                <p className="text-gray-600">Anni di vita in salute</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonianze */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cosa Dicono i Miei Pazienti</h2>
            <p className="text-xl text-gray-600">
              Le loro storie di trasformazione parlano più di mille parole.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="text-yellow-400 text-xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600 mb-4">
                "Grazie alla Dottoressa ho scoperto un mondo di sapori e energia che non sapevo esistesse. 
                La mia vita è cambiata in meglio!"
              </p>
              <div className="font-semibold">- Maria, 34 anni</div>
            </Card>

            <Card className="p-6">
              <div className="text-yellow-400 text-xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600 mb-4">
                "Professionale, empatica e sempre disponibile. I miei valori del sangue 
                sono migliorati incredibilmente in soli 3 mesi."
              </p>
              <div className="font-semibold">- Giuseppe, 45 anni</div>
            </Card>

            <Card className="p-6">
              <div className="text-yellow-400 text-xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600 mb-4">
                "Ho perso 15 kg senza rinunce, anzi mangiando di più! 
                Non tornerò mai indietro alla mia alimentazione precedente."
              </p>
              <div className="font-semibold">- Alessandra, 28 anni</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Finale */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto a Iniziare il Tuo Percorso di Benessere?
          </h2>
          <p className="text-xl mb-8">
            Prenota una consulenza gratuita di 30 minuti per scoprire come 
            l'alimentazione vegana può trasformare la tua vita.
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
