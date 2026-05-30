# Booking Flow — Viva Plant Nutrition

Documentazione del flusso completo di prenotazione, gestione appuntamenti e percorsi.

---

## 1. Prenotazione

### Step del form (`/prenota`)

| Step | Contenuto |
|------|-----------|
| 1 | Scelta servizio |
| 2 | Dati personali |
| 3 | Calendario — scelta data e ora |
| 4 | Pagamento + accettazione policy |

**Regole:**
- Il bonifico bancario è disabilitato se l'appuntamento è entro **5 giorni**
- Per servizi a pagamento è obbligatorio accettare la [policy di cancellazione](/policy-cancellazione) prima di confermare
- Per i **percorsi (3/6 mesi)** il form può essere raggiunto tramite link follow-up (`/prenota?followUp=TOKEN`) che pre-seleziona il servizio e salta direttamente al calendario

### Stato post-prenotazione

| Metodo pagamento | Status iniziale | isPaid |
|-----------------|-----------------|--------|
| Carta / PayPal | `CONFIRMED` | `true` |
| Bonifico | `PENDING` | `false` |
| Gratuito | `CONFIRMED` | `true` |

### Email inviate alla prenotazione
- **Cliente** → conferma con dettagli appuntamento, allegato `.ics`, link gestione, istruzioni bonifico (se applicabile)
- **Arianna** → notifica nuova prenotazione con dati cliente e stato pagamento

---

## 2. Pagamento con Bonifico

### Flusso
1. Cliente prenota → stato `PENDING` → riceve email con IBAN e istruzioni
2. Cliente ha **72 ore** per effettuare il bonifico
3. Arianna riceve il bonifico → va nel dashboard → clicca **"Segna Pagato"**
4. Sistema: stato passa a `CONFIRMED`, `isPaid = true`
5. Cliente riceve email di conferma con allegato `.ics` e link gestione

### Scadenza automatica (cron job)
Se dopo 72 ore lo stato è ancora `PENDING`:
- Appuntamento cancellato automaticamente (`CANCELLED`)
- Email al cliente: "Prenotazione annullata, puoi riprenotare"
- Notifica ad Arianna

---

## 3. Cron Job Giornaliero

Eseguito ogni giorno alle **9:00 (ora italiana)** tramite Vercel Cron Jobs → `GET /api/cron/reminders`

La route è protetta da `CRON_SECRET` nell'header `Authorization: Bearer`.

### Operazioni eseguite

| Operazione | Condizione | Azione |
|-----------|-----------|--------|
| Promemoria | Appuntamenti `CONFIRMED` con data = tra 3 giorni | Email al cliente con dettagli e cosa portare |
| Scadenza bonifici | Appuntamenti `PENDING` con `createdAt` > 72h fa | Cancella + email cliente + notifica Arianna |
| Scadenza percorsi | Subscription `ACTIVE` con `expiresAt` < oggi | Passa a `EXHAUSTED` |

---

## 4. Gestione Appuntamento (lato cliente)

Accessibile dal link nell'email di conferma: `/gestisci/TOKEN`

Il token (`managementToken`) è univoco per ogni appuntamento e non scade.

### Regole per fascia temporale

| Fascia | Spostamento | Cancellazione |
|--------|------------|---------------|
| > 7 giorni | ✅ Max 3 volte totali | ✅ (rimborso completo contattando Arianna) |
| 2–7 giorni | ✅ Max 1 volta in questa fascia | ❌ Solo spostamento |
| < 24 ore | ❌ Contattare Arianna | ❌ Contattare Arianna |
| PENDING (bonifico) | ❌ Solo cancellazione | ✅ Libera |
| Gratuito | ✅ Stesse regole | ✅ Sempre |

**Contatori:**
- `rescheduleCount` — spostamenti totali (limite: 3)
- `rescheduleCountRestricted` — spostamenti nella fascia 2–7 giorni (limite: 1)

**Email inviate:**
- Arianna riceve notifica per ogni spostamento o cancellazione

---

## 5. Gestione Appuntamento (lato Arianna — dashboard)

Dashboard: `/admin`

### Azioni disponibili per ogni appuntamento

| Azione | Condizione | Effetto |
|--------|-----------|---------|
| Segna Pagato | Non pagato, non cancellato | `isPaid = true`, stato → `CONFIRMED`, email conferma al cliente |
| Conferma Ora | Stato `PENDING` | Stato → `CONFIRMED` |
| Sposta | Non cancellato, non completato | Mostra modal con calendario, aggiorna data/ora, email al cliente (nessun limite) |
| Segna Svolto | Stato `CONFIRMED` | Stato → `COMPLETED`, `usedSessions++`, email follow-up automatica se sessioni rimaste |
| Rimanda link follow-up | Stato `COMPLETED`, sessioni rimanenti > 0 | Rimanda email con link prenotazione follow-up |
| Annulla | Non cancellato, non completato | Stato → `CANCELLED` |

---

## 6. Percorsi Nutrizionali (3 e 6 Mesi)

### Struttura
- **Percorso 3 Mesi**: 3 sessioni, scadenza 6 mesi dalla prima visita
- **Percorso 6 Mesi VIP**: 6 sessioni, scadenza 12 mesi dalla prima visita

### Flusso follow-up
1. Arianna segna la visita come **"Svolta"** nel dashboard
2. Se `usedSessions < totalSessions` → email automatica al cliente con link follow-up
3. Link: `/prenota?followUp=FOLLOW_UP_TOKEN`
4. Cliente prenota la prossima sessione → agganciata alla subscription esistente
5. Se il cliente perde l'email → Arianna clicca **"Rimanda link follow-up"** dal dashboard

### Validazione token follow-up (`/api/follow-up`)
Il link è invalidato se:
- Subscription non più `ACTIVE`
- `expiresAt` nel passato → messaggio "sessioni scadute"
- `usedSessions >= totalSessions` → messaggio "sessioni esaurite"

### Scadenza automatica
Il cron job giornaliero marca come `EXHAUSTED` le subscription con `expiresAt` passato.

---

## 7. Policy di Cancellazione

Pagina pubblica: `/policy-cancellazione`

| Fascia | Spostamento | Rimborso |
|--------|------------|---------|
| > 7 giorni | Libero | Rimborso completo (contattare Arianna) |
| 2–7 giorni | 1 sola volta | Nessuno |
| < 24 ore | Solo contattando Arianna | Nessuno |
| No-show | — | Nessuno, seduta effettuata |

**Percorsi:**
- Nessun rimborso dopo la prima visita
- Sessioni scadono a 6/12 mesi dalla prima visita

**Bonifico:**
- Pagamento entro 72 ore altrimenti cancellazione automatica

---

## 8. Variabili d'Ambiente Rilevanti

| Variabile | Utilizzo |
|-----------|---------|
| `AUTH_URL` | URL base dell'app (usato nei link delle email e nelle chiamate interne) |
| `RESEND_API_KEY` | Invio email tramite Resend |
| `CRON_SECRET` | Protezione route cron job |
| `DATABASE_URL` | Connessione DB Supabase (pooler) |
| `DIRECT_URL` | Connessione diretta DB per migrazioni Prisma |

---

## 9. Modelli DB Coinvolti

```
Client
  └── Subscription (type, price, isPaid, totalSessions, usedSessions, expiresAt, followUpToken)
        └── Appointment (date, time, status, managementToken, rescheduleCount, rescheduleCountRestricted)
```

---

*Ultimo aggiornamento: 30 Maggio 2026*
