# Chatbot

Il sito usa un chatbot interno (nessun servizio esterno): `src/components/ChatWidget.tsx`.

## Come funziona

- Pattern matching lato client, nessuna chiamata API.
- Lingue: italiano, tedesco, inglese. La lingua è quella del locale nell'URL (fallback italiano).
- `PATTERNS[locale]` associa parole chiave a un intento (`detectIntent`), `RESPONSES[locale]` contiene le risposte (`getResponse`), `PROACTIVE[locale]` i messaggi proattivi per pagina.
- Intenti coperti: prezzi/servizi, prenotazione, gravidanza, transizione vegana, bambini, contatti, ecc.; se nulla corrisponde risponde con il fallback e rimanda ai contatti.

## Modificare o aggiungere risposte

1. Aggiungi le parole chiave in `PATTERNS` per **tutte e tre** le lingue.
2. Aggiungi la risposta in `RESPONSES` per tutte e tre le lingue.
3. Se serve un nuovo intento, estendi il tipo `Intent`.
