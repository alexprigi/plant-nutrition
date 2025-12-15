# 📸 Guida per Inserire le Immagini Reali

## Posizioni delle immagini nel sito

### 1. Hero Section (Immagine principale fullscreen)
**Posizione**: `src/app/page.tsx` - linea ~35
**File da caricare**: `/public/images/nutritionist-hero.jpg`
**Dimensioni consigliate**: 1920x1080px (landscape)
**Soggetto**: Dott.ssa Arianna in studio o ambiente di lavoro professionale

**Come sostituire**:
```tsx
{/* Rimuovi il placeholder e decomenta questa riga: */}
<img 
  src="/images/nutritionist-hero.jpg" 
  alt="Dott.ssa Arianna Ciervo" 
  className="w-full h-full object-cover" 
/>
```

### 2. Studio/Cucina Section
**Posizione**: `src/app/page.tsx` - linea ~208
**File da caricare**: `/public/images/studio-kitchen.jpg`
**Dimensioni consigliate**: 800x600px (4:3)
**Soggetto**: Studio domestico con piante, setup professionale, ambiente di consulenza

**Come sostituire**:
```tsx
{/* Rimuovi il placeholder e decomenta questa riga: */}
<img 
  src="/images/studio-kitchen.jpg" 
  alt="Studio con piante" 
  className="w-full h-full object-cover" 
/>
```

## Consigli per le foto

### Foto Hero (principale)
- ✅ Luce naturale abbondante
- ✅ Ambiente pulito e professionale
- ✅ Sguardo diretto alla camera o leggermente di lato
- ✅ Abbigliamento professionale ma accogliente
- ✅ Possibilmente con piante o elementi naturali visibili
- ⚠️ Evitare flash diretto

### Foto Studio/Cucina
- ✅ Mostra l'ambiente di lavoro reale
- ✅ Piante ben visibili
- ✅ Strumenti di lavoro (laptop, bilancia, ecc.)
- ✅ Luce naturale
- ✅ Può essere senza persone o con la nutrizionista in azione
- ⚠️ Evitare troppo disordine

## Ottimizzazione immagini

Prima di caricare le immagini, ottimizzale per il web:

### Online (gratuito)
- [TinyPNG](https://tinypng.com/) - Compressione PNG/JPG
- [Squoosh](https://squoosh.app/) - Tool di Google

### Parametri consigliati
- Formato: JPG (per foto) o WebP (migliore qualità/peso)
- Qualità: 75-85%
- Risoluzione: 72 DPI
- Dimensione file: < 200KB per hero, < 150KB per studio

## Come caricare

1. Salva le immagini nella cartella `public/images/`
2. Apri `src/app/page.tsx`
3. Cerca i commenti `{/* Rimuovi il placeholder...`
4. Sostituisci il codice come indicato sopra
5. Salva il file

## Test

Dopo aver inserito le immagini:
1. Apri il sito in locale: `npm run dev`
2. Verifica che le immagini si carichino correttamente
3. Testa su mobile e desktop
4. Controlla la velocità di caricamento

## Effetti applicati

Le immagini hanno automaticamente:
- ✨ Effetto parallax sullo scroll (hero)
- 🎯 Hover con zoom leggero
- 📱 Responsive su tutti i dispositivi
- 🌈 Gradient overlay per leggibilità testo (hero)

## Backup

Mantieni sempre una copia delle immagini originali ad alta risoluzione!
