'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Categorie ricette
const categories = [
  { name: 'Tutte', slug: 'all' },
  { name: 'Colazione', slug: 'breakfast' },
  { name: 'Pranzo', slug: 'lunch' },
  { name: 'Cena', slug: 'dinner' },
  { name: 'Snack', slug: 'snack' },
  { name: 'Dolci', slug: 'dessert' },
  { name: 'Gravidanza', slug: 'pregnancy' },
  { name: 'Bambini', slug: 'kids' },
];

// Ricette di esempio - in futuro da database o CMS
const recipes = [
  {
    id: 1,
    title: 'Bowl Proteica per la Colazione',
    category: 'breakfast',
    tags: ['pregnancy', 'high-protein'],
    image: '/images/recipes/protein-bowl.jpg',
    prepTime: '10 min',
    difficulty: 'Facile',
    servings: 2,
    description: 'Una colazione completa e bilanciata, ricca di proteine vegetali, omega-3 e vitamine essenziali. Perfetta per le mamme in attesa!',
    calories: 420,
  },
  {
    id: 2,
    title: 'Burger di Ceci e Quinoa',
    category: 'lunch',
    tags: ['kids', 'high-protein'],
    image: '/images/recipes/chickpea-burger.jpg',
    prepTime: '30 min',
    difficulty: 'Media',
    servings: 4,
    description: 'Burger vegetali croccanti fuori e morbidi dentro, piacerà anche ai bambini! Ricchi di proteine e ferro.',
    calories: 380,
  },
  {
    id: 3,
    title: 'Curry di Lenticchie Rosse',
    category: 'dinner',
    tags: ['easy', 'high-protein'],
    image: '/images/recipes/lentil-curry.jpg',
    prepTime: '25 min',
    difficulty: 'Facile',
    servings: 4,
    description: 'Un piatto caldo, nutriente e speziato. Le lenticchie rosse sono una fonte eccellente di proteine e ferro.',
    calories: 340,
  },
  {
    id: 4,
    title: 'Energy Balls al Cioccolato',
    category: 'snack',
    tags: ['pregnancy', 'kids', 'quick'],
    image: '/images/recipes/energy-balls.jpg',
    prepTime: '15 min',
    difficulty: 'Facile',
    servings: 12,
    description: 'Snack energetico senza cottura, perfetto per uno spuntino sano. Con datteri, mandorle e cacao.',
    calories: 120,
  },
  {
    id: 5,
    title: 'Pasta Cremosa con Broccoli',
    category: 'lunch',
    tags: ['kids', 'calcium'],
    image: '/images/recipes/creamy-broccoli-pasta.jpg',
    prepTime: '20 min',
    difficulty: 'Facile',
    servings: 4,
    description: 'Una pasta cremosa senza panna, ricca di calcio e vitamina K. I bambini la adorano!',
    calories: 450,
  },
  {
    id: 6,
    title: 'Brownies al Cioccolato e Fagioli Neri',
    category: 'dessert',
    tags: ['kids', 'hidden-veggies'],
    image: '/images/recipes/black-bean-brownies.jpg',
    prepTime: '40 min',
    difficulty: 'Media',
    servings: 12,
    description: 'Brownies super cioccolatosi con un segreto: fagioli neri! Nessuno se ne accorgerà, promesso.',
    calories: 180,
  },
];

export default function Ricette() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-hero)' }}>
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full opacity-12" 
          style={{ background: 'var(--color-main)', transform: 'translate(35%, -35%)' }}
        />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-15" 
          style={{ background: 'var(--brand-title)', transform: 'translate(-35%, 35%)' }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="text-5xl">🍽️</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>
            Ricette Vegane Bilanciate
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
            Piatti gustosi e nutrienti per tutta la famiglia. Ogni ricetta è studiata per garantire 
            un apporto bilanciato di tutti i nutrienti essenziali.
          </p>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      {/* Filtri per categoria */}
      <section className="py-8" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.slug}
                className="px-6 py-2 rounded-full transition-all font-medium hover:scale-105"
                style={{
                  background: category.slug === 'all' ? 'var(--brand-title)' : 'white',
                  color: category.slug === 'all' ? 'white' : 'var(--text-dark-green)',
                  border: `2px solid ${category.slug === 'all' ? 'var(--brand-title)' : 'var(--color-main-light)'}`,
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Griglia ricette */}
      <section className="py-12" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-xl transition-shadow" style={{ background: 'white', borderRadius: '1rem' }}>
                {/* Immagine ricetta */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback placeholder
                      e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23E6EFCC' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%234A5D23' font-size='24' font-family='Arial'%3E${encodeURIComponent(recipe.title)}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                  
                  {/* Badge difficoltà */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold" style={{ background: 'white', color: 'var(--brand-title)' }}>
                    {recipe.difficulty}
                  </div>
                </div>

                {/* Contenuto */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-title)' }}>
                    {recipe.title}
                  </h3>

                  <p className="text-sm mb-4" style={{ color: 'var(--text-dark-green)' }}>
                    {recipe.description}
                  </p>

                  {/* Info rapide */}
                  <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: 'var(--text-dark-green)' }}>
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{recipe.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>👥</span>
                      <span>{recipe.servings} persone</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🔥</span>
                      <span>{recipe.calories} kcal</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.includes('pregnancy') && (
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#F4E5C2', color: 'var(--brand-title)' }}>
                        🤰 Gravidanza
                      </span>
                    )}
                    {recipe.tags.includes('kids') && (
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#E6EFCC', color: 'var(--brand-title)' }}>
                        👶 Bambini
                      </span>
                    )}
                    {recipe.tags.includes('high-protein') && (
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--color-main-light)', color: 'var(--text-dark-green)' }}>
                        💪 Proteico
                      </span>
                    )}
                  </div>

                  <Button
                    href={`/ricette/${recipe.id}`}
                    className="w-full"
                    style={{ background: 'var(--brand-title)', color: 'white' }}
                  >
                    Vedi Ricetta Completa
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Newsletter ricette */}
          <div className="mt-16 text-center p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--bg-hero) 0%, #F4E5C2 100%)' }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
              Ricevi Nuove Ricette Ogni Settimana
            </h3>
            <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-dark-green)' }}>
              Iscriviti alla newsletter di Pura Essenza Vegetale e ricevi ricette esclusive, 
              consigli nutrizionali e idee per menu settimanali bilanciati.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="La tua email"
                className="flex-1 px-4 py-3 rounded-lg border-2"
                style={{ borderColor: 'var(--color-main)', outline: 'none' }}
              />
              <Button
                type="submit"
                style={{ background: 'var(--brand-title)', color: 'white', whiteSpace: 'nowrap' }}
              >
                Iscriviti Gratis
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
