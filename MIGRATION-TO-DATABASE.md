# Piano di Migrazione: Da localStorage a Database SQL + Autenticazione

> ⚠️ **STATO**: PIANIFICAZIONE - NON IMPLEMENTATO
> Questo documento contiene il piano per una futura migrazione.
> **Attualmente il progetto usa ancora localStorage.**

## Panoramica

Questo documento descrive il piano completo per migrare l'applicazione da `localStorage` a un database SQL PostgreSQL con sistema di autenticazione e sessioni.

---

## Stack Tecnologico Consigliato

```
Database:      Supabase PostgreSQL (free tier)
ORM:           Prisma
Autenticazione: Auth.js (NextAuth.js v5)
Deploy:        Vercel
```

### Perché Supabase?
- ✅ PostgreSQL completo + Auth integrato
- ✅ Dashboard visual per gestire dati
- ✅ Free tier generoso (500 MB DB, 2 GB bandwidth)
- ✅ Backup automatici
- ✅ API REST automatiche (opzionale)
- ✅ Row Level Security per sicurezza avanzata

---

## Fase 1: Setup Database e Prisma

### 1.1 Installazione Dipendenze

```bash
npm install prisma @prisma/client
npm install -D prisma
npx prisma init
```

### 1.2 Configurazione Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Crea nuovo progetto "plant-nutrition"
3. Copia la **Connection String** (formato PostgreSQL)
4. Aggiungi a `.env`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 1.3 Schema Prisma (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// =====================
// MODELLI
// =====================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDeleted Boolean  @default(false)

  @@map("users")
}

enum Role {
  ADMIN
  CLIENT
}

model Client {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String
  surname       String
  phone         String
  address       String
  civicNumber   String
  city          String
  zipCode       String
  country       String
  fiscalCode    String
  role          ClientRole     @default(GUEST)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  isDeleted     Boolean        @default(false)
  
  subscriptions Subscription[]
  appointments  Appointment[]

  @@map("clients")
}

enum ClientRole {
  GUEST
  REGISTERED
}

model Subscription {
  id            String              @id @default(cuid())
  clientId      String
  client        Client              @relation(fields: [clientId], references: [id], onDelete: Cascade)
  type          SubscriptionType
  price         Float
  isPaid        Boolean             @default(false)
  paymentMethod PaymentMethod
  totalSessions Int
  usedSessions  Int                 @default(0)
  status        SubscriptionStatus  @default(ACTIVE)
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt
  isDeleted     Boolean             @default(false)
  
  appointments  Appointment[]

  @@map("subscriptions")
}

enum SubscriptionType {
  FREE_CONSULTATION
  SINGLE_SESSION
  BUNDLE_3_MONTHS
  BUNDLE_6_MONTHS
}

enum SubscriptionStatus {
  ACTIVE
  EXHAUSTED
  CANCELLED
}

enum PaymentMethod {
  STRIPE
  PAYPAL
  BANK_TRANSFER
  NONE
}

model Appointment {
  id              String            @id @default(cuid())
  subscriptionId  String
  subscription    Subscription      @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  clientId        String
  client          Client            @relation(fields: [clientId], references: [id], onDelete: Cascade)
  type            AppointmentType
  date            String
  time            String
  status          AppointmentStatus @default(PENDING)
  notes           String            @default("")
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  isDeleted       Boolean           @default(false)

  @@map("appointments")
}

enum AppointmentType {
  FREE_CONSULTATION
  FIRST_VISIT
  FOLLOW_UP
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}
```

### 1.4 Migrazione Iniziale

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## Fase 2: Setup Autenticazione (Auth.js)

### 2.1 Installazione

```bash
npm install next-auth@beta
npm install @auth/prisma-adapter
```

### 2.2 Configurazione Auth.js (`src/lib/auth.ts`)

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { 
            email: credentials.email as string,
            isDeleted: false 
          }
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login"
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    }
  }
})
```

### 2.3 API Route Auth (`src/app/api/auth/[...nextauth]/route.ts`)

