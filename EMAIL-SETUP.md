# Setup Email con Resend

## Configurazione Iniziale

### 1. Crea Account Resend

1. Vai su [resend.com](https://resend.com)
2. Registrati gratuitamente
3. Verifica la tua email

### 2. Ottieni API Key

1. Dashboard → **API Keys**
2. Clicca **Create API Key**
3. Nome: `Viva Plant Nutrition Production`
4. Copia la chiave (inizia con `re_...`)

### 3. Configura Dominio (per email professionali)

**Opzione A: Dominio Personalizzato** (consigliata per produzione)
1. Dashboard → **Domains**
2. Clicca **Add Domain**
3. Inserisci il tuo dominio (es: `vivaplantnutrition.com`)
4. Aggiungi i record DNS forniti al tuo provider:
   - SPF record
   - DKIM record  
   - DMARC record (opzionale)
5. Attendi verifica (max 24 ore)
6. Ora puoi inviare da `info@vivaplantnutrition.com`

**Opzione B: Dominio Resend** (per testing)
- Usa `onboarding@resend.dev` (limitato a 100 email/giorno)
- Va bene per sviluppo, non per produzione

### 4. Configura Variabili Ambiente

**Locale (`.env.local`)**:
```env
RESEND_API_KEY=re_tua_chiave_qui
```

**Vercel**:
1. Vai su Vercel Dashboard
2. Progetto → **Settings** → **Environment Variables**
3. Aggiungi:
   - Name: `RESEND_API_KEY`
   - Value: `re_tua_chiave_qui`
   - Environment: Production, Preview, Development
4. **Redeploy** il progetto

---

## Modifica Email Admin


Nel file `/src/app/api/send-booking-emails/route.ts`, linea 82:

```typescript
to: 'arianna@vivaplantnutrition.com', // ← CAMBIA CON LA TUA EMAIL
```

Sostituisci con l'email dove vuoi ricevere le notifiche.

---

## Testing Locale

1. Assicurati che `.env.local` contenga `RESEND_API_KEY`
2. Riavvia il dev server: `npm run dev`
3. Completa una prenotazione
4. Controlla:
   - Console browser per errori
   - Console server per log
   - Inbox dell'email cliente
   - Inbox dell'email admin

### Test Email Senza Prenotazione

Crea file `test-email.ts` nella root:

```typescript
import { resend } from './src/lib/email';

async function testEmail() {
  const result = await resend.emails.send({
    from: 'Viva Plant Nutrition <info@vivaplantnutrition.com>',
    to: 'tua-email-di-test@gmail.com',
    subject: 'Test Email Resend',
    html: '<h1>Funziona!</h1><p>Resend è configurato correttamente.</p>'
  });
  
  console.log('Result:', result);
}

testEmail();
```

Esegui: `npx tsx test-email.ts`

---

## Template Email Personalizzabili

### Template Cliente
File: `/src/lib/email-templates/client-confirmation.ts`

Puoi modificare:
- Colori header (linea 55)
- Logo (aggiungi `<img>`)
- Footer con link social
- IBAN per bonifici (linea 116)

### Template Admin
File: `/src/lib/email-templates/admin-notification.ts`

Puoi modificare:
- Colori header (linea 55)
- Link dashboard (linea 140)
- Alert pagamento (linea 148)

---

## Limiti Free Tier Resend

| Feature | Free Tier | Pro |
|---------|-----------|-----|
| Email/mese | 3.000 | 50.000 |
| Email/giorno | 100 | Illimitate |
| Domini | 1 | 10 |
| API Keys | 3 | Illimitate |
| Retention | 30 giorni | 90 giorni |

Per piccole attività, il free tier è più che sufficiente!

---

## Troubleshooting

### ❌ Errore: "Resend API key not found"
- Verifica che `.env.local` esista
- Riavvia il dev server
- Controlla che la chiave inizi con `re_`

### ❌ Email non arriva
- Controlla spam/promozioni
- Verifica che il dominio sia verificato
- Guarda i log in Resend Dashboard → **Logs**

### ❌ Errore 403: "Domain not verified"
- Usa `onboarding@resend.dev` per test
- Oppure completa verifica DNS del dominio

### ❌ Rate limit exceeded
- Free tier ha limite 100/giorno
- Upgrade a Pro o attendi 24 ore

---

## Monitoraggio Email

Dashboard Resend mostra:
- ✅ Email inviate con successo
- ❌ Email fallite (bounce, spam)
- 📊 Tasso di apertura (con tracking)
- 🔗 Click sui link

**Abilita tracking** (opzionale):
```typescript
await resend.emails.send({
  // ... altri campi
  tags: [
    { name: 'category', value: 'booking' }
  ],
  headers: {
    'X-Entity-Ref-ID': bookingId
  }
})
```

---

## Alternative a Resend

Se Resend non ti piace, alternative valide:

| Servizio | Pro | Contro |
|----------|-----|--------|
| **SendGrid** | Gratis 100/giorno | Setup più complesso |
| **Mailgun** | 5000/mese gratis | UI datata |
| **AWS SES** | Economico | Richiede AWS account |
| **Postmark** | Migliore deliverability | Solo 100 email free |

Per Next.js, **Resend è la scelta migliore**.

---

## Prossimi Passi

- [ ] Registrati su Resend
- [ ] Copia API key in `.env.local`
- [ ] Testa email locale
- [ ] Configura dominio personalizzato
- [ ] Aggiungi API key su Vercel
- [ ] Testa in produzione

---

**Documentazione Resend**: https://resend.com/docs  
**Support**: support@resend.com

Ultimo aggiornamento: 8 Febbraio 2026
