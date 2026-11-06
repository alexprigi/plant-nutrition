# Viva Plant Nutrition

Sito web di Arianna Ciervo, nutrizionista specializzata in alimentazione plant-based: pagine informative in italiano, tedesco e inglese, prenotazione consulenze (carta con Stripe o bonifico), area admin, email transazionali.

Stack: Next.js (App Router), next-intl, Prisma + PostgreSQL (Supabase), Stripe, Resend, Tailwind CSS.

## Avvio

```bash
npm install
npm run dev
```

Servono le variabili ambiente in `.env.local` (database, Auth, Resend, Stripe, `CRON_SECRET`). Elenco e dettagli in [Spec.md](Spec.md).

## Comandi

```bash
npm run lint            # ESLint (zero warning)
npx tsc --noEmit        # type check
npm test                # unit test (vitest, coverage 100% su src/lib e src/app/api)
npm run e2e:preview:fast  # test browser sulla preview, senza invio mail
npm run e2e:preview       # idem, con mail reali (consuma quota Resend)
```

## Documentazione

- [CLAUDE.md](CLAUDE.md) – linee guida di progetto
- [Spec.md](Spec.md) – specifiche tecniche
- [BOOKING-FLOW.md](BOOKING-FLOW.md) – flusso prenotazione, cron, gestione appuntamenti
- [PAYMENT-SETUP.md](PAYMENT-SETUP.md), [EMAIL-SETUP.md](EMAIL-SETUP.md), [IMAGE-SETUP.md](IMAGE-SETUP.md), [CHATBOT-GUIDE.md](CHATBOT-GUIDE.md), [NEWSLETTER-SETUP.md](NEWSLETTER-SETUP.md), [GOOGLE-BUSINESS-SETUP.md](GOOGLE-BUSINESS-SETUP.md)
