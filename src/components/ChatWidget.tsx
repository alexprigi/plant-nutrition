'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/i18n/locales';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickReplies?: QuickReply[];
}

interface QuickReply {
  text: string;
  query: string;
}

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    const parsed = parseInline(line, key++);
    elements.push(<div key={key++}>{parsed}</div>);
  }

  return elements;
}

function parseInline(text: string, baseKey: number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^\)]+|\/[^\)]*)\))/g;
  let last = 0;
  let match;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<span key={`${baseKey}-t${k++}`}>{text.slice(last, match.index)}</span>);
    }
    if (match[0].startsWith('**')) {
      parts.push(<strong key={`${baseKey}-b${k++}`} className="font-semibold">{match[2]}</strong>);
    } else {
      const href = match[4];
      const isExternal = href.startsWith('http');
      parts.push(
        <a
          key={`${baseKey}-l${k++}`}
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="underline decoration-dotted hover:decoration-solid"
          style={{ color: 'inherit', opacity: 0.9 }}
        >
          {match[3]}
        </a>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(<span key={`${baseKey}-t${k++}`}>{text.slice(last)}</span>);
  }

  return parts.length > 0 ? parts : [<span key={`${baseKey}-t0`}>{text}</span>];
}

const WHATSAPP = 'https://wa.me/393123456789';

type Intent =
  | 'saluto'
  | 'prezzi'
  | 'prenotazione'
  | 'gravidanza'
  | 'transizione'
  | 'bambini'
  | 'ricette'
  | 'chi_sono'
  | 'contatti'
  | 'nutrienti'
  | 'sport'
  | 'dimagrimento'
  | 'intolleranze'
  | 'blog'
  | 'consulenza_gratuita'
  | 'fallback';

interface Response {
  text: string;
  quickReplies?: QuickReply[];
}

// ============================================================
// PATTERNS
// ============================================================
const PATTERNS: Record<string, [RegExp, Intent][]> = {
  it: [
    [/ciao|buongiorno|buonasera|salve|hey|hei|buona/, 'saluto'],
    [/preg|incinta|gravid|matern|allattamento|mamma in attesa/, 'gravidanza'],
    [/bambin|figlio|figli|bimbo|bimba|svezzamento|neonato|piccolo|piccola/, 'bambini'],
    [/prezzo|prezzi|costo|costi|quanto costa|quanto vengono|tariffe|pacchett/, 'prezzi'],
    [/gratis|gratuita|gratuito|free|conoscitiv/, 'consulenza_gratuita'],
    [/prenot|appuntament|disponibilit|quando posso|fissare|slot|seduta/, 'prenotazione'],
    [/transizion|diventare vegano|iniziare|passare al veganesimo|diventare vegetariano|plant.based/, 'transizione'],
    [/ricetta|ricette|menu|cosa mangiare|idee pasto|piatto|colazione|pranzo|cena/, 'ricette'],
    [/chi sei|chi è arianna|nutrizionist|qualifica|esperienz|laurea|studio/, 'chi_sono'],
    [/contatto|contatti|email|telefono|whatsapp|scrivere|raggiunger|instagram/, 'contatti'],
    [/b12|ferro|calcio|proteine|vitamina|carenza|nutrienti|omega|integratori|supplementi/, 'nutrienti'],
    [/sport|palestra|muscoli|performance|atleta|allenamento|fitness|corsa/, 'sport'],
    [/dimagri|perdere peso|dieta|calorie|peso|sovrappeso|obesit/, 'dimagrimento'],
    [/intolleranza|allergia|celiachia|glutine|lattosio|soia/, 'intolleranze'],
    [/blog|articol|news|legger|approfondiment/, 'blog'],
  ],
  de: [
    [/hallo|guten morgen|guten abend|guten tag|hi|hey|servus/, 'saluto'],
    [/schwanger|schwangerschaft|stillend|mutter|mutterschaft|stillen/, 'gravidanza'],
    [/kind|kinder|baby|kleinkind|beikost|säugling/, 'bambini'],
    [/preis|preise|kosten|wie viel|was kostet|tarif|paket/, 'prezzi'],
    [/gratis|kostenlos|free|kennenlern/, 'consulenza_gratuita'],
    [/buchen|termin|verfügbarkeit|wann kann|vereinbaren|slot|sitzung/, 'prenotazione'],
    [/übergang|vegan werden|anfangen|wechsel|pflanzlich|plant.based/, 'transizione'],
    [/rezept|rezepte|menü|was essen|mahlzeit|gericht|frühstück|mittagessen|abendessen/, 'ricette'],
    [/wer bist|wer ist arianna|ernährungsberaterin|qualifikation|erfahrung|studium/, 'chi_sono'],
    [/kontakt|email|telefon|whatsapp|schreiben|erreichen|instagram/, 'contatti'],
    [/b12|eisen|kalzium|protein|vitamin|mangel|nährstoffe|omega|nahrungsergänzung/, 'nutrienti'],
    [/sport|fitnessstudio|muskeln|leistung|athlet|training|fitness|laufen/, 'sport'],
    [/abnehmen|gewicht verlieren|diät|kalorien|gewicht|übergewicht|fettleibigkeit/, 'dimagrimento'],
    [/unverträglichkeit|allergie|zöliakie|gluten|laktose|soja/, 'intolleranze'],
    [/blog|artikel|news|lesen|vertiefung/, 'blog'],
  ],
  en: [
    [/hello|good morning|good evening|hi|hey/, 'saluto'],
    [/pregnant|pregnancy|breastfeeding|maternity|nursing|expecting/, 'gravidanza'],
    [/children|child|baby|infant|weaning|toddler|kids/, 'bambini'],
    [/price|prices|cost|how much|rates|package/, 'prezzi'],
    [/free consultation|free|gratis|introductory/, 'consulenza_gratuita'],
    [/book|appointment|availability|when can|schedule|slot|session/, 'prenotazione'],
    [/transition|become vegan|start vegan|switch|plant.based/, 'transizione'],
    [/recipe|recipes|menu|what to eat|meal|dish|breakfast|lunch|dinner/, 'ricette'],
    [/who are you|who is arianna|nutritionist|qualification|experience|degree/, 'chi_sono'],
    [/contact|email|phone|whatsapp|write|reach|instagram/, 'contatti'],
    [/b12|iron|calcium|protein|vitamin|deficiency|nutrients|omega|supplements/, 'nutrienti'],
    [/sport|gym|muscles|performance|athlete|training|fitness|running/, 'sport'],
    [/lose weight|weight loss|diet|calories|weight|overweight|obesity/, 'dimagrimento'],
    [/intolerance|allergy|celiac|gluten|lactose|soy/, 'intolleranze'],
    [/blog|article|news|read|insights/, 'blog'],
  ],
};

function detectIntent(msg: string, locale: string): Intent {
  const patterns = PATTERNS[locale] ?? PATTERNS.it;
  for (const [pattern, intent] of patterns) {
    if (pattern.test(msg)) return intent;
  }
  return 'fallback';
}

