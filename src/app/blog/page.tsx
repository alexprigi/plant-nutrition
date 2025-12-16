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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>
            Blog & Articoli
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-main-dark)' }}>
            Consigli pratici, ricette deliziose e approfondimenti scientifici 
            per vivere al meglio la tua alimentazione vegana.
          </p>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* Filtri Categorie */}
      <section className="py-8 border-b" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categorie.map((categoria) => (
              <button
                key={categoria}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoria === "Tutti" 
                    ? "bg-[var(--color-main)] text-[var(--color-main-dark)] hover:bg-[var(--color-main-dark)] hover:text-white" 
                    : "bg-[var(--background)] text-[var(--color-main-dark)] hover:bg-[var(--color-main)] hover:text-white"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-hero) 100%)' }} />

      {/* Articolo in Evidenza */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>
            Articolo in Evidenza
          </h2>
          <Card hover className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 flex items-center justify-center" style={{ background: 'var(--color-main-light)' }}>
                <span className="text-8xl">{articoli[0].immagine}</span>
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: 'var(--color-main-light)', color: 'var(--color-main-dark)' }}>
                    {articoli[0].categoria}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-darker)' }}>{articoli[0].data}</span>
                  <span className="text-sm" style={{ color: 'var(--text-darker)' }}>• {articoli[0].tempoLettura} di lettura</span>
                </div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
                  {articoli[0].titolo}
                </h3>
                <p className="text-lg mb-6" style={{ color: 'var(--text-darker)' }}>
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

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* Griglia Articoli */}
      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>
            Tutti gli Articoli
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articoli.slice(1).map((articolo) => (
              <Card key={articolo.id} hover className="overflow-hidden">
                <div className="p-8 text-center" style={{ background: 'var(--color-main-light)' }}>
                  <span className="text-4xl">{articolo.immagine}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: 'var(--color-main-light)', color: 'var(--color-main-dark)' }}>
                      {articolo.categoria}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-darker)' }}>{articolo.tempoLettura}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--brand-title)' }}>
                    {articolo.titolo}
                  </h3>
                  <p className="mb-4 text-sm" style={{ color: 'var(--text-darker)' }}>
                    {articolo.descrizione}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-darker)' }}>{articolo.data}</span>
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

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--accent) 100%)' }} />

      {/* Newsletter */}
      <section className="py-20" style={{ background: 'var(--accent)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'white' }}>
            Iscriviti alla Newsletter
          </h2>
          <p className="text-xl mb-8" style={{ color: 'white' }}>
            Ricevi ogni settimana ricette, consigli nutrizionali e articoli 
            per vivere al meglio la tua alimentazione vegana.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="La tua email"
                className="flex-1 px-4 py-3 rounded-full"
                style={{ color: 'var(--color-main-dark)', background: 'var(--color-main-light)', border: 'none' }}
              />
              <Button 
                variant="secondary" 
                className="bg-white text-[var(--accent)] hover:bg-[var(--color-main-light)] hover:text-[var(--color-main-dark)]"
              >
                Iscriviti
              </Button>
            </div>
            <p className="text-sm mt-4" style={{ color: 'white' }}>
              Niente spam, solo contenuti di valore. Puoi cancellarti quando vuoi.
            </p>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--accent) 0%, var(--bg-section-warm) 100%)' }} />

      {/* Risorse Gratuite */}
      <section className="py-20" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>
            Risorse Gratuite
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--brand-title)' }}>Guida alla Transizione</h3>
              <p className="mb-6" style={{ color: 'var(--foreground)' }}>
                PDF gratuito con tutto quello che devi sapere per passare 
                all'alimentazione vegana in modo graduale e sicuro.
              </p>
              <Button variant="outline">
                Scarica Gratis
              </Button>
            </Card>
            <Card hover className="p-8 text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--brand-title)' }}>Menu Settimanale</h3>
              <p className="mb-6" style={{ color: 'var(--foreground)' }}>
                Un menu completo di 7 giorni con ricette bilanciate, 
                lista della spesa e valori nutrizionali.
              </p>
              <Button variant="outline">
                Scarica Gratis
              </Button>
            </Card>
            <Card hover className="p-8 text-center">
              <div className="text-4xl mb-4">🥘</div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--brand-title)' }}>10 Ricette Veloci</h3>
              <p className="mb-6" style={{ color: 'var(--foreground)' }}>
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