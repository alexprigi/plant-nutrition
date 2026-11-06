# Viva Plant Nutrition - Specifiche Tecniche

> Consultalo solo quando serve per un task specifico. Linee guida generali: [CLAUDE.md](CLAUDE.md). Flusso prenotazioni: [BOOKING-FLOW.md](BOOKING-FLOW.md). Le versioni esatte delle dipendenze sono in `package.json`.

## Stack

- **Framework**: Next.js (App Router, Turbopack in dev), React 19, TypeScript strict
- **i18n**: next-intl, locali `it`, `de`, `en` (default `de`, prefisso sempre presente); proxy in `src/proxy.ts`
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL su Supabase, ORM Prisma 7 (`@prisma/adapter-pg`)
- **Auth admin**: Auth.js (NextAuth v5) con credenziali, adapter Prisma, bcryptjs
- **Pagamenti**: Stripe Checkout (carta) e bonifico bancario
- **Email**: Resend
- **Test**: vitest (unit, coverage 100% su `src/lib` e `src/app/api`), Playwright-core per e2e sulla preview
- **Qualità**: ESLint (zero warning), husky + lint-staged + commitlint
- **Deploy**: Vercel (preview su `development`, produzione su `main`); cron in `vercel.json`

## Routing (`src/app`)

```
[locale]/              page (home), about, services, contact, recipes (WIP), blog (WIP),
                       booking, booking/success, booking/follow-up/[token],
                       manage/[token], cancellation-policy, privacy-policy, cookie-policy
admin/                 page (dashboard), login, clienti/[id], disponibilita, settings   (solo italiano)
api/                   vedi sotto
sitemap.ts, robots.ts  SEO (hreflang nella sitemap + <link rel=alternate>, canonical)
email-preview, icons-preview   pagine di sviluppo
```

Le pagine private (success, follow-up, manage) hanno `alternates: {}` e non sono indicizzate.

### API Routes (`src/app/api`)

| Route | Scopo |
|-------|-------|
| `bookings` | Disponibilità (GET) e creazione prenotazione (POST) |
| `validate-booking` | Validazione form prenotazione |
| `create-checkout-session` | Crea la Stripe Checkout Session (scade dopo 30 min) |
| `stripe-webhook` | Eventi `checkout.session.completed` e `checkout.session.expired` |
| `send-booking-emails` | Email conferma a cliente e admin |
| `send-contact-email` | Modulo contatti |
| `clients/check-eligibility` | Idoneità alla prima call gratuita |
| `appointments/manage` | Sposta/annulla da link cliente |
| `follow-up` | Validazione token follow-up |
| `cron/reminders` | Cron giornaliero (protetto da `CRON_SECRET`) |
| `admin/*` | appointments, availability, password, profile, subscriptions/[id]/cancel |
| `auth/[...nextauth]` | Auth admin |

## Data Model (`prisma/schema.prisma`)

- `User` (admin, `Role`)
- `Client` (dati cliente, soft delete `isDeleted`)
- `Subscription`: `type` (FREE_CONSULTATION, SINGLE_SESSION, BUNDLE_3_MONTHS, BUNDLE_6_MONTHS), `price`, `isPaid`, `paymentMethod` (STRIPE, PAYPAL, BANK_TRANSFER, NONE), `totalSessions`, `usedSessions`, `status` (ACTIVE, EXHAUSTED, CANCELLED), `followUpToken`, `stripeSessionId`, `expiresAt`
- `Appointment`: `type` (FREE_CONSULTATION, FIRST_VISIT, FOLLOW_UP), `status` (PENDING, CONFIRMED, CANCELLED, COMPLETED), `managementToken`, contatori di spostamento
- `AvailabilityBlock`: blocchi/aperture impostati da Arianna (`BLOCK`, `OPEN`)

Migrazioni con `npm run db:migrate`; `npm run build` esegue `prisma migrate deploy`. Non usare localStorage per dati applicativi.

## Codice condiviso (`src/lib`)

- `bookingService.ts` logica prenotazioni; `booking-emails.ts` composizione email
- `email.ts` client Resend; `email-templates/` template (cliente in it/de/en, admin in italiano)
- `stripe.ts`, `prisma.ts`, `auth.ts`, `ics.ts` (allegato calendario)
- `site.ts` (URL sito, `IS_PRODUCTION_SITE`, `PUBLIC_PATHS`, hreflang), `metadata.ts` (`localizedMetadata`, `alternatesFor`)
- `constants.ts` (paesi, prefissi telefonici)

## Variabili ambiente (solo nomi)

`DATABASE_URL` (pooler), `DIRECT_URL` (migrazioni), `AUTH_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CRON_SECRET`. Configurate in `.env.local` e nella dashboard Vercel (preview usa la sandbox Stripe, produzione le chiavi live). In produzione `AUTH_URL` è il dominio apex, che reindirizza (307) a `www`.

## Test

- `npm test` / `npm run test:coverage`: unit test in `src/tests`
- `npm run e2e:preview[:fast|:admin]`: test browser sulla preview (`scripts/e2e`); `:fast` non invia mail. Vedi limiti Resend in [EMAIL-SETUP.md](EMAIL-SETUP.md)
- `scripts/cleanup-preview-db.ts`: svuota clienti/subscription/appuntamenti della preview (guard sull'host)

## Immagini e GDPR

Immagini: vedi [IMAGE-SETUP.md](IMAGE-SETUP.md) (sempre `next/image`). Cookie banner (`CookieBanner.tsx`), Privacy Policy, Cookie Policy e consenso per foto testimonianze.

---

**Ultimo aggiornamento**: 2026-11-06
