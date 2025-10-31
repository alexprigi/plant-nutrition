import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export const metadata = {
  title: 'Blog - Pura Essenza Vegetale | Articoli e Consigli Nutrizione Vegana',
  description: 'Scopri articoli, ricette e consigli pratici per un\'alimentazione vegana sana e bilanciata. Guide, suggerimenti e approfondimenti scientifici dal team di Pura Essenza Vegetale.',
};

export default function Blog() {
  // Simuliamo alcuni articoli del blog
  const articoli = [
    {
      id: 1,
      titolo: "10 Superfood Vegani che Devi Conoscere",
      descrizione: "Scopri gli alimenti vegetali più nutrienti per potenziare la tua salute e il tuo benessere quotidiano.",
      data: "15 Novembre 2024",
      categoria: "Nutrizione",
      immagine: "🥬",
      tempoLettura: "5 min"
    },
    {
      id: 2,
      titolo: "Come Sostituire le Proteine Animali",
      descrizione: "Una guida completa per garantire un apporto proteico ottimale con fonti vegetali complete e bilanciate.",
      data: "8 Novembre 2024",
      categoria: "Guide Pratiche",
      immagine: "🥜",
      tempoLettura: "8 min"
    },
    {
      id: 3,
      titolo: "Ricetta: Buddha Bowl Proteica",
      descrizione: "Una ricetta completa e bilanciata per un pasto vegano ricco di nutrienti e sapore.",
      data: "1 Novembre 2024",
      categoria: "Ricette",
      immagine: "🥗",
      tempoLettura: "3 min"
    },
    {
      id: 4,
      titolo: "Vitamina B12: Tutto Quello che Devi Sapere",
      descrizione: "Approfondimento scientifico su questa vitamina essenziale per chi segue un'alimentazione vegana.",
      data: "25 Ottobre 2024",
      categoria: "Scienza",
      immagine: "💊",
      tempoLettura: "10 min"
    },
    {
      id: 5,
      titolo: "Transizione Vegana: I Primi Passi",
      descrizione: "Consigli pratici per iniziare il tuo percorso verso un'alimentazione 100% vegetale senza stress.",
      data: "18 Ottobre 2024",
      categoria: "Lifestyle",
      immagine: "🌱",
      tempoLettura: "6 min"
    },
    {
      id: 6,
      titolo: "Alimentazione Vegana per Bambini",
      descrizione: "Come garantire una crescita sana ai più piccoli con un'alimentazione vegana bilanciata.",
      data: "10 Ottobre 2024",
      categoria: "Famiglia",
      immagine: "👶",
      tempoLettura: "7 min"
    }
  ];

  const categorie = ["Tutti", "Nutrizione", "Ricette", "Guide Pratiche", "Scienza", "Lifestyle", "Famiglia"];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Blog & Articoli
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Consigli pratici, ricette deliziose e approfondimenti scientifici 
            per vivere al meglio la tua alimentazione vegana.
          </p>
        </div>
      </section>

      {/* Filtri Categorie */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categorie.map((categoria) => (
              <button
                key={categoria}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoria === "Tutti" 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articolo in Evidenza */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Articolo in Evidenza
          </h2>
          
          <Card hover className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-green-100 p-12 flex items-center justify-center">
                <span className="text-8xl">{articoli[0].immagine}</span>
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {articoli[0].categoria}
                  </span>
                  <span className="text-gray-500 text-sm">{articoli[0].data}</span>
                  <span className="text-gray-500 text-sm">• {articoli[0].tempoLettura} di lettura</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {articoli[0].titolo}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {articoli[0].descrizione}
                </p>
                <Button>
                  Leggi Articolo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Griglia Articoli */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Tutti gli Articoli
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articoli.slice(1).map((articolo) => (
              <Card key={articolo.id} hover className="overflow-hidden">
                <div className="bg-green-100 p-8 text-center">
                  <span className="text-4xl">{articolo.immagine}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {articolo.categoria}
                    </span>
                    <span className="text-gray-500 text-xs">{articolo.tempoLettura}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {articolo.titolo}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {articolo.descrizione}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{articolo.data}</span>
                    <Button size="sm" variant="outline">
                      Leggi
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Iscriviti alla Newsletter
          </h2>
          <p className="text-xl mb-8">
            Ricevi ogni settimana ricette, consigli nutrizionali e articoli 
            per vivere al meglio la tua alimentazione vegana.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="La tua email"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button 
                variant="secondary" 
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                Iscriviti
              </Button>
            </div>
            <p className="text-green-100 text-sm mt-4">
              Niente spam, solo contenuti di valore. Puoi cancellarti quando vuoi.
            </p>
          </div>
        </div>
      </section>

      {/* Risorse Gratuite */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Risorse Gratuite
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-4">Guida alla Transizione</h3>
              <p className="text-gray-600 mb-6">
                PDF gratuito con tutto quello che devi sapere per passare 
                all'alimentazione vegana in modo graduale e sicuro.
              </p>
              <Button variant="outline">
                Scarica Gratis
              </Button>
            </Card>

            <Card hover className="p-8 text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-4">Menu Settimanale</h3>
              <p className="text-gray-600 mb-6">
                Un menu completo di 7 giorni con ricette bilanciate, 
                lista della spesa e valori nutrizionali.
              </p>
              <Button variant="outline">
                Scarica Gratis
              </Button>
            </Card>

            <Card hover className="p-8 text-center">
              <div className="text-4xl mb-4">🥘</div>
              <h3 className="text-xl font-semibold mb-4">10 Ricette Veloci</h3>
              <p className="text-gray-600 mb-6">
                Ricette vegane pronte in 15 minuti per quando hai poco tempo 
                ma non vuoi rinunciare alla qualità.
              </p>
              <Button variant="outline">
                Scarica Gratis
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}