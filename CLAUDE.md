# Viva Plant Nutrition - Linee Guida per Claude

## Overview

Sito web professionale per Arianna Ciervo, nutrizionista specializzata in alimentazione plant-based. Next.js app con sistema di prenotazione consultazioni.

## Struttura Progetto

```
/src
  /app                  # Next.js App Router
    /api               # API routes
    /(pages)           # Pagine pubbliche
    /admin             # Dashboard amministratore
  /components          # Componenti React
    /layout            # Header, Footer
    /ui                # Button, Card, ecc.
  /lib                 # Utilities e servizi
    constants.ts       # Liste paesi, prefissi telefonici
    bookingService.ts  # Logica prenotazioni
    prisma.ts          # Client Prisma
    email.ts           # Servizio email (Resend)
    /email-templates   # Template email HTML
/public
  /images              # Immagini statiche (vedi IMAGE-SETUP.md)
```

## Regole Generali

### Stato Attuale Funzionalità

**Funzionante e Setup:**
- Email tramite Resend (configurato e funzionante)
- Sistema prenotazioni con Prisma/PostgreSQL
- Tutte le pagine pubbliche (servizi, chi sono, contatti, prenota, ecc.)
- Chat/chatbot - funzionante (pattern matching client-side, italiano)

**Work in Progress (non completate):**
- `/ricette` - sezione ricette non ancora pronta
- `/blog` - sezione blog non ancora pronta

### Convenzioni Codice

- **TypeScript strict**: sempre tipizzare correttamente
- **File naming**: kebab-case per file, PascalCase per componenti React
- **Imports**: sempre path relativi da `@/` (configurato in tsconfig)
- **Componenti**: preferire function components con TypeScript
- **Styling**: Tailwind CSS (no CSS modules o styled-components)

### Storage e Dati

**IMPORTANTE**: Il progetto usa **Prisma + PostgreSQL** per salvare:
- Clienti
- Prenotazioni (bookings)
- Appuntamenti (appointments)
- Subscription/pacchetti

Vedi `src/lib/prisma.ts` per il client Prisma e `prisma/schema.prisma` per lo schema.

**Nota**: La migrazione da localStorage a database è completata. Non usare localStorage per dati applicativi.

### Immagini

Vedi il file dedicato [IMAGE-SETUP.md](IMAGE-SETUP.md) per:
- Struttura cartelle /public/images
- Come gestire lo slider homepage
- Linee guida GDPR per foto testimonianze
- Ottimizzazione immagini

**TL;DR**: Usa sempre `next/image` component, ottimizza prima di caricare, rispetta privacy GDPR.

### Email

Il sistema email è configurato e funzionante tramite **Resend**.

File rilevanti:
- `src/lib/email.ts` - servizio principale
- `src/lib/email-templates/` - template HTML per email
- `src/app/api/send-booking-emails/route.ts` - API endpoint

Chiavi configurate in variabili ambiente (Resend API key).

### API Routes

Tutte in `/src/app/api/`:
- `/api/bookings` - Gestione prenotazioni
- `/api/validate-booking` - Validazione form prenotazione
- `/api/send-booking-emails` - Invio email conferma

## Best Practices

### Quando Modificare Codice

1. **Leggere sempre prima** il file esistente con Read tool
2. **Usare Edit tool** per modifiche, non Write (se file esiste)
3. **Non creare file .md** di documentazione senza richiesta esplicita
4. **Testare localmente** prima di committare

### Git Workflow

- Branch principale: `main`
- Commit messages: chiari e concisi, in inglese

### Performance

- Lazy load immagini (già configurato con next/image)
- Componenti pesanti in loading lazy
- Mantenere bundle size ridotto

## Specifiche Tecniche

Per dettagli tecnici approfonditi (stack completo, dipendenze, schema database, configurazioni), consulta [Spec.md](Spec.md).

**IMPORTANTE**: Leggi Spec.md SOLO se hai bisogno di informazioni tecniche dettagliate per completare un task specifico. Non caricarlo di default per risparmiare context.

## Comandi Utili

```bash
npm run dev          # Avvia dev server (con Turbopack)
npm run build        # Build produzione
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
```

## Note Importanti

- Il sito è in **italiano**
- Target audience: persone interessate a nutrizione plant-based
- GDPR compliance: importante per gestione dati clienti e foto
- Database: Prisma + PostgreSQL (migrazione da localStorage completata)

## Domande Frequenti

**Q: Devo creare un nuovo file di documentazione?**
A: No, a meno che l'utente non lo richieda esplicitamente.

**Q: Devo migrare a database?**
A: Già fatto. Il progetto usa Prisma + PostgreSQL. Non usare localStorage per dati applicativi.

**Q: Posso modificare la chat/chatbot?**
A: Sì, il chatbot è funzionante. Vedi `src/components/ChatWidget.tsx`.

**Q: Come aggiungo una nuova immagine?**
A: Leggi IMAGE-SETUP.md prima. Ottimizza, salva in /public/images/[categoria], usa next/image component.

---

**Ultimo aggiornamento**: 2026-06-01
**Versione**: 1.0
