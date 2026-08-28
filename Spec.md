# Viva Plant Nutrition - Specifiche Tecniche

> **NOTA**: Questo file contiene specifiche tecniche dettagliate. Consultalo solo quando necessario per completare task specifici. Per linee guida generali vedi [CLAUDE.md](CLAUDE.md).

## Stack Tecnologico

### Core
- **Framework**: Next.js 16.2.2 (App Router)
- **React**: 19.2.4
- **TypeScript**: 6.0.2
- **Node**: Richiede versione compatibile con Next.js 16

### Styling
- **Tailwind CSS**: 4.2.2
- **PostCSS**: @tailwindcss/postcss 4.2.2

### Dipendenze Produzione
```json
{
  "next": "16.2.2",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "resend": "6.10.0"
}
```

### Dipendenze Sviluppo
```json
{
  "@eslint/eslintrc": "3.3.5",
  "@tailwindcss/postcss": "4.2.2",
  "@types/node": "25.5.2",
  "@types/react": "19.2.14",
  "@types/react-dom": "19.2.3",
  "eslint": "10.1.0",
  "eslint-config-next": "16.2.2",
  "tailwindcss": "4.2.2",
  "typescript": "6.0.2"
}
```

## Architettura Next.js

### Routing (App Router)

```
/src/app
├── layout.tsx                    # Root layout
├── page.tsx                      # Homepage (/)
├── about-me.tsx                  # Componente About Me
├── admin/
│   └── page.tsx                  # Dashboard admin (/admin)
├── api/
│   ├── bookings/
│   │   └── route.ts              # POST /api/bookings
│   ├── validate-booking/
│   │   └── route.ts              # POST /api/validate-booking
│   └── send-booking-emails/
│       └── route.ts              # POST /api/send-booking-emails
├── blog/
│   └── page.tsx                  # Blog (non implementato)
├── chi-sono/
│   └── page.tsx                  # Chi sono (/chi-sono)
├── contatti/
│   └── page.tsx                  # Contatti (/contatti)
├── cookie-policy/
│   └── page.tsx                  # Cookie Policy
├── prenota/
│   └── page.tsx                  # Form prenotazione (/prenota)
├── privacy-policy/
│   └── page.tsx                  # Privacy Policy
├── ricette/
│   └── page.tsx                  # Ricette (placeholder)
└── servizi/
    └── page.tsx                  # Servizi (/servizi)
```

### Componenti

```
/src/components
├── layout/
│   ├── Header.tsx                # Header navigazione
│   └── Footer.tsx                # Footer sito
├── ui/
│   ├── Button.tsx                # Button component
│   └── Card.tsx                  # Card component
├── icons/
│   └── Icon.tsx                  # Icon wrapper
├── ChatWidget.tsx                # Chat widget (WIP - non toccare)
├── CookieBanner.tsx              # Banner cookie
├── ParallaxEffect.tsx            # Effetto parallasse
└── Testimonials.tsx              # Sezione testimonianze
```

## Data Model (localStorage)

### Chiavi localStorage

```typescript
const KEY_CLIENTS = "plantNutritionClients"
const KEY_BOOKINGS = "plantNutritionBookings"
const KEY_APPOINTMENTS = "plantNutritionAppointments"
```

### Schema Client

```typescript
interface Client {
  id: string                      // UUID generato client-side
  email: string                   // Unique
  name: string
  surname: string
  phone: string                   // Formato: +39 123 4567890
  address: string
  civicNumber: string
  city: string
  zipCode: string
  country: string                 // Da lista COUNTRIES
  fiscalCode: string
  role: 'guest' | 'registered'    // Sempre 'guest' per ora
  createdAt: string               // ISO date
  updatedAt: string               // ISO date
  isDeleted: boolean
}
```

### Schema Subscription (Pacchetto)

```typescript
interface Subscription {
  id: string                      // UUID
  clientId: string                // FK a Client
  commercialType: string          // Es: "FREE_CONSULTATION", "SINGLE_SESSION"
  price: number                   // Euro
  isPaid: boolean
  paymentMethod: string           // Es: "STRIPE", "PAYPAL", "BANK_TRANSFER"
  totalSessions: number           // Es: 1 per singola, 6 per pacchetto
  usedSessions: number            // Incrementa a ogni appuntamento completato
  status: 'active' | 'exhausted' | 'cancelled'
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}
```

### Schema Appointment

```typescript
interface Appointment {
  id: string                      // UUID
  subscriptionId: string          // FK a Subscription
  clientId: string                // FK a Client (denormalizzato)
  appointmentType: string         // Es: "FREE_CONSULTATION", "FIRST_VISIT", "FOLLOW_UP"
  selectedDate: string            // Formato: "YYYY-MM-DD"
  selectedTime: string            // Formato: "HH:mm"
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string                   // Note opzionali
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}
```

## Servizio Prenotazioni

File: `src/lib/bookingService.ts`

### Funzioni Principali

```typescript
// Verifica se un cliente può prenotare consulenza gratuita
checkEligibility(email: string): {
  eligible: boolean
  reason?: 'already_customer' | 'free_consultation_used'
}

// Crea una nuova prenotazione (transazione atomica simulata)
createBooking(data: BookingData): {
  success: boolean
  booking?: { client, subscription, appointment }
  error?: string
}

// Recupera tutte le prenotazioni (con JOIN simulati)
getAllBookings(): Booking[]

// Filtra prenotazioni per stato
getBookingsByStatus(status: string): Booking[]

// Recupera singola prenotazione
getBookingById(id: string): Booking | null

// Aggiorna stato prenotazione
updateBookingStatus(id: string, status: string): boolean

// Soft delete
deleteBooking(id: string): boolean
```

