# Newsletter & Lead Magnet — Piano Implementazione

## Stato attuale
- Email transazionali: **Resend** (funzionante)
- Newsletter: **non implementata**
- Lead magnet: **non creato**

---

## Step 1 — Scegli e configura il servizio newsletter

**Raccomandato: [Brevo](https://www.brevo.com/)** (ex Sendinblue)
- Gratuito fino a 300 email/giorno, contatti illimitati
- Server europei → GDPR-compliant
- Gestisce liste, automazioni, template

**Da fare:**
- [ ] Creare account su brevo.com
- [ ] Creare una lista "Newsletter Viva Plant Nutrition"
- [ ] Generare API key (Settings → API Keys)
- [ ] Aggiungere `BREVO_API_KEY` alle variabili d'ambiente (Vercel + `.env.local`)

---

## Step 2 — Crea il lead magnet

Scegli uno di questi (PDF da 1-2 pagine):
- Lista della spesa plant-based essenziale
- 3 ricette veloci per iniziare
- Guida ai nutrienti da monitorare con dieta vegana
- Mini-guida su integratori indispensabili (vitamina B12, D3, ecc.)

**Da fare:**
- [ ] Arianna crea il contenuto
- [ ] Impaginare come PDF (Canva va benissimo)
- [ ] Salvare in `/public/documents/lead-magnet/` (es. `guida-plant-based.pdf`)

---

## Step 3 — Aggiungi form di iscrizione al sito

**Dove metterlo:**
- Homepage (sezione dedicata o footer)
- Pagina "Chi sono" (sidebar o sotto bio)
- Pop-up/banner opzionale (sconsigliato su mobile)

**Implementazione tecnica:**
- Nuova API route: `/api/subscribe` che chiama Brevo API
- Componente `NewsletterForm.tsx` con campo email + checkbox GDPR
- Testo proposto: *"Ricevi consigli pratici di nutrizione plant-based. Niente spam, solo contenuti utili."*

---

## Step 4 — GDPR

- [ ] Aggiornare Privacy Policy con menzione raccolta email e Brevo come data processor
- [ ] Checkbox obbligatorio nel form ("Accetto il trattamento dei dati per invio newsletter")
- [ ] Double opt-in (Brevo lo gestisce automaticamente se abilitato)

---

## Prompt per agente (da usare in una nuova chat)

```
Sto lavorando su un sito Next.js (App Router) per una nutrizionista plant-based.
Devo implementare una newsletter con lead magnet usando Brevo (ex Sendinblue).

Stack: Next.js 14, TypeScript strict, Tailwind CSS, next-intl (IT/DE/EN), Prisma/PostgreSQL.
Email transazionali già configurate con Resend.

Cosa serve:
1. API route /api/subscribe che riceve { email, locale } e aggiunge il contatto a una lista Brevo via API REST
2. Componente NewsletterForm.tsx con: campo email, checkbox GDPR obbligatorio, testo "Scarica la guida gratuita", bottone submit, gestione stati loading/success/error
3. La variabile d'ambiente BREVO_API_KEY è già configurata
4. Il componente deve funzionare con next-intl (useTranslations)
5. Dopo iscrizione, Brevo invia automaticamente il lead magnet (già configurato in Brevo come automation)

Inizia dall'API route, poi il componente.
```

---

## Note
- Non serve backend proprio: Brevo gestisce liste, automazioni e invio
- Il lead magnet può essere inviato via Brevo automation al momento dell'iscrizione (no codice extra)
- Considerare in futuro: segmentazione per lingua (lista IT, DE, EN separate)