```typescript
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

### 2.4 Prisma Client Singleton (`src/lib/prisma.ts`)

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## Fase 3: Migrazione API Routes

### 3.1 Nuova Struttura File

```
src/app/api/
├── auth/
│   └── [...nextauth]/route.ts
├── bookings/
│   ├── route.ts              # GET (list), POST (create)
│   └── [id]/route.ts         # GET, PATCH, DELETE
├── clients/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── check-eligibility/route.ts
└── validate-booking/route.ts  # Esistente, da aggiornare
```

### 3.2 Esempio: Check Eligibility (`src/app/api/clients/check-eligibility/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const client = await prisma.client.findUnique({
      where: { 
        email: email.toLowerCase(),
        isDeleted: false
      }
    })

    if (client) {
      return NextResponse.json({
        eligible: false,
        reason: 'already_customer'
      })
    }

    return NextResponse.json({ eligible: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 3.3 Esempio: Create Booking (`src/app/api/bookings/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Transazione atomica
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crea o trova cliente
      const client = await tx.client.upsert({
        where: { email: data.email.toLowerCase() },
        update: {
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          address: data.address,
          civicNumber: data.civicNumber,
          city: data.city,
          zipCode: data.zipCode,
          country: data.country,
          fiscalCode: data.fiscalCode
        },
        create: {
          email: data.email.toLowerCase(),
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          address: data.address,
          civicNumber: data.civicNumber,
          city: data.city,
          zipCode: data.zipCode,
          country: data.country,
          fiscalCode: data.fiscalCode,
          role: 'GUEST'
        }
      })

      // 2. Crea subscription
      const subscription = await tx.subscription.create({
        data: {
          clientId: client.id,
          type: data.commercialType,
          price: data.price,
          isPaid: data.isPaid,
          paymentMethod: data.paymentMethod,
          totalSessions: data.totalSessions,
          usedSessions: 0,
          status: 'ACTIVE'
        }
      })

      // 3. Crea appointment
      const appointment = await tx.appointment.create({
        data: {
          subscriptionId: subscription.id,
          clientId: client.id,
          type: data.appointmentType,
          date: data.selectedDate,
          time: data.selectedTime,
          status: data.status,
          notes: data.notes
        }
      })

      return { client, subscription, appointment }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
```

---

## Fase 4: Aggiornamento Frontend

### 4.1 Aggiornare `bookingService.ts`

Sostituire tutte le funzioni localStorage con chiamate API:

```typescript
// PRIMA (localStorage)
export const checkEligibility = (email: string) => {
  const clients = getLs<Client>(KEY_CLIENTS);
  const exists = clients.some(c => c.email.toLowerCase() === email.toLowerCase());
  // ...
}

// DOPO (API call)
export const checkEligibility = async (email: string) => {
  const response = await fetch('/api/clients/check-eligibility', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  return response.json()
}
```

### 4.2 Aggiornare Componente Prenotazione

Modificare da sincrono ad asincrono:

```typescript
// PRIMA
const check = checkEligibility(formData.email);

// DOPO
const check = await checkEligibility(formData.email);
```

### 4.3 Proteggere Pagina Admin

```typescript
// src/app/admin/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }
  
  // ... resto del codice admin
}
```

---

## Fase 5: Script di Migrazione Dati

### 5.1 Script per Migrare da localStorage a DB

```typescript
// scripts/migrate-localstorage-to-db.ts
import { prisma } from '../src/lib/prisma'

async function migrate() {
  // Leggi dati da localStorage (manualmente dal browser)
  const clients = [/* copia/incolla da console browser */]
  const subscriptions = [/* ... */]
  const appointments = [/* ... */]

  for (const client of clients) {
    await prisma.client.create({
      data: {
        id: client.id,
        email: client.email,
        name: client.name,
        // ... altri campi
      }
    })
  }

  // Stessa cosa per subscriptions e appointments
  console.log('Migrazione completata!')
}

migrate()
```

Eseguire con:
```bash
npx tsx scripts/migrate-localstorage-to-db.ts
```

---

## Fase 6: Testing e Deploy

### 6.1 Testing Locale

```bash
# Avvia DB locale (opzionale)
docker run -e POSTGRES_PASSWORD=password -p 5432:5432 postgres

# Migra schema
npx prisma migrate dev

# Avvia app
npm run dev
```

### 6.2 Deploy Vercel

1. Aggiungi variabili ambiente:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET` (genera con `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (es: `https://plant-nutrition.vercel.app`)

2. Deploy:
```bash
vercel --prod
```

3. Esegui migrazioni in produzione:
```bash
npx prisma migrate deploy
```

---

## Checklist Completa

### Setup Iniziale
- [ ] Crea progetto Supabase
- [ ] Installa Prisma e Auth.js
- [ ] Configura `.env`
- [ ] Crea schema Prisma
- [ ] Esegui prima migrazione

### Backend
- [ ] Configura Prisma Client
- [ ] Setup Auth.js
- [ ] Crea API route per check eligibility
- [ ] Crea API route per bookings
- [ ] Crea API route per clienti
- [ ] Aggiorna validate-booking

### Frontend
- [ ] Aggiorna bookingService.ts (async)
- [ ] Modifica componente prenotazione
- [ ] Proteggi pagina admin
- [ ] Crea pagina login admin
- [ ] Gestisci stati loading

### Migrazione Dati
- [ ] Script migrazione localStorage → DB
- [ ] Test con dati di sviluppo
- [ ] Backup dati esistenti

### Deploy
- [ ] Configura variabili ambiente Vercel
- [ ] Deploy su Vercel
- [ ] Esegui migrazioni in produzione
- [ ] Test completo in produzione

---

## Stima Tempo

| Fase | Tempo Stimato |
|------|---------------|
| Setup Database + Prisma | 1-2 ore |
| Setup Auth.js | 1-2 ore |
| Migrazione API Routes | 3-4 ore |
| Aggiornamento Frontend | 2-3 ore |
| Testing e Debug | 2-3 ore |
| **TOTALE** | **9-14 ore** |

---

## Benefici Post-Migrazione

✅ **Dati persistenti**: Non si perdono più con localStorage  
✅ **Multi-device**: Accessibile da qualsiasi dispositivo  
✅ **Sicurezza**: Autenticazione robusta con sessioni  
✅ **Scalabilità**: Supporta migliaia di utenti  
✅ **Backup automatici**: Supabase fa backup giornalieri  
✅ **Query complesse**: JOIN, aggregazioni, report  
✅ **Admin protetto**: Accesso solo con login  

---

## Note Finali

- Mantieni il codice localStorage come fallback durante sviluppo
- Testa ogni fase prima di procedere
- Fai backup prima di migrare dati reali
- Considera di usare `zod` per validazione schema request/response
- Implementa rate limiting per API pubbliche
- Aggiungi logging per debug (es: `pino` o `winston`)

---

**Documento creato il**: 8 Febbraio 2025
**Versione**: 1.0
**Stato**: 📋 Pianificazione (non implementato)
