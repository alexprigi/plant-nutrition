# 📸 Guida Immagini - Viva Plant Nutrition

## 🗂️ Struttura Attuale

```
/public/images/
├── hero/                           # Slider homepage (5 immagini)
│   ├── nutritionist-hero.png
│   ├── vegan-food-colorful.png
│   ├── arianna-consultation.png
│   ├── plant-based-ingredients.png
│   └── arianna-pregnant.png
│
├── professional/                   # Foto professionali Arianna
│   ├── arianna-portrait.png       (800x800px, usata in Chi Sono)
│   └── arianna-pregnant.jpg       (usata in sezioni gravidanza)
│
├── plants/                         # Immagini decorative piante (9 immagini)
│
├── testimonials/                   # Foto testimonianze (con consenso GDPR)
│   └── TESTIMONIALS-IMAGES-README.md  (linee guida privacy)
│
├── recipes/                        # Immagini ricette (vuota per ora)
│
├── studio-arianna.png              # Foto studio principale (7.6MB - da ottimizzare!)
│
└── README.md                       # Documentazione generale
```

---

## 🎠 Slider Homepage (Hero Section)

**File**: `src/app/page.tsx` (righe 15-36)

Lo slider carica automaticamente **5 immagini** da `/public/images/hero/`:

```tsx
const heroImages = [
  '/images/hero/nutritionist-hero.png',
  '/images/hero/vegan-food-colorful.png',
  '/images/hero/arianna-consultation.png',
  '/images/hero/plant-based-ingredients.png',
  '/images/hero/arianna-pregnant.png'
];
```

### Funzionamento
- ⏱️ Cambia automaticamente ogni **5 secondi**
- ⏸️ Si ferma quando il mouse è sopra
- 🎯 Indicatori cliccabili per navigazione manuale
- 📱 Responsive su tutti i dispositivi
- 🎨 Effetto fade tra le transizioni

### Dimensioni consigliate
- **Formato**: PNG o JPG
- **Risoluzione**: 1920x1080px (16:9)
- **Peso**: Max 1-2MB per immagine
- **Ottimizzazione**: WebP automatica tramite Next.js Image

---

## 👤 Immagini Professionali

### Arianna Portrait
- **Path**: `/images/professional/arianna-portrait.png`
- **Dimensioni**: 800x800px (quadrata)
- **Uso**: Pagina Chi Sono, About sections
- **Peso attuale**: 8.1MB ⚠️ (da ottimizzare)

### Arianna Pregnant
- **Path**: `/images/professional/arianna-pregnant.jpg`
- **Dimensioni**: Variabile
- **Uso**: Sezioni gravidanza, specializzazioni
- **Peso**: 2.5MB

---

## 📋 Come Aggiungere Nuove Immagini

### 1. Immagini Hero (Homepage)
```bash
# 1. Salva l'immagine in:
/public/images/hero/nuova-immagine.png

# 2. Aggiungi allo slider in src/app/page.tsx:
const heroImages = [
  // ... immagini esistenti
  { src: '/images/hero/nuova-immagine.png', alt: 'Descrizione' }
];
```

### 2. Immagini Professional
```bash
# Salva in:
/public/images/professional/nome-file.jpg

# Usa nel codice:
<Image src="/images/professional/nome-file.jpg" alt="..." />
```

### 3. Immagini Ricette
```bash
# Salva in:
/public/images/recipes/nome-ricetta.jpg

# Naming convention:
protein-bowl.jpg
chickpea-burger.jpg
vegan-tiramisu.jpg
```

---

## 🎨 Linee Guida Fotografiche

### Stile Brand
- ✅ Luce naturale, luminose
- ✅ Colori caldi (verde, beige, legno)
- ✅ Atmosfera professionale ma accogliente
- ✅ Focus su natura, piante, benessere
- ❌ Evitare flash diretto
- ❌ Evitare sfondi scuri o grigi

### Soggetti
- 🌱 Piante e elementi naturali
- 🥗 Cibo vegano colorato e appetitoso
- 👩‍⚕️ Arianna in azione (consulenze, studio)
- 🤰 Focus su gravidanza e famiglia
- 📚 Materiali di lavoro (notebook, bilancia)

---

## ⚡ Ottimizzazione Immagini

### Strumenti Consigliati
- **Online**: [TinyPNG](https://tinypng.com/), [Squoosh](https://squoosh.app/)
- **CLI**: `npm run optimize-images` (se configurato)

### Parametri
- **Formato**: JPG per foto, PNG per grafiche, WebP per web
- **Qualità**: 75-85%
- **Risoluzione**: 72 DPI
- **Dimensione target**:
  - Hero: < 500KB
  - Professional: < 300KB
  - Recipes: < 200KB
  - Thumbnails: < 100KB

### ⚠️ Immagini da Ottimizzare Subito
```bash
# File troppo pesanti:
studio-arianna.png          # 7.6MB → ottimizza a ~500KB
arianna-portrait.png        # 8.1MB → ottimizza a ~300KB
arianna-consultation.png    # 10.2MB → ottimizza a ~500KB
plant-based-ingredients.png # 9.3MB → ottimizza a ~500KB
vegan-food-colorful.png     # 9.8MB → ottimizza a ~500KB
arianna-pregnant.png        # 8.9MB → ottimizza a ~500KB
```

---

## 🔐 Privacy e GDPR

### Foto Testimonianze
Consulta: `/public/images/testimonials/TESTIMONIALS-IMAGES-README.md`

**Regole**:
- ✅ Consenso scritto obbligatorio
- ✅ Consenso specifico per ogni uso (web, social)
- ✅ Possibilità di revoca
- ❌ Mai pubblicare foto di clienti senza consenso
- ❌ Minori: serve consenso di entrambi i genitori

---

## 📱 Next.js Image Component

Il progetto usa il componente `next/image` che ottimizza automaticamente:

```tsx
import Image from 'next/image'

<Image
  src="/images/hero/nutritionist-hero.png"
  alt="Arianna Ciervo"
  width={1920}
  height={1080}
  priority  // Per immagini above-the-fold
  quality={85}
/>
```

**Vantaggi**:
- 🚀 Lazy loading automatico
- 📦 Compressione WebP automatica
- 📐 Responsive images
- 🎯 Prevenzione layout shift

---

## ✅ Checklist Aggiunta Immagini

Quando aggiungi una nuova immagine:

- [ ] Ottimizzata per il web (< 500KB)
- [ ] Nome file descrittivo in kebab-case (`vegan-burger.jpg`)
- [ ] Salvata nella cartella corretta
- [ ] Alt text descrittivo nel codice
- [ ] Testata su mobile e desktop
- [ ] Se contiene persone: consenso GDPR ottenuto
- [ ] Backup originale ad alta risoluzione conservato

---

## 🔗 File Correlati

- `public/images/README.md` - Documentazione generale
- `public/images/professional/PROFESSIONAL-IMAGES-README.md` - Linee guida foto professionali
- `public/images/testimonials/TESTIMONIALS-IMAGES-README.md` - Privacy e GDPR

---

**Ultimo aggiornamento**: 4 Aprile 2025