### Utility localStorage

```typescript
// Get da localStorage con parsing JSON
getLs<T>(key: string): T[]

// Set in localStorage con stringify JSON
setLs<T>(key: string, data: T[]): void

// Clear localStorage (per testing)
clearLs(): void
```

## Sistema Email (Resend)

### Configurazione

File: `src/lib/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
```

### Variabili Ambiente Richieste

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Template Email

File: `src/lib/email-templates/`

**admin-notification.ts**
- Template per notificare l'admin di nuova prenotazione
- Include tutti i dettagli cliente e appuntamento
- Stile HTML inline per compatibilità email client

**client-confirmation.ts**
- Template per conferma prenotazione al cliente
- Include riepilogo appuntamento
- Link a contatti in caso di modifiche

### Invio Email

```typescript
// Da API route: /api/send-booking-emails/route.ts

export async function POST(request: Request) {
  const { booking } = await request.json()
  
  // Invia email admin
  await sendAdminNotification(booking)
  
  // Invia email cliente
  await sendClientConfirmation(booking)
  
  return Response.json({ success: true })
}
```

## Costanti Globali

File: `src/lib/constants.ts`

### COUNTRIES
Array di 195+ paesi in italiano (es: "Italia", "Stati Uniti", "Francia")

### COUNTRY_PREFIXES
Array di oggetti con prefissi telefonici internazionali:

```typescript
{
  code: string      // Es: "+39"
  flag: string      // Emoji: "🇮🇹"
  name: string      // Es: "Italia"
}
```

## Configurazioni Build

### next.config.js

```javascript
// Configurazione di default Next.js
// Turbopack abilitato via npm script
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### ESLint

Usa `eslint-config-next` con regole standard Next.js.

```bash
npm run lint       # Check
npm run lint:fix   # Auto-fix
```

## Asset Management

### Immagini

Tutte in `/public/images/`

Struttura:
```
/public/images
├── hero/                    # Slider homepage (5 immagini)
├── professional/            # Foto Arianna professionali
├── plants/                  # Decorazioni
├── testimonials/            # Foto testimonianze (con consenso)
└── recipes/                 # Ricette (placeholder)
```

**Dettagli completi**: vedi [IMAGE-SETUP.md](IMAGE-SETUP.md)

### Font

Usa `next/font` con Geist (font Vercel).

```typescript
import { GeistSans } from 'geist/font/sans'
```

## API Routes

### POST /api/bookings

**Body**:
```typescript
{
  // Client data
  email: string
  name: string
  surname: string
  phone: string
  address: string
  civicNumber: string
  city: string
  zipCode: string
  country: string
  fiscalCode: string
  
  // Subscription data
  commercialType: string
  price: number
  isPaid: boolean
  paymentMethod: string
  totalSessions: number
  
  // Appointment data
  appointmentType: string
  selectedDate: string
  selectedTime: string
  notes: string
}
```

**Response**: 
```typescript
{ 
  success: boolean
  booking?: { client, subscription, appointment }
  error?: string 
}
```

### POST /api/validate-booking

Valida dati form prenotazione prima di submit.

**Body**: Stesso di /api/bookings

**Response**:
```typescript
{
  valid: boolean
  errors?: { field: string, message: string }[]
}
```

### POST /api/send-booking-emails

Invia email di conferma (admin + cliente).

**Body**:
```typescript
{
  booking: {
    client: Client
    subscription: Subscription
    appointment: Appointment
  }
}
```

**Response**:
```typescript
{ success: boolean }
```

## Piani Futuri

### Migrazione Database

Esiste un piano dettagliato in [MIGRATION-TO-DATABASE.md](MIGRATION-TO-DATABASE.md) per migrare da localStorage a:
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Auth**: Auth.js (NextAuth v5)

**IMPORTANTE**: Questo è solo un piano futuro. Al momento continuare con localStorage.

### Funzionalità in Sviluppo

**Chat/Chatbot**:
- Setup non completato
- Non implementare o modificare per ora
- File: `src/components/ChatWidget.tsx`

## Environment Variables

```env
# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Future (quando si migrerà a DB)
# DATABASE_URL=
# DIRECT_URL=
# NEXTAUTH_SECRET=
```

## Deploy

**Target**: Vercel

```bash
# Build locale
npm run build

# Deploy
vercel --prod
```

**Variabili ambiente**: Configurare in Vercel dashboard.

## Testing

Non ci sono test configurati al momento.

## Performance Metrics

- **Lighthouse**: Puntare a 90+ su tutte le metriche
- **Core Web Vitals**: Monitorare LCP, FID, CLS
- **Image optimization**: next/image gestisce automaticamente WebP + lazy loading

## Browser Support

Come da configurazione Next.js default:
- Chrome (ultime 2 versioni)
- Firefox (ultime 2 versioni)
- Safari (ultime 2 versioni)
- Edge (ultime 2 versioni)

## GDPR Compliance

- Cookie banner implementato (`CookieBanner.tsx`)
- Privacy Policy (`/privacy-policy`)
- Cookie Policy (`/cookie-policy`)
- Consenso per foto testimonianze (vedi IMAGE-SETUP.md)

---

**Ultimo aggiornamento**: 2026-04-04
**Versione**: 1.0