// ============================================================
// RESPONSES
// ============================================================
const RESPONSES: Record<string, Record<Intent, Response>> = {
  it: {
    saluto: {
      text: "Ciao! 👋 Sono l'assistente virtuale di **Viva Plant Nutrition**.\n\nCome posso aiutarti oggi?",
      quickReplies: [
        { text: '💰 Prezzi', query: 'Quali sono i prezzi?' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        { text: '🤰 Gravidanza', query: 'Nutrizione in gravidanza' },
        { text: '🌱 Transizione vegana', query: 'Come iniziare la transizione vegana' },
      ],
    },
    prezzi: {
      text: "Ecco i servizi disponibili:\n\n💚 **Consulenza Breve** (30 min) — 40€\nCheck rapido su valori o supplementi\n\n🌿 **Consulenza Standard** (60 min) — 85€\nAnalisi completa con piano nutrizionale PDF\n\n🌟 **Pacchetto Doppio** (2×60 min) — 149€\nDue sessioni a prezzo vantaggioso\n\n⭐ **Percorso Completo** (3 mesi) — 499€\n6 consulenze + supporto WhatsApp + materiali\n\n🎁 La prima consulenza conoscitiva di **15 min è gratuita!**",
      quickReplies: [
        { text: '🎁 Consulenza gratuita', query: 'Come funziona la consulenza gratuita?' },
        { text: '📅 Prenota ora', query: 'Voglio prenotare una consulenza' },
        { text: '❓ Hai domande?', query: 'Ho una domanda specifica' },
      ],
    },
    consulenza_gratuita: {
      text: "🎁 Sì! Arianna offre una **consulenza conoscitiva gratuita di 15 minuti**.\n\nÈ pensata per:\n• Capire le tue esigenze\n• Conoscere il metodo di lavoro\n• Valutare insieme il percorso più adatto\n\nSenza impegno, completamente gratis! 😊\n\n[Prenota la consulenza gratuita](/booking)",
      quickReplies: [
        { text: '📅 Prenota ora', query: 'Voglio prenotare una consulenza' },
        { text: '💰 Vedi tutti i prezzi', query: 'Quali sono i prezzi?' },
      ],
    },
    prenotazione: {
      text: `📅 Puoi prenotare direttamente online — è semplice e veloce!\n\n[➡️ Vai alla prenotazione](/booking)\n\nIn alternativa:\n📧 [info@vivaplantnutrition.com](mailto:info@vivaplantnutrition.com)\n📱 [Scrivimi su WhatsApp](${WHATSAPP})\n\n🎁 Ricorda: la prima consulenza conoscitiva di 15 min è **gratuita**!`,
      quickReplies: [
        { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
        { text: '🤰 Gravidanza', query: 'Nutrizione in gravidanza' },
        { text: '🌱 Transizione vegana', query: 'Come iniziare la transizione vegana' },
      ],
    },
    gravidanza: {
      text: "🤰 Una dieta vegana in gravidanza è sicura e salutare, se ben pianificata.\n\nArianna è specializzata proprio in questo e ti aiuta con:\n\n✓ Piano alimentare bilanciato per ogni trimestre\n✓ Integrazione corretta (B12, ferro, omega-3, iodio)\n✓ Gestione nausee e variazioni di appetito\n✓ Monitoraggio valori ematici\n✓ Alimentazione durante l'allattamento\n\nMolte sue clienti hanno vissuto gravidanze vegane serene e i loro bambini sono cresciuti in salute! 💚\n\n[Prenota una consulenza](/booking)",
      quickReplies: [
        { text: '👶 Bambini vegani', query: 'Alimentazione vegana per bambini' },
        { text: '💊 Nutrienti chiave', query: 'Quali nutrienti monitorare?' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
      ],
    },
    bambini: {
      text: "👶 Sì, i bambini possono crescere sani e forti con una dieta vegana!\n\nArianna ti supporta in ogni fase:\n\n✓ Svezzamento vegano (dai 6 mesi)\n✓ Menu equilibrati per ogni fascia d'età\n✓ Integratori necessari (B12, vitamina D, ferro)\n✓ Gestione dei capricci a tavola\n✓ Lunchbox creativi per la scuola\n✓ Crescita e sviluppo monitorati\n\nTante famiglie che segue hanno bambini vegani sereni e in ottima salute! 🌈",
      quickReplies: [
        { text: '🤰 Gravidanza', query: 'Nutrizione in gravidanza' },
        { text: '💊 Nutrienti chiave', query: 'Quali nutrienti monitorare?' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
      ],
    },
    transizione: {
      text: "🌱 Bellissimo percorso che vuoi intraprendere!\n\nArianna ti accompagna gradualmente verso un'alimentazione 100% vegetale, senza stress:\n\n1️⃣ Analisi delle tue abitudini attuali\n2️⃣ Piano di transizione personalizzato e graduale\n3️⃣ Ricette semplici e gustose per iniziare\n4️⃣ Strategie per la vita sociale (ristoranti, cene, viaggi)\n5️⃣ Monitoraggio dei nutrienti durante il cambiamento\n\nNessuna rinuncia forzata — solo nuove scoperte! 😊\n\n[Scopri il percorso](/services)",
      quickReplies: [
        { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
        { text: '🍽️ Ricette', query: 'Voglio vedere le ricette' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
      ],
    },
    ricette: {
      text: "🍽️ La sezione ricette è in arrivo — ci stiamo lavorando!\n\nNel frattempo, durante la consulenza Arianna crea un **piano pasti personalizzato** su misura per te, con ricette pratiche e bilanciate.",
      quickReplies: [
        { text: '📅 Prenota consulenza', query: 'Voglio prenotare una consulenza' },
        { text: '🌱 Transizione vegana', query: 'Come iniziare la transizione vegana' },
      ],
    },
    chi_sono: {
      text: "Sono l'assistente di **Arianna Ciervo**, nutrizionista specializzata in alimentazione vegetale 🌿\n\nArianna aiuta persone di ogni età — singoli, famiglie e mamme in gravidanza — a vivere al meglio con una dieta vegana bilanciata.\n\nLe sue specializzazioni:\n🤰 Nutrizione in gravidanza e allattamento\n👶 Svezzamento e alimentazione dei bambini\n🌱 Transizione verso l'alimentazione vegana\n💪 Nutrizione sportiva plant-based\n\n[Scopri di più su Arianna](/about)",
      quickReplies: [
        { text: '💰 Prezzi', query: 'Quali sono i prezzi?' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
      ],
    },
    contatti: {
      text: `📬 Ecco tutti i modi per contattare Arianna:\n\n📧 **Email**: [info@vivaplantnutrition.com](mailto:info@vivaplantnutrition.com)\n📱 **WhatsApp**: [Scrivimi ora](${WHATSAPP})\n💬 **Telegram**: @vivaplantnutrition\n📷 **Instagram**: [@vivaplantnutrition](https://instagram.com/vivaplantnutrition)\n\nOppure [compila il form contatti](/contact) — Arianna risponde entro 24 ore!`,
      quickReplies: [
        { text: '📅 Prenota online', query: 'Voglio prenotare una consulenza' },
      ],
    },
    nutrienti: {
      text: "💊 Ottima attenzione ai nutrienti!\n\nCon una dieta vegana ben pianificata si ottiene tutto il necessario. I nutrienti da monitorare:\n\n🔴 **Vitamina B12** — integrazione obbligatoria\n🟠 **Ferro** — legumi, semi di zucca + vitamina C\n🟡 **Calcio** — verdure a foglia, tofu, bevande vegetali\n🟢 **Omega-3** — semi di lino, noci, alghe\n🔵 **Vitamina D** — sole + integrazione in inverno\n🟣 **Proteine** — legumi, tofu, seitan, tempeh\n\nDurante la consulenza Arianna analizza i tuoi valori e crea un piano su misura! 📊\n\n[Prenota una consulenza](/booking)",
      quickReplies: [
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        { text: '🌱 Transizione vegana', query: 'Come iniziare la transizione vegana' },
      ],
    },
    sport: {
      text: "💪 Gli atleti vegani esistono eccome — e ottengono risultati straordinari!\n\nArianna ti aiuta a ottimizzare le performance con:\n\n✓ Piano alimentare calibrato sul tuo sport\n✓ Timing dei pasti e pre/post allenamento\n✓ Fonti proteiche vegetali per la massa muscolare\n✓ Recupero e riduzione dell'infiammazione\n✓ Integrazione specifica per atleti\n\nForza, energia e risultati garantiti! 🏃‍♀️\n\n[Scopri i servizi](/services)",
      quickReplies: [
        { text: '💊 Nutrienti chiave', query: 'Quali nutrienti monitorare?' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
      ],
    },
    dimagrimento: {
      text: "⚖️ La dieta vegana è spesso associata a un peso corporeo più sano, ma ogni percorso è personale.\n\nArianna ti aiuta a:\n\n✓ Raggiungere il peso forma in modo sano e duraturo\n✓ Creare un piano calorico bilanciato senza carenze\n✓ Evitare le trappole degli alimenti vegani ultra-processati\n✓ Costruire un rapporto positivo con il cibo\n\nNessuna dieta restrittiva — un cambio di stile di vita! 💚\n\n[Prenota una consulenza](/booking)",
      quickReplies: [
        { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
      ],
    },
    intolleranze: {
      text: "🌾 Intolleranze e allergie non sono un ostacolo per un'alimentazione vegana!\n\nArianna ha esperienza con:\n\n✓ Celiachia e sensibilità al glutine\n✓ Intolleranza al lattosio (già escluso nel vegano!)\n✓ Allergie alla soia — alternative proteiche complete\n✓ Allergie alla frutta secca — sostituti nutrienti\n✓ Intolleranze multiple combinate\n\nOgni piano è completamente personalizzato sulle tue esigenze.\n\n[Prenota una consulenza](/booking)",
      quickReplies: [
        { text: '💊 Nutrienti chiave', query: 'Quali nutrienti monitorare?' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
      ],
    },
    blog: {
      text: "📖 Il blog è in arrivo — ci stiamo lavorando!\n\nPer approfondimenti personalizzati puoi prenotare una consulenza con Arianna, oppure seguirla su Instagram per consigli e aggiornamenti.",
      quickReplies: [
        { text: '📷 Instagram', query: 'Come posso contattarti?' },
        { text: '📅 Prenota consulenza', query: 'Voglio prenotare una consulenza' },
      ],
    },
    fallback: {
      text: `Grazie per la tua domanda! 😊\n\nPer una risposta personalizzata ti consiglio di:\n\n📅 [Prenotare una consulenza gratuita](/booking)\n📱 [Scrivermi su WhatsApp](${WHATSAPP})\n📧 [Inviarmi un'email](/contact)\n\nArianna risponde personalmente entro 24 ore! 💚`,
      quickReplies: [
        { text: '📅 Prenota gratis', query: 'Voglio prenotare una consulenza' },
        { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
        { text: '📬 Contatti', query: 'Come posso contattarti?' },
      ],
    },
  },

  de: {
    saluto: {
      text: "Hallo! 👋 Ich bin der virtuelle Assistent von **Viva Plant Nutrition**.\n\nWie kann ich dir heute helfen?",
      quickReplies: [
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
        { text: '🤰 Schwangerschaft', query: 'Ernährung in der Schwangerschaft' },
        { text: '🌱 Vegane Ernährung', query: 'Wie fange ich mit veganer Ernährung an?' },
      ],
    },
    prezzi: {
      text: "Hier sind die verfügbaren Leistungen:\n\n💚 **Kurze Beratung** (30 Min.) — 40€\nSchneller Check für Werte oder Nahrungsergänzung\n\n🌿 **Standard-Beratung** (60 Min.) — 85€\nVollständige Analyse mit PDF-Ernährungsplan\n\n🌟 **Doppelpaket** (2×60 Min.) — 149€\nZwei Sitzungen zum Vorteilspreis\n\n⭐ **Komplettpaket** (3 Monate) — 499€\n6 Beratungen + WhatsApp-Support + Materialien\n\n🎁 Das erste Kennenlerngespräch von **15 Min. ist kostenlos!**",
      quickReplies: [
        { text: '🎁 Kostenlose Beratung', query: 'Wie funktioniert das kostenlose Gespräch?' },
        { text: '📅 Jetzt buchen', query: 'Ich möchte einen Termin buchen' },
        { text: '❓ Fragen?', query: 'Ich habe eine spezifische Frage' },
      ],
    },
    consulenza_gratuita: {
      text: "🎁 Ja! Arianna bietet ein **kostenloses Kennenlerngespräch von 15 Minuten** an.\n\nEs ist gedacht um:\n• Deine Bedürfnisse kennenzulernen\n• Die Arbeitsmethode vorzustellen\n• Gemeinsam den passenden Weg zu finden\n\nOhne Verpflichtung, völlig kostenlos! 😊\n\n[Kostenloses Gespräch buchen](/booking)",
      quickReplies: [
        { text: '📅 Jetzt buchen', query: 'Ich möchte einen Termin buchen' },
        { text: '💰 Alle Preise anzeigen', query: 'Was kosten die Beratungen?' },
      ],
    },
    prenotazione: {
      text: `📅 Du kannst direkt online buchen — einfach und schnell!\n\n[➡️ Zur Buchung](/booking)\n\nOder alternativ:\n📧 [info@vivaplantnutrition.com](mailto:info@vivaplantnutrition.com)\n📱 [WhatsApp schreiben](${WHATSAPP})\n\n🎁 Denk daran: Das erste Kennenlerngespräch von 15 Min. ist **kostenlos**!`,
      quickReplies: [
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
        { text: '🤰 Schwangerschaft', query: 'Ernährung in der Schwangerschaft' },
        { text: '🌱 Vegane Ernährung', query: 'Wie fange ich mit veganer Ernährung an?' },
      ],
    },
    gravidanza: {
      text: "🤰 Eine vegane Ernährung in der Schwangerschaft ist sicher und gesund, wenn sie gut geplant ist.\n\nArianna ist genau darauf spezialisiert und hilft dir mit:\n\n✓ Ausgewogener Ernährungsplan für jedes Trimester\n✓ Richtige Supplementierung (B12, Eisen, Omega-3, Jod)\n✓ Umgang mit Übelkeit und Appetitveränderungen\n✓ Überwachung der Blutwerte\n✓ Ernährung während der Stillzeit\n\nViele Klientinnen haben entspannte vegane Schwangerschaften erlebt! 💚\n\n[Beratung buchen](/booking)",
      quickReplies: [
        { text: '👶 Vegane Kinder', query: 'Vegane Ernährung für Kinder' },
        { text: '💊 Wichtige Nährstoffe', query: 'Welche Nährstoffe sollte ich überwachen?' },
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    bambini: {
      text: "👶 Ja, Kinder können gesund und stark mit einer veganen Ernährung aufwachsen!\n\nArianna begleitet dich in jeder Phase:\n\n✓ Vegane Beikost (ab 6 Monaten)\n✓ Ausgewogene Menüs für jede Altersgruppe\n✓ Notwendige Nahrungsergänzung (B12, Vitamin D, Eisen)\n✓ Umgang mit Essensverweigerung\n✓ Kreative Lunchboxen für die Schule\n✓ Wachstum und Entwicklung überwacht\n\nViele Familien haben glückliche vegane Kinder! 🌈",
      quickReplies: [
        { text: '🤰 Schwangerschaft', query: 'Ernährung in der Schwangerschaft' },
        { text: '💊 Wichtige Nährstoffe', query: 'Welche Nährstoffe sollte ich überwachen?' },
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    transizione: {
      text: "🌱 Was für ein wunderbarer Weg, den du einschlagen möchtest!\n\nArianna begleitet dich schrittweise zu einer 100% pflanzlichen Ernährung, ohne Stress:\n\n1️⃣ Analyse deiner aktuellen Gewohnheiten\n2️⃣ Personalisierter und schrittweiser Übergangsplan\n3️⃣ Einfache und leckere Rezepte zum Starten\n4️⃣ Strategien für das soziale Leben (Restaurants, Dinner, Reisen)\n5️⃣ Nährstoffüberwachung während des Wandels\n\nKein erzwungener Verzicht — nur neue Entdeckungen! 😊\n\n[Leistungen entdecken](/services)",
      quickReplies: [
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
        { text: '🍽️ Rezepte', query: 'Ich möchte Rezepte sehen' },
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    ricette: {
      text: "🍽️ Der Rezeptbereich kommt bald — wir arbeiten daran!\n\nIn der Zwischenzeit erstellt Arianna während der Beratung einen **personalisierten Ernährungsplan** speziell für dich, mit praktischen und ausgewogenen Rezepten.",
      quickReplies: [
        { text: '📅 Beratung buchen', query: 'Ich möchte einen Termin buchen' },
        { text: '🌱 Vegane Ernährung', query: 'Wie fange ich mit veganer Ernährung an?' },
      ],
    },
    chi_sono: {
      text: "Ich bin der Assistent von **Arianna Ciervo**, einer auf pflanzliche Ernährung spezialisierten Ernährungsberaterin 🌿\n\nArianna hilft Menschen jeden Alters — Einzelpersonen, Familien und werdenden Müttern — mit einer ausgewogenen veganen Ernährung bestmöglich zu leben.\n\nIhre Spezialisierungen:\n🤰 Ernährung in Schwangerschaft und Stillzeit\n👶 Beikost und Kindernährung\n🌱 Übergang zur veganen Ernährung\n💪 Pflanzliche Sporternährung\n\n[Mehr über Arianna erfahren](/about)",
      quickReplies: [
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    contatti: {
      text: `📬 Hier sind alle Möglichkeiten, Arianna zu kontaktieren:\n\n📧 **E-Mail**: [info@vivaplantnutrition.com](mailto:info@vivaplantnutrition.com)\n📱 **WhatsApp**: [Jetzt schreiben](${WHATSAPP})\n💬 **Telegram**: @vivaplantnutrition\n📷 **Instagram**: [@vivaplantnutrition](https://instagram.com/vivaplantnutrition)\n\nOder [fülle das Kontaktformular aus](/contact) — Arianna antwortet innerhalb von 24 Stunden!`,
      quickReplies: [
        { text: '📅 Online buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    nutrienti: {
      text: "💊 Super, dass du auf Nährstoffe achtest!\n\nMit einer gut geplanten veganen Ernährung bekommst du alles Notwendige. Zu überwachende Nährstoffe:\n\n🔴 **Vitamin B12** — unbedingt supplementieren\n🟠 **Eisen** — Hülsenfrüchte, Kürbiskerne + Vitamin C\n🟡 **Kalzium** — Blattgemüse, Tofu, Pflanzenmilch\n🟢 **Omega-3** — Leinsamen, Walnüsse, Algen\n🔵 **Vitamin D** — Sonne + Supplementierung im Winter\n🟣 **Protein** — Hülsenfrüchte, Tofu, Seitan, Tempeh\n\nBei der Beratung analysiert Arianna deine Werte und erstellt einen maßgeschneiderten Plan! 📊\n\n[Beratung buchen](/booking)",
      quickReplies: [
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
        { text: '🌱 Vegane Ernährung', query: 'Wie fange ich mit veganer Ernährung an?' },
      ],
    },
    sport: {
      text: "💪 Vegane Sportler gibt es wirklich — und sie erzielen außergewöhnliche Ergebnisse!\n\nArianna hilft dir, die Leistung zu optimieren mit:\n\n✓ Ernährungsplan abgestimmt auf deine Sportart\n✓ Mahlzeitenzeiten und Vor-/Nachtraining\n✓ Pflanzliche Proteinquellen für Muskelmasse\n✓ Erholung und Entzündungsreduktion\n✓ Spezifische Supplementierung für Sportler\n\nKraft, Energie und Ergebnisse garantiert! 🏃‍♀️\n\n[Leistungen entdecken](/services)",
      quickReplies: [
        { text: '💊 Wichtige Nährstoffe', query: 'Welche Nährstoffe sollte ich überwachen?' },
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    dimagrimento: {
      text: "⚖️ Eine vegane Ernährung wird oft mit einem gesünderen Körpergewicht assoziiert, aber jeder Weg ist persönlich.\n\nArianna hilft dir:\n\n✓ Das Idealgewicht auf gesunde und dauerhafte Weise zu erreichen\n✓ Einen ausgewogenen Kalorienplan ohne Mangelernährung zu erstellen\n✓ Die Fallen von ultra-verarbeiteten veganen Lebensmitteln zu vermeiden\n✓ Eine positive Beziehung zum Essen aufzubauen\n\nKeine Diät — eine Lebensveränderung! 💚\n\n[Beratung buchen](/booking)",
      quickReplies: [
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    intolleranze: {
      text: "🌾 Unverträglichkeiten und Allergien sind kein Hindernis für eine vegane Ernährung!\n\nArianna hat Erfahrung mit:\n\n✓ Zöliakie und Glutensensitivität\n✓ Laktoseintoleranz (bei veganer Ernährung ohnehin kein Thema!)\n✓ Sojaallergie — vollständige Proteinalternativen\n✓ Nussallergien — nährstoffreiche Alternativen\n✓ Kombinierte Mehrfachintoleranzen\n\nJeder Plan ist vollständig auf deine Bedürfnisse zugeschnitten.\n\n[Beratung buchen](/booking)",
      quickReplies: [
        { text: '💊 Wichtige Nährstoffe', query: 'Welche Nährstoffe sollte ich überwachen?' },
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    blog: {
      text: "📖 Das Blog kommt bald — wir arbeiten daran!\n\nFür personalisierte Informationen kannst du eine Beratung mit Arianna buchen oder ihr auf Instagram folgen für Tipps und Updates.",
      quickReplies: [
        { text: '📷 Instagram', query: 'Wie kann ich Arianna kontaktieren?' },
        { text: '📅 Beratung buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    fallback: {
      text: `Danke für deine Frage! 😊\n\nFür eine persönliche Antwort empfehle ich dir:\n\n📅 [Eine kostenlose Beratung buchen](/booking)\n📱 [WhatsApp schreiben](${WHATSAPP})\n📧 [Eine E-Mail senden](/contact)\n\nArianna antwortet persönlich innerhalb von 24 Stunden! 💚`,
      quickReplies: [
        { text: '📅 Kostenlos buchen', query: 'Ich möchte einen Termin buchen' },
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
        { text: '📬 Kontakt', query: 'Wie kann ich Arianna kontaktieren?' },
      ],
    },
  },

  en: {
    saluto: {
      text: "Hello! 👋 I'm the virtual assistant for **Viva Plant Nutrition**.\n\nHow can I help you today?",
      quickReplies: [
        { text: '💰 Prices', query: 'What are the prices?' },
        { text: '📅 Book', query: 'I want to book a consultation' },
        { text: '🤰 Pregnancy', query: 'Nutrition during pregnancy' },
        { text: '🌱 Plant-based', query: 'How to start a plant-based diet' },
      ],
    },
    prezzi: {
      text: "Here are the available services:\n\n💚 **Short Consultation** (30 min) — €40\nQuick check on values or supplements\n\n🌿 **Standard Consultation** (60 min) — €85\nFull analysis with PDF nutrition plan\n\n🌟 **Double Package** (2×60 min) — €149\nTwo sessions at a discounted price\n\n⭐ **Complete Program** (3 months) — €499\n6 consultations + WhatsApp support + materials\n\n🎁 The first introductory consultation of **15 min is free!**",
      quickReplies: [
        { text: '🎁 Free consultation', query: 'How does the free consultation work?' },
        { text: '📅 Book now', query: 'I want to book a consultation' },
        { text: '❓ Questions?', query: 'I have a specific question' },
      ],
    },
    consulenza_gratuita: {
      text: "🎁 Yes! Arianna offers a **free 15-minute introductory consultation**.\n\nIt's designed to:\n• Understand your needs\n• Get to know the working method\n• Together find the most suitable path\n\nNo commitment, completely free! 😊\n\n[Book the free consultation](/booking)",
      quickReplies: [
        { text: '📅 Book now', query: 'I want to book a consultation' },
        { text: '💰 See all prices', query: 'What are the prices?' },
      ],
    },
    prenotazione: {
      text: `📅 You can book directly online — simple and fast!\n\n[➡️ Go to booking](/booking)\n\nAlternatively:\n📧 [info@vivaplantnutrition.com](mailto:info@vivaplantnutrition.com)\n📱 [Message on WhatsApp](${WHATSAPP})\n\n🎁 Remember: the first 15-min introductory consultation is **free**!`,
      quickReplies: [
        { text: '💰 See prices', query: 'What are the prices?' },
        { text: '🤰 Pregnancy', query: 'Nutrition during pregnancy' },
        { text: '🌱 Plant-based', query: 'How to start a plant-based diet' },
      ],
    },
    gravidanza: {
      text: "🤰 A vegan diet during pregnancy is safe and healthy, when well planned.\n\nArianna specializes in this and helps you with:\n\n✓ Balanced nutrition plan for each trimester\n✓ Correct supplementation (B12, iron, omega-3, iodine)\n✓ Managing nausea and appetite changes\n✓ Monitoring blood values\n✓ Nutrition during breastfeeding\n\nMany of her clients have had peaceful vegan pregnancies and their babies grew up healthy! 💚\n\n[Book a consultation](/booking)",
      quickReplies: [
        { text: '👶 Vegan children', query: 'Vegan nutrition for children' },
        { text: '💊 Key nutrients', query: 'Which nutrients should I monitor?' },
        { text: '📅 Book', query: 'I want to book a consultation' },
      ],
    },
    bambini: {
      text: "👶 Yes, children can grow healthy and strong on a vegan diet!\n\nArianna supports you in every phase:\n\n✓ Vegan weaning (from 6 months)\n✓ Balanced menus for every age group\n✓ Necessary supplements (B12, vitamin D, iron)\n✓ Handling picky eaters\n✓ Creative school lunchboxes\n✓ Growth and development monitored\n\nMany families have happy and healthy vegan children! 🌈",
      quickReplies: [
        { text: '🤰 Pregnancy', query: 'Nutrition during pregnancy' },
        { text: '💊 Key nutrients', query: 'Which nutrients should I monitor?' },
        { text: '📅 Book', query: 'I want to book a consultation' },
      ],
    },
    transizione: {
      text: "🌱 What a wonderful journey you want to embark on!\n\nArianna guides you gradually towards a 100% plant-based diet, stress-free:\n\n1️⃣ Analysis of your current habits\n2️⃣ Personalized and gradual transition plan\n3️⃣ Simple and tasty recipes to get started\n4️⃣ Strategies for social life (restaurants, dinners, travels)\n5️⃣ Nutrient monitoring during the change\n\nNo forced sacrifice — only new discoveries! 😊\n\n[Discover the services](/services)",
      quickReplies: [
        { text: '💰 See prices', query: 'What are the prices?' },
        { text: '🍽️ Recipes', query: 'I want to see recipes' },
        { text: '📅 Book', query: 'I want to book a consultation' },
      ],
    },
    ricette: {
      text: "🍽️ The recipes section is coming soon — we're working on it!\n\nIn the meantime, during the consultation Arianna creates a **personalized meal plan** tailored for you, with practical and balanced recipes.",
      quickReplies: [
        { text: '📅 Book consultation', query: 'I want to book a consultation' },
        { text: '🌱 Plant-based diet', query: 'How to start a plant-based diet' },
      ],
    },
    chi_sono: {
      text: "I'm the assistant for **Arianna Ciervo**, a nutritionist specializing in plant-based nutrition 🌿\n\nArianna helps people of all ages — individuals, families and expectant mothers — to live their best with a balanced vegan diet.\n\nHer specializations:\n🤰 Nutrition during pregnancy and breastfeeding\n👶 Weaning and children's nutrition\n🌱 Transition to plant-based diet\n💪 Plant-based sports nutrition\n\n[Learn more about Arianna](/about)",
      quickReplies: [
        { text: '💰 Prices', query: 'What are the prices?' },
        { text: '📅 Book', query: 'I want to book a consultation' },
      ],
    },
    contatti: {
      text: `📬 Here are all the ways to contact Arianna:\n\n📧 **Email**: [info@vivaplantnutrition.com](mailto:info@vivaplantnutrition.com)\n📱 **WhatsApp**: [Message now](${WHATSAPP})\n💬 **Telegram**: @vivaplantnutrition\n📷 **Instagram**: [@vivaplantnutrition](https://instagram.com/vivaplantnutrition)\n\nOr [fill out the contact form](/contact) — Arianna replies within 24 hours!`,
      quickReplies: [
        { text: '📅 Book online', query: 'I want to book a consultation' },
      ],
    },
    nutrienti: {
      text: "💊 Great attention to nutrients!\n\nWith a well-planned vegan diet you get everything you need. Nutrients to monitor:\n\n🔴 **Vitamin B12** — supplementation required\n🟠 **Iron** — legumes, pumpkin seeds + vitamin C\n🟡 **Calcium** — leafy vegetables, tofu, plant milk\n🟢 **Omega-3** — flaxseeds, walnuts, algae\n🔵 **Vitamin D** — sun + supplementation in winter\n🟣 **Protein** — legumes, tofu, seitan, tempeh\n\nDuring the consultation Arianna analyzes your values and creates a tailored plan! 📊\n\n[Book a consultation](/booking)",
      quickReplies: [
        { text: '📅 Book', query: 'I want to book a consultation' },
        { text: '🌱 Plant-based diet', query: 'How to start a plant-based diet' },
      ],
    },
    sport: {
      text: "💪 Vegan athletes definitely exist — and they achieve extraordinary results!\n\nArianna helps you optimize performance with:\n\n✓ Nutrition plan calibrated to your sport\n✓ Meal timing and pre/post workout\n✓ Plant protein sources for muscle mass\n✓ Recovery and inflammation reduction\n✓ Specific supplementation for athletes\n\nStrength, energy and results guaranteed! 🏃‍♀️\n\n[Discover the services](/services)",
      quickReplies: [
        { text: '💊 Key nutrients', query: 'Which nutrients should I monitor?' },
        { text: '📅 Book', query: 'I want to book a consultation' },
      ],
    },
    dimagrimento: {
      text: "⚖️ A vegan diet is often associated with a healthier body weight, but every journey is personal.\n\nArianna helps you:\n\n✓ Reach your ideal weight in a healthy and lasting way\n✓ Create a balanced caloric plan without deficiencies\n✓ Avoid the pitfalls of ultra-processed vegan foods\n✓ Build a positive relationship with food\n\nNo restrictive diet — a lifestyle change! 💚\n\n[Book a consultation](/booking)",
      quickReplies: [
        { text: '💰 See prices', query: 'What are the prices?' },
        { text: '📅 Book', query: 'I want to book a consultation' },
      ],
    },
    intolleranze: {
      text: "🌾 Intolerances and allergies are not an obstacle to a vegan diet!\n\nArianna has experience with:\n\n✓ Celiac disease and gluten sensitivity\n✓ Lactose intolerance (already excluded in vegan diet!)\n✓ Soy allergy — complete protein alternatives\n✓ Nut allergies — nutritious substitutes\n✓ Combined multiple intolerances\n\nEvery plan is completely personalized to your needs.\n\n[Book a consultation](/booking)",
      quickReplies: [
        { text: '💊 Key nutrients', query: 'Which nutrients should I monitor?' },
        { text: '📅 Book', query: 'I want to book a consultation' },
      ],
    },
    blog: {
      text: "📖 The blog is coming soon — we're working on it!\n\nFor personalized insights you can book a consultation with Arianna, or follow her on Instagram for tips and updates.",
      quickReplies: [
        { text: '📷 Instagram', query: 'How can I contact Arianna?' },
        { text: '📅 Book consultation', query: 'I want to book a consultation' },
      ],
    },
    fallback: {
      text: `Thank you for your question! 😊\n\nFor a personalized answer I recommend:\n\n📅 [Book a free consultation](/booking)\n📱 [Message on WhatsApp](${WHATSAPP})\n📧 [Send an email](/contact)\n\nArianna replies personally within 24 hours! 💚`,
      quickReplies: [
        { text: '📅 Book for free', query: 'I want to book a consultation' },
        { text: '💰 See prices', query: 'What are the prices?' },
        { text: '📬 Contact', query: 'How can I contact Arianna?' },
      ],
    },
  },
};

function getResponse(intent: Intent, locale: string): Response {
  const localeResponses = RESPONSES[locale] ?? RESPONSES.it;
  return localeResponses[intent] ?? localeResponses.fallback;
}

// ============================================================
// PROACTIVE MESSAGES
// ============================================================
const PROACTIVE: Record<string, Record<string, Response>> = {
  it: {
    '/booking': {
      text: "👋 Stai pensando di prenotare? Ottima scelta!\n\n🎁 Ricorda che la prima consulenza conoscitiva di **15 minuti è gratuita** — senza impegno.\n\nHai domande prima di procedere?",
      quickReplies: [
        { text: '🎁 Consulenza gratuita', query: 'Come funziona la consulenza gratuita?' },
        { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
        { text: '📅 Prenota ora', query: 'Voglio prenotare una consulenza' },
      ],
    },
    '/services': {
      text: "👋 Stai esplorando i servizi? Posso aiutarti a trovare quello più adatto a te!\n\nCosa ti interessa di più?",
      quickReplies: [
        { text: '💰 Prezzi', query: 'Quali sono i prezzi?' },
        { text: '🤰 Gravidanza', query: 'Nutrizione in gravidanza' },
        { text: '🌱 Transizione vegana', query: 'Come iniziare la transizione vegana' },
        { text: '👶 Bambini', query: 'Alimentazione vegana per bambini' },
        { text: '💪 Sport', query: 'Nutrizione sportiva vegana' },
        { text: '⚖️ Dimagrimento', query: 'Dieta vegana per dimagrire' },
        { text: '🌾 Intolleranze', query: 'Intolleranze e allergie' },
      ],
    },
    '/about': {
      text: "👋 Vuoi sapere di più su Arianna?\n\nSono qui per rispondere a qualsiasi domanda — sui suoi servizi, il suo metodo o come iniziare! 😊",
      quickReplies: [
        { text: '💰 Prezzi', query: 'Quali sono i prezzi?' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        { text: '❓ Di cosa si occupa?', query: 'Chi è Arianna?' },
      ],
    },
    '/contact': {
      text: "👋 Vuoi metterti in contatto con Arianna?\n\nPosso darti subito tutte le informazioni — o rispondere a qualche domanda rapida! 😊",
      quickReplies: [
        { text: '📬 Contatti', query: 'Come posso contattarti?' },
        { text: '📅 Prenota online', query: 'Voglio prenotare una consulenza' },
      ],
    },
    '/recipes': {
      text: "👋 Ti piacciono le ricette vegane? 🍽️\n\nSe vuoi un **piano alimentare personalizzato**, Arianna può crearne uno su misura per te!",
      quickReplies: [
        { text: '📅 Prenota consulenza', query: 'Voglio prenotare una consulenza' },
        { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
      ],
    },
    '/': {
      text: "Ciao! 👋 Sono l'assistente virtuale di **Viva Plant Nutrition**.\n\nSu cosa posso aiutarti?",
      quickReplies: [
        { text: '💰 Prezzi', query: 'Quali sono i prezzi?' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        { text: '🤰 Gravidanza', query: 'Nutrizione in gravidanza' },
        { text: '🌱 Transizione vegana', query: 'Come iniziare la transizione vegana' },
        { text: '👶 Bambini', query: 'Alimentazione vegana per bambini' },
        { text: '💪 Sport', query: 'Nutrizione sportiva vegana' },
        { text: '⚖️ Dimagrimento', query: 'Dieta vegana per dimagrire' },
        { text: '🌾 Intolleranze', query: 'Intolleranze e allergie' },
        { text: '💊 Nutrienti', query: 'Quali nutrienti monitorare?' },
        { text: '📬 Contatti', query: 'Come posso contattarti?' },
      ],
    },
  },
  de: {
    '/booking': {
      text: "👋 Du überlegst zu buchen? Ausgezeichnete Wahl!\n\n🎁 Denk daran, dass das erste Kennenlerngespräch von **15 Minuten kostenlos** ist — ohne Verpflichtung.\n\nHast du Fragen, bevor du weitermachst?",
      quickReplies: [
        { text: '🎁 Kostenloses Gespräch', query: 'Wie funktioniert das kostenlose Gespräch?' },
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
        { text: '📅 Jetzt buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    '/services': {
      text: "👋 Du erkundest die Leistungen? Ich kann dir helfen, die passende für dich zu finden!\n\nWas interessiert dich am meisten?",
      quickReplies: [
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
        { text: '🤰 Schwangerschaft', query: 'Ernährung in der Schwangerschaft' },
        { text: '🌱 Vegane Ernährung', query: 'Wie fange ich mit veganer Ernährung an?' },
        { text: '👶 Kinder', query: 'Vegane Ernährung für Kinder' },
        { text: '💪 Sport', query: 'Vegane Sporternährung' },
        { text: '⚖️ Abnehmen', query: 'Vegane Diät zum Abnehmen' },
        { text: '🌾 Unverträglichkeiten', query: 'Unverträglichkeiten und Allergien' },
      ],
    },
    '/about': {
      text: "👋 Möchtest du mehr über Arianna erfahren?\n\nIch beantworte gerne jede Frage — über ihre Leistungen, ihre Methode oder wie du anfangen kannst! 😊",
      quickReplies: [
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
        { text: '❓ Was macht sie?', query: 'Wer ist Arianna?' },
      ],
    },
    '/contact': {
      text: "👋 Möchtest du Arianna kontaktieren?\n\nIch kann dir sofort alle Informationen geben — oder schnelle Fragen beantworten! 😊",
      quickReplies: [
        { text: '📬 Kontakt', query: 'Wie kann ich Arianna kontaktieren?' },
        { text: '📅 Online buchen', query: 'Ich möchte einen Termin buchen' },
      ],
    },
    '/recipes': {
      text: "👋 Liebst du vegane Rezepte? 🍽️\n\nWenn du einen **personalisierten Ernährungsplan** möchtest, kann Arianna einen maßgeschneiderten für dich erstellen!",
      quickReplies: [
        { text: '📅 Beratung buchen', query: 'Ich möchte einen Termin buchen' },
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
      ],
    },
    '/': {
      text: "Hallo! 👋 Ich bin der virtuelle Assistent von **Viva Plant Nutrition**.\n\nWobei kann ich dir helfen?",
      quickReplies: [
        { text: '💰 Preise', query: 'Was kosten die Beratungen?' },
        { text: '📅 Buchen', query: 'Ich möchte einen Termin buchen' },
        { text: '🤰 Schwangerschaft', query: 'Ernährung in der Schwangerschaft' },
        { text: '🌱 Vegane Ernährung', query: 'Wie fange ich mit veganer Ernährung an?' },
        { text: '👶 Kinder', query: 'Vegane Ernährung für Kinder' },
        { text: '💪 Sport', query: 'Vegane Sporternährung' },
        { text: '⚖️ Abnehmen', query: 'Vegane Diät zum Abnehmen' },
        { text: '🌾 Unverträglichkeiten', query: 'Unverträglichkeiten und Allergien' },
        { text: '💊 Nährstoffe', query: 'Welche Nährstoffe sollte ich überwachen?' },
        { text: '📬 Kontakt', query: 'Wie kann ich Arianna kontaktieren?' },
      ],
    },
  },
  en: {
    '/booking': {
      text: "👋 Thinking about booking? Excellent choice!\n\n🎁 Remember that the first introductory consultation of **15 minutes is free** — no commitment.\n\nAny questions before you proceed?",
      quickReplies: [
        { text: '🎁 Free consultation', query: 'How does the free consultation work?' },
        { text: '💰 See prices', query: 'What are the prices?' },
        { text: '📅 Book now', query: 'I want to book a consultation' },
      ],
    },
    '/services': {
      text: "👋 Exploring the services? I can help you find the right one for you!\n\nWhat interests you the most?",
      quickReplies: [
        { text: '💰 Prices', query: 'What are the prices?' },
        { text: '🤰 Pregnancy', query: 'Nutrition during pregnancy' },
        { text: '🌱 Plant-based', query: 'How to start a plant-based diet' },
        { text: '👶 Children', query: 'Vegan nutrition for children' },
        { text: '💪 Sports', query: 'Vegan sports nutrition' },
        { text: '⚖️ Weight loss', query: 'Vegan diet for weight loss' },
        { text: '🌾 Intolerances', query: 'Intolerances and allergies' },
      ],
    },
    '/about': {
      text: "👋 Want to learn more about Arianna?\n\nI'm here to answer any questions — about her services, her method or how to get started! 😊",
      quickReplies: [
        { text: '💰 Prices', query: 'What are the prices?' },
        { text: '📅 Book', query: 'I want to book a consultation' },
        { text: '❓ What does she do?', query: 'Who is Arianna?' },
      ],
    },
    '/contact': {
      text: "👋 Want to get in touch with Arianna?\n\nI can give you all the information right away — or answer a few quick questions! 😊",
      quickReplies: [
        { text: '📬 Contact', query: 'How can I contact Arianna?' },
        { text: '📅 Book online', query: 'I want to book a consultation' },
      ],
    },
    '/recipes': {
      text: "👋 Do you love vegan recipes? 🍽️\n\nIf you want a **personalized meal plan**, Arianna can create one tailored for you!",
      quickReplies: [
        { text: '📅 Book consultation', query: 'I want to book a consultation' },
        { text: '💰 See prices', query: 'What are the prices?' },
      ],
    },
    '/': {
      text: "Hello! 👋 I'm the virtual assistant for **Viva Plant Nutrition**.\n\nWhat can I help you with?",
      quickReplies: [
        { text: '💰 Prices', query: 'What are the prices?' },
        { text: '📅 Book', query: 'I want to book a consultation' },
        { text: '🤰 Pregnancy', query: 'Nutrition during pregnancy' },
        { text: '🌱 Plant-based', query: 'How to start a plant-based diet' },
        { text: '👶 Children', query: 'Vegan nutrition for children' },
        { text: '💪 Sports', query: 'Vegan sports nutrition' },
        { text: '⚖️ Weight loss', query: 'Vegan diet for weight loss' },
        { text: '🌾 Intolerances', query: 'Intolerances and allergies' },
        { text: '💊 Nutrients', query: 'Which nutrients should I monitor?' },
        { text: '📬 Contact', query: 'How can I contact Arianna?' },
      ],
    },
  },
};

function getProactiveMessage(localePath: string, locale: string): Response {
  const localeProactive = PROACTIVE[locale] ?? PROACTIVE.it;
  return localeProactive[localePath] ?? localeProactive['/'];
}

// ============================================================
// UI STRINGS
// ============================================================
const UI: Record<string, { title: string; subtitle: string; placeholder: string; disclaimer: string; tooltip: string; closeLabel: string; openLabel: string; sendLabel: string }> = {
  it: {
    title: 'Assistente Viva Plant',
    subtitle: 'Online · rispondo subito',
    placeholder: 'Scrivi un messaggio...',
    disclaimer: 'Assistente virtuale · Non sostituisce consulenza medica',
    tooltip: '💬 Hai domande? Scrivimi!',
    closeLabel: 'Chiudi chat',
    openLabel: 'Apri chat assistente',
    sendLabel: 'Invia messaggio',
  },
  de: {
    title: 'Viva Plant Assistent',
    subtitle: 'Online · antworte sofort',
    placeholder: 'Nachricht schreiben...',
    disclaimer: 'Virtueller Assistent · Kein Ersatz für medizinische Beratung',
    tooltip: '💬 Fragen? Schreib mir!',
    closeLabel: 'Chat schließen',
    openLabel: 'Chat öffnen',
    sendLabel: 'Nachricht senden',
  },
  en: {
    title: 'Viva Plant Assistant',
    subtitle: 'Online · reply instantly',
    placeholder: 'Write a message...',
    disclaimer: 'Virtual assistant · Not a substitute for medical advice',
    tooltip: '💬 Questions? Write me!',
    closeLabel: 'Close chat',
    openLabel: 'Open chat assistant',
    sendLabel: 'Send message',
  },
};

// ============================================================
// COMPONENT
// ============================================================
export default function ChatWidget() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0] || DEFAULT_LOCALE;
  const localePath = segments.length > 1 ? '/' + segments.slice(1).join('/') : '/';
  const isBookingPage = localePath === '/booking';

  const ui = UI[locale] ?? UI.it;

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      setTimeout(() => {
        const proactive = getProactiveMessage(localePath, locale);
        addBotMessage(proactive.text, proactive.quickReplies);
      }, 400);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, quickReplies?: QuickReply[]) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isBot: true,
      timestamp: new Date(),
      quickReplies,
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      text,
      isBot: false,
      timestamp: new Date(),
    }]);
  };

  const handleSend = (text?: string) => {
    const msg = (text ?? inputValue).trim();
    if (!msg) return;

    addUserMessage(msg);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const intent = detectIntent(msg.toLowerCase(), locale);
      const response = getResponse(intent, locale);
      addBotMessage(response.text, response.quickReplies);
    }, 700 + Math.random() * 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const bottomClass = isBookingPage ? 'bottom-24 sm:bottom-6' : 'bottom-6';

  if (!mounted) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 sm:right-6 ${bottomClass} z-50 p-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 group`}
        style={{ background: 'var(--brand-title)' }}
        aria-label={ui.openLabel}
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
        <div className="absolute bottom-full right-0 mb-3 px-3 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-sm font-medium"
          style={{ background: 'white', color: 'var(--brand-title)', border: '1px solid var(--color-main-light)' }}
        >
          {ui.tooltip}
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed right-4 sm:right-6 ${bottomClass} z-50 w-[calc(100vw-2rem)] sm:w-[390px] shadow-2xl rounded-2xl overflow-hidden flex flex-col`}
      style={{
        background: 'white',
        height: 'min(600px, calc(100dvh - 6rem))',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ background: 'var(--brand-title)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              🌱
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">{ui.title}</p>
            <p className="text-white/70 text-xs">{ui.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          aria-label={ui.closeLabel}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M14 4L4 14M4 4l10 10" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: '#f7f7f5' }}>
        {messages.map((message) => (
          <div key={message.id}>
            <div className={`flex items-end gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}>
              {message.isBot && (
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm flex-shrink-0 shadow-sm border" style={{ borderColor: 'var(--color-main-light)' }}>
                  🌱
                </div>
              )}
              <div
                className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.isBot ? 'rounded-bl-sm' : 'rounded-br-sm'}`}
                style={message.isBot
                  ? { background: 'white', color: 'var(--text-dark-green)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }
                  : { background: 'var(--brand-title)', color: 'white' }
                }
              >
                <div className="space-y-0.5">
                  {renderMarkdown(message.text)}
                </div>
                <span className="text-xs mt-2 block" style={{ opacity: 0.5 }}>
                  {message.timestamp.toLocaleTimeString(locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-GB' : 'it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {message.quickReplies && message.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 ml-9">
                {message.quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(reply.query)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'white',
                      color: 'var(--brand-title)',
                      border: '1.5px solid var(--color-main)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }}
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm flex-shrink-0 shadow-sm border" style={{ borderColor: 'var(--color-main-light)' }}>
              🌱
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              <div className="flex gap-1 items-center h-4">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'var(--color-main)', animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t" style={{ background: 'white', borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ui.placeholder}
            className="flex-1 px-4 py-3 rounded-full text-sm outline-none transition-all"
            style={{
              border: '1.5px solid var(--color-main-light)',
              color: 'var(--text-dark-green)',
              background: '#fafaf8',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-main)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--color-main-light)')}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="w-11 h-11 flex items-center justify-center rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
            style={{ background: 'var(--brand-title)', color: 'white' }}
            aria-label={ui.sendLabel}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted, #aaa)' }}>
          {ui.disclaimer}
        </p>
      </div>
    </div>
  );
}
