# Integrazione Pagamenti - Viva Plant Nutrition

Guida completa per integrare uno o più sistemi di pagamento nel flusso di prenotazione.

---

## Panoramica delle Opzioni

| Provider | Carte di credito | Apple/Google Pay | Bonifico SEPA | Commissioni | Difficoltà integrazione |
|---|---|---|---|---|---|
| **Stripe** | ✅ | ✅ | ✅ (extra) | 1.5% + 0.25€ (EU) | Media |
| **PayPal** | ✅ (via PayPal) | ❌ | ❌ | 3.4% + 0.35€ | Bassa |
| **Satispay** | ❌ | ❌ | ❌ | 0€ < 10€, 0.20€ > 10€ | Media |
| **Klarna** | ✅ + rateale | ❌ | ❌ | ~2.49% + 0.20€ | Bassa (via Stripe) |
| **Scalapay** | ✅ (rateale) | ❌ | ❌ | ~4% a carico tuo | Media |

**Raccomandazione**: Inizia con **Stripe** (più completo e professionale) + **PayPal** come alternativa per chi non ha carta. Satispay per il mercato italiano, Klarna per utenti tedeschi/nordici.

---

## 1. STRIPE

### Cosa supporta
- Carte di credito e debito (Visa, Mastercard, Amex)
- Apple Pay e Google Pay (automatico se l'utente li ha configurati)
- Bonifico SEPA (configurabile separatamente)
- 3D Secure (autenticazione bancaria aggiuntiva, obbligatoria in UE)

### Commissioni
- **1.5% + €0.25** per carte europee
- **2.5% + €0.25** per carte non-europee
- Nessun canone mensile fisso

### Creare l'account Stripe

1. Vai su [stripe.com](https://stripe.com)
2. Clicca **"Start now"** → inserisci email, nome, password
3. Verifica la tua email
4. Completa la verifica identità:
   - Tipo attività: **Libero professionista / Ditta individuale**
   - Settore: **Healthcare / Wellness**
   - Inserisci codice fiscale e IBAN del tuo conto bancario
   - Carica documento d'identità (richiesto da normative EU)
5. L'account viene approvato in 1-2 giorni lavorativi

### Ottenere le chiavi API

1. Nel pannello Stripe → **Developers** → **API keys**
2. Copia:
   - `Publishable key` → inizia con `pk_live_...`
   - `Secret key` → inizia con `sk_live_...`
3. Per i test usa `pk_test_...` e `sk_test_...`

### Variabili ambiente da aggiungere in `.env.local`

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # ottenuto dopo aver configurato il webhook
```

### Configurare il Webhook

Il webhook è necessario per ricevere la conferma del pagamento avvenuto.

1. Nel pannello Stripe → **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://tuodominio.com/api/webhooks/stripe`
3. Seleziona l'evento: `checkout.session.completed`
4. Copia il **Signing secret** (`whsec_...`) e mettilo in `.env.local`

### Flusso di integrazione nel codice

```
Utente completa Step 4 → click "Prenota"
  → POST /api/checkout/stripe (crea Checkout Session)
  → Redirect a pagina Stripe hosted
  → Utente inserisce carta
  → Pagamento OK → Stripe reindirizza a /prenota/success?session_id=...
  → Stripe invia webhook a /api/webhooks/stripe
  → Webhook crea booking + invia email di conferma
```

### Dipendenze npm da installare

```bash
npm install stripe @stripe/stripe-js
```

---

## 2. PAYPAL

### Cosa supporta
- Pagamento con account PayPal
- Carte di credito/debito per chi non ha account PayPal
- "Pay Later" (paga in 3 rate, senza interessi per l'utente)

### Commissioni
- **3.4% + €0.35** per transazione (più caro di Stripe)
- Nessun canone mensile

### Creare l'account PayPal Business

1. Vai su [paypal.com/it](https://www.paypal.com/it)
2. Clicca **"Apri un conto"** → scegli **"Business"**
3. Inserisci i dati della tua attività (partita IVA o codice fiscale)
4. Verifica email e collega il tuo conto bancario/IBAN
5. L'attivazione è quasi immediata

### Ottenere le chiavi API (Developer Dashboard)

1. Vai su [developer.paypal.com](https://developer.paypal.com)
2. Accedi con il tuo account PayPal Business
3. **My Apps & Credentials** → **Create App**
4. Nome app: `Viva Plant Nutrition`
5. Copia **Client ID** e **Secret**
6. Per i test usa l'ambiente **Sandbox**

### Variabili ambiente da aggiungere in `.env.local`

```env
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_MODE=live  # oppure "sandbox" per i test
```

### Flusso di integrazione nel codice

```
Utente seleziona PayPal → click "Prenota"
  → POST /api/checkout/paypal (crea ordine PayPal)
  → Redirect alla pagina PayPal
  → Utente approva il pagamento
  → PayPal reindirizza a /prenota/success?token=...
  → POST /api/checkout/paypal/capture (cattura il pagamento)
  → Crea booking + invia email di conferma
```

### Dipendenze npm da installare

```bash
npm install @paypal/react-paypal-js
```

---

## 3. SATISPAY

### Cos'è
App di pagamento molto popolare in Italia, soprattutto tra i giovani. Pagamento diretto da conto corrente, senza carta. Zero commissioni sotto i €10, solo €0.20 sopra.

### Cosa supporta
- Solo pagamenti tramite app Satispay
- Solo mercato italiano
- Nessuna carta di credito

### Commissioni
- **Gratis** per transazioni sotto €10
- **€0.20 fisso** per transazioni sopra €10 (molto conveniente!)

### Creare l'account Satispay Business

1. Vai su [satispay.com/business](https://satispay.com/business)
2. Scarica l'app Satispay Business
3. Registra la tua attività (richiede P.IVA o codice fiscale)
4. Collega IBAN
5. Attivazione in 1-3 giorni lavorativi

### Ottenere le chiavi API

1. Vai su [business.satispay.com](https://business.satispay.com)
2. **Impostazioni** → **API**
3. Crea una nuova integrazione e scarica il **keypair** (chiave pubblica e privata RSA)
4. Otterrai anche un `Bearer Token`

### Variabili ambiente

```env
SATISPAY_KEY_ID=...
SATISPAY_PRIVATE_KEY=...  # chiave RSA privata
SATISPAY_MODE=production  # oppure "sandbox"
```

### Dipendenze npm

```bash
npm install satispay-nodejs
# oppure usare le API REST direttamente
```

---

## 4. KLARNA

### Cos'è
Uno dei sistemi di pagamento più diffusi in Germania, Svezia e Nord Europa. Offre sia pagamento immediato con carta che rateizzazione ("Paga in 3 rate" o "Paga dopo 30 giorni"). Molto riconoscibile dal pubblico tedesco e nordico.

### Cosa supporta
- Carte di credito/debito
- "Paga in 3 rate" senza interessi per l'utente
- "Paga dopo 30 giorni" (l'utente riceve prima il servizio, paga dopo)
- Disponibile in Italia, Germania, e molti paesi EU

### Quando ha senso
- Se hai clienti tedeschi o del Nord Europa — Klarna è lì quello che PayPal è in Italia
- Per i pacchetti costosi (€237 e €450) il "paga dopo 30 giorni" può aumentare le conversioni

### Commissioni
- **~2.49% + €0.20** per transazione (varia per paese e volume)
- Nessun canone fisso

### Creare l'account Klarna Business

1. Vai su [klarna.com/it/business](https://www.klarna.com/it/business/)
2. Clicca **"Diventa partner"**
3. Inserisci i dati della tua attività
4. Klarna valuta e approva l'account (processo più lungo, 3-5 giorni lavorativi)

### Ottenere le chiavi API

1. Accedi al **Merchant Portal**: [portal.klarna.com](https://portal.klarna.com)
2. **Settings** → **API credentials**
3. Copia **API Username** e **API Password**
4. Per i test usa l'ambiente **Playground**: [playground.klarna.com](https://playground.klarna.com)

### Variabili ambiente

```env
KLARNA_API_USERNAME=...
KLARNA_API_PASSWORD=...
KLARNA_MODE=production  # oppure "playground" per i test
```

### Dipendenze npm

```bash
# Klarna non ha un SDK ufficiale npm — si integra via API REST o tramite Stripe (che supporta Klarna nativamente)
# Soluzione più semplice: abilitare Klarna direttamente dal pannello Stripe se usi già Stripe
```

> **Tip**: Se integri Stripe, puoi abilitare Klarna come metodo di pagamento direttamente dal pannello Stripe → **Payment methods** → attiva Klarna. Nessun codice aggiuntivo necessario!

---

## 5. SCALAPAY (opzionale)

### Cos'è
Servizio "Buy Now, Pay Later": l'utente paga in 3 rate senza interessi. Tu ricevi l'intero importo subito, Scalapay si occupa della rateizzazione.

### Quando ha senso
- Potrebbe aumentare le conversioni per i pacchetti da €237 e €450
- L'utente percepisce il costo come minore (€79/mese invece di €237)

### Commissioni
- **~3-4%** a carico del venditore (tu)
- Nessun costo per l'utente

### Contatto
Richiedere attivazione tramite [scalapay.com](https://scalapay.com) → sezione merchant.

---

## Strategia Consigliata

### Priorità di implementazione

**Fase 1 (subito):**
- ✅ **Stripe** — copre carte di credito + Apple/Google Pay, mercato internazionale

**Fase 2 (dopo):**
- ✅ **PayPal** — per chi non ha carta o preferisce PayPal
- ✅ **Satispay** — ottimo per utenti italiani, commissioni bassissime

**Fase 3 (se vuoi aumentare conversioni o espanderti):**
- 🤔 **Klarna** — ottimo per utenti tedeschi/nordici; se usi già Stripe si abilita in 1 click dal pannello
- 🤔 **Scalapay** — valuta solo se noti che utenti abbandonano ai pacchetti da €237/€450

### Bonifico bancario
Mantienilo sempre come opzione fallback — alcuni clienti (specie anziani) lo preferiscono. Richiede conferma manuale dall'admin, già gestita nel sistema attuale.

---

## Prossimi Passi Tecnici

Una volta che hai le chiavi API, lo sviluppo richiede:

1. Installare le dipendenze npm
2. Creare endpoint `/api/checkout/[provider]`
3. Creare endpoint `/api/webhooks/[provider]`
4. Modificare `prenota/page.tsx` per il redirect al checkout
5. Creare pagina `/prenota/success` e `/prenota/cancel`
6. Aggiornare logica email: invio solo dopo conferma pagamento

Comunica quando hai creato l'account e ottenuto le chiavi — si procede con il codice.

---

*Ultimo aggiornamento: 2026-04-17*
