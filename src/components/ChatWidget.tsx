'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

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
  // Match **bold**, [text](url), or plain text
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

function detectIntent(msg: string): Intent {
  if (msg.match(/ciao|buongiorno|buonasera|salve|hey|hei|buona/)) return 'saluto';
  if (msg.match(/preg|incinta|gravid|matern|allattamento|mamma in attesa/)) return 'gravidanza';
  if (msg.match(/bambin|figlio|figli|bimbo|bimba|svezzamento|neonato|piccolo|piccola/)) return 'bambini';
  if (msg.match(/prezzo|prezzi|costo|costi|quanto costa|quanto vengono|tariffe|pacchett/)) return 'prezzi';
  if (msg.match(/gratis|gratuita|gratuito|free|conoscitiv/)) return 'consulenza_gratuita';
  if (msg.match(/prenot|appuntament|disponibilit|quando posso|fissare|slot|seduta/)) return 'prenotazione';
  if (msg.match(/transizion|diventare vegano|iniziare|passare al veganesimo|diventare vegetariano|plant.based/)) return 'transizione';
  if (msg.match(/ricetta|ricette|menu|cosa mangiare|idee pasto|piatto|colazione|pranzo|cena/)) return 'ricette';
  if (msg.match(/chi sei|chi è arianna|nutrizionist|qualifica|esperienz|laurea|studio/)) return 'chi_sono';
  if (msg.match(/contatto|contatti|email|telefono|whatsapp|scrivere|raggiunger|instagram/)) return 'contatti';
  if (msg.match(/b12|ferro|calcio|proteine|vitamina|carenza|nutrienti|omega|integratori|supplementi/)) return 'nutrienti';
  if (msg.match(/sport|palestra|muscoli|performance|atleta|allenamento|fitness|corsa/)) return 'sport';
  if (msg.match(/dimagri|perdere peso|dieta|calorie|peso|sovrappeso|obesit/)) return 'dimagrimento';
  if (msg.match(/intolleranza|allergia|celiachia|glutine|lattosio|soia/)) return 'intolleranze';
  if (msg.match(/blog|articol|news|legger|approfondiment/)) return 'blog';
  return 'fallback';
}

function getResponse(intent: Intent): Response {
  switch (intent) {
    case 'saluto':
      return {
        text: "Ciao! 👋 Sono l'assistente virtuale di **Viva Plant Nutrition**.\n\nCome posso aiutarti oggi?",
        quickReplies: [
          { text: '💰 Prezzi', query: 'Quali sono i prezzi?' },
          { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
          { text: '🤰 Gravidanza', query: 'Nutrizione in gravidanza' },
          { text: '🌱 Transizione vegana', query: 'Come iniziare la transizione vegana' },
        ],
      };

    case 'prezzi':
      return {
        text: "Ecco i servizi disponibili:\n\n💚 **Consulenza Breve** (30 min) — 40€\nCheck rapido su valori o supplementi\n\n🌿 **Consulenza Standard** (60 min) — 85€\nAnalisi completa con piano nutrizionale PDF\n\n🌟 **Pacchetto Doppio** (2×60 min) — 149€\nDue sessioni a prezzo vantaggioso\n\n⭐ **Percorso Completo** (3 mesi) — 499€\n6 consulenze + supporto WhatsApp + materiali\n\n🎁 La prima consulenza conoscitiva di **15 min è gratuita!**",
        quickReplies: [
          { text: '🎁 Consulenza gratuita', query: 'Come funziona la consulenza gratuita?' },
          { text: '📅 Prenota ora', query: 'Voglio prenotare una consulenza' },
          { text: '❓ Hai domande?', query: 'Ho una domanda specifica' },
        ],
      };

    case 'consulenza_gratuita':
      return {
        text: "🎁 Sì! Arianna offre una **consulenza conoscitiva gratuita di 15 minuti**.\n\nÈ pensata per:\n• Capire le tue esigenze\n• Conoscere il metodo di lavoro\n• Valutare insieme il percorso più adatto\n\nSenza impegno, completamente gratis! 😊\n\n[Prenota la consulenza gratuita](/prenota)",
        quickReplies: [
          { text: '📅 Prenota ora', query: 'Voglio prenotare una consulenza' },
          { text: '💰 Vedi tutti i prezzi', query: 'Quali sono i prezzi?' },
        ],
      };

    case 'prenotazione':
      return {
        text: "📅 Puoi prenotare direttamente online — è semplice e veloce!\n\n[➡️ Vai alla prenotazione](/prenota)\n\nIn alternativa:\n📧 [info@vivaplantnutrition.com](mailto:info@vivaplantnutrition.com)\n📱 [Scrivimi su WhatsApp](" + WHATSAPP + ")\n\n🎁 Ricorda: la prima consulenza conoscitiva di 15 min è **gratuita**!",
        quickReplies: [
          { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
          { text: '🤰 Gravidanza', query: 'Nutrizione in gravidanza' },
          { text: '🌱 Transizione vegana', query: 'Come iniziare la transizione vegana' },
        ],
      };

    case 'gravidanza':
      return {
        text: "🤰 Una dieta vegana in gravidanza è sicura e salutare, se ben pianificata.\n\nArianna è specializzata proprio in questo e ti aiuta con:\n\n✓ Piano alimentare bilanciato per ogni trimestre\n✓ Integrazione corretta (B12, ferro, omega-3, iodio)\n✓ Gestione nausee e variazioni di appetito\n✓ Monitoraggio valori ematici\n✓ Alimentazione durante l'allattamento\n\nMolte sue clienti hanno vissuto gravidanze vegane serene e i loro bambini sono cresciuti in salute! 💚\n\n[Prenota una consulenza](/prenota)",
        quickReplies: [
          { text: '👶 Bambini vegani', query: 'Alimentazione vegana per bambini' },
          { text: '💊 Nutrienti chiave', query: 'Quali nutrienti monitorare?' },
          { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        ],
      };

    case 'bambini':
      return {
        text: "👶 Sì, i bambini possono crescere sani e forti con una dieta vegana!\n\nArianna ti supporta in ogni fase:\n\n✓ Svezzamento vegano (dai 6 mesi)\n✓ Menu equilibrati per ogni fascia d'età\n✓ Integratori necessari (B12, vitamina D, ferro)\n✓ Gestione dei capricci a tavola\n✓ Lunchbox creativi per la scuola\n✓ Crescita e sviluppo monitorati\n\nTante famiglie che segue hanno bambini vegani sereni e in ottima salute! 🌈",
        quickReplies: [
          { text: '🤰 Gravidanza', query: 'Nutrizione in gravidanza' },
          { text: '💊 Nutrienti chiave', query: 'Quali nutrienti monitorare?' },
          { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        ],
      };

    case 'transizione':
      return {
        text: "🌱 Bellissimo percorso che vuoi intraprendere!\n\nArianna ti accompagna gradualmente verso un'alimentazione 100% vegetale, senza stress:\n\n1️⃣ Analisi delle tue abitudini attuali\n2️⃣ Piano di transizione personalizzato e graduale\n3️⃣ Ricette semplici e gustose per iniziare\n4️⃣ Strategie per la vita sociale (ristoranti, cene, viaggi)\n5️⃣ Monitoraggio dei nutrienti durante il cambiamento\n\nNessuna rinuncia forzata — solo nuove scoperte! 😊\n\n[Scopri il percorso](/servizi)",
        quickReplies: [
          { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
          { text: '🍽️ Ricette', query: 'Voglio vedere le ricette' },
          { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        ],
      };

    case 'ricette':
      return {
        text: "🍽️ La sezione ricette è in arrivo — ci stiamo lavorando!\n\nNel frattempo, durante la consulenza Arianna crea un **piano pasti personalizzato** su misura per te, con ricette pratiche e bilanciate.",
        quickReplies: [
          { text: '📅 Prenota consulenza', query: 'Voglio prenotare una consulenza' },
          { text: '🌱 Transizione vegana', query: 'Come iniziare la transizione vegana' },
        ],
      };

    case 'chi_sono':
      return {
        text: "Sono l'assistente di **Arianna Ciervo**, nutrizionista specializzata in alimentazione vegetale 🌿\n\nArianna aiuta persone di ogni età — singoli, famiglie e mamme in gravidanza — a vivere al meglio con una dieta vegana bilanciata.\n\nLe sue specializzazioni:\n🤰 Nutrizione in gravidanza e allattamento\n👶 Svezzamento e alimentazione dei bambini\n🌱 Transizione verso l'alimentazione vegana\n💪 Nutrizione sportiva plant-based\n\n[Scopri di più su Arianna](/chi-sono)",
        quickReplies: [
          { text: '💰 Prezzi', query: 'Quali sono i prezzi?' },
          { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        ],
      };

    case 'contatti':
      return {
        text: "📬 Ecco tutti i modi per contattare Arianna:\n\n📧 **Email**: [info@vivaplantnutrition.com](mailto:info@vivaplantnutrition.com)\n📱 **WhatsApp**: [Scrivimi ora](" + WHATSAPP + ")\n💬 **Telegram**: @vivaplantnutrition\n📷 **Instagram**: [@vivaplantnutrition](https://instagram.com/vivaplantnutrition)\n\nOppure [compila il form contatti](/contatti) — Arianna risponde entro 24 ore!",
        quickReplies: [
          { text: '📅 Prenota online', query: 'Voglio prenotare una consulenza' },
        ],
      };

    case 'nutrienti':
      return {
        text: "💊 Ottima attenzione ai nutrienti!\n\nCon una dieta vegana ben pianificata si ottiene tutto il necessario. I nutrienti da monitorare:\n\n🔴 **Vitamina B12** — integrazione obbligatoria\n🟠 **Ferro** — legumi, semi di zucca + vitamina C\n🟡 **Calcio** — verdure a foglia, tofu, bevande vegetali\n🟢 **Omega-3** — semi di lino, noci, alghe\n🔵 **Vitamina D** — sole + integrazione in inverno\n🟣 **Proteine** — legumi, tofu, seitan, tempeh\n\nDurante la consulenza Arianna analizza i tuoi valori e crea un piano su misura! 📊\n\n[Prenota una consulenza](/prenota)",
        quickReplies: [
          { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
          { text: '🌱 Transizione vegana', query: 'Come iniziare la transizione vegana' },
        ],
      };

    case 'sport':
      return {
        text: "💪 Gli atleti vegani esistono eccome — e ottengono risultati straordinari!\n\nArianna ti aiuta a ottimizzare le performance con:\n\n✓ Piano alimentare calibrato sul tuo sport\n✓ Timing dei pasti e pre/post allenamento\n✓ Fonti proteiche vegetali per la massa muscolare\n✓ Recupero e riduzione dell'infiammazione\n✓ Integrazione specifica per atleti\n\nForza, energia e risultati garantiti! 🏃‍♀️\n\n[Scopri i servizi](/servizi)",
        quickReplies: [
          { text: '💊 Nutrienti chiave', query: 'Quali nutrienti monitorare?' },
          { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        ],
      };

    case 'dimagrimento':
      return {
        text: "⚖️ La dieta vegana è spesso associata a un peso corporeo più sano, ma ogni percorso è personale.\n\nArianna ti aiuta a:\n\n✓ Raggiungere il peso forma in modo sano e duraturo\n✓ Creare un piano calorico bilanciato senza carenze\n✓ Evitare le trappole degli alimenti vegani ultra-processati\n✓ Costruire un rapporto positivo con il cibo\n\nNessuna dieta restrittiva — un cambio di stile di vita! 💚\n\n[Prenota una consulenza](/prenota)",
        quickReplies: [
          { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
          { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        ],
      };

    case 'intolleranze':
      return {
        text: "🌾 Intolleranze e allergie non sono un ostacolo per un'alimentazione vegana!\n\nArianna ha esperienza con:\n\n✓ Celiachia e sensibilità al glutine\n✓ Intolleranza al lattosio (già escluso nel vegano!)\n✓ Allergie alla soia — alternative proteiche complete\n✓ Allergie alla frutta secca — sostituti nutrienti\n✓ Intolleranze multiple combinate\n\nOgni piano è completamente personalizzato sulle tue esigenze.\n\n[Prenota una consulenza](/prenota)",
        quickReplies: [
          { text: '💊 Nutrienti chiave', query: 'Quali nutrienti monitorare?' },
          { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        ],
      };

    case 'blog':
      return {
        text: "📖 Il blog è in arrivo — ci stiamo lavorando!\n\nPer approfondimenti personalizzati puoi prenotare una consulenza con Arianna, oppure seguirla su Instagram per consigli e aggiornamenti.",
        quickReplies: [
          { text: '📷 Instagram', query: 'Come posso contattarti?' },
          { text: '📅 Prenota consulenza', query: 'Voglio prenotare una consulenza' },
        ],
      };

    case 'fallback':
    default:
      return {
        text: "Grazie per la tua domanda! 😊\n\nPer una risposta personalizzata ti consiglio di:\n\n📅 [Prenotare una consulenza gratuita](/prenota)\n📱 [Scrivermi su WhatsApp](" + WHATSAPP + ")\n📧 [Inviarmi un'email](/contatti)\n\nArianna risponde personalmente entro 24 ore! 💚",
        quickReplies: [
          { text: '📅 Prenota gratis', query: 'Voglio prenotare una consulenza' },
          { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
          { text: '📬 Contatti', query: 'Come posso contattarti?' },
        ],
      };
  }
}

function getProactiveMessage(pathname: string): Response {
  if (pathname === '/prenota') {
    return {
      text: "👋 Stai pensando di prenotare? Ottima scelta!\n\n🎁 Ricorda che la prima consulenza conoscitiva di **15 minuti è gratuita** — senza impegno.\n\nHai domande prima di procedere?",
      quickReplies: [
        { text: '🎁 Consulenza gratuita', query: 'Come funziona la consulenza gratuita?' },
        { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
        { text: '📅 Prenota ora', query: 'Voglio prenotare una consulenza' },
      ],
    };
  }
  if (pathname === '/servizi') {
    return {
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
    };
  }
  if (pathname === '/chi-sono') {
    return {
      text: "👋 Vuoi sapere di più su Arianna?\n\nSono qui per rispondere a qualsiasi domanda — sui suoi servizi, il suo metodo o come iniziare! 😊",
      quickReplies: [
        { text: '💰 Prezzi', query: 'Quali sono i prezzi?' },
        { text: '📅 Prenota', query: 'Voglio prenotare una consulenza' },
        { text: '❓ Di cosa si occupa?', query: 'Chi è Arianna?' },
      ],
    };
  }
  if (pathname === '/contatti') {
    return {
      text: "👋 Vuoi metterti in contatto con Arianna?\n\nPosso darti subito tutte le informazioni — o rispondere a qualche domanda rapida! 😊",
      quickReplies: [
        { text: '📬 Contatti', query: 'Come posso contattarti?' },
        { text: '📅 Prenota online', query: 'Voglio prenotare una consulenza' },
      ],
    };
  }
  if (pathname === '/ricette') {
    return {
      text: "👋 Ti piacciono le ricette vegane? 🍽️\n\nSe vuoi un **piano alimentare personalizzato**, Arianna può crearne uno su misura per te!",
      quickReplies: [
        { text: '📅 Prenota consulenza', query: 'Voglio prenotare una consulenza' },
        { text: '💰 Vedi i prezzi', query: 'Quali sono i prezzi?' },
      ],
    };
  }
  // Homepage e altre pagine
  return {
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
  };
}

export default function ChatWidget() {
  const pathname = usePathname();
  const isBookingPage = pathname === '/prenota';

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
        const proactive = getProactiveMessage(pathname);
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
      const intent = detectIntent(msg.toLowerCase());
      const response = getResponse(intent);
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
        aria-label="Apri chat assistente"
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
        <div className="absolute bottom-full right-0 mb-3 px-3 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-sm font-medium"
          style={{ background: 'white', color: 'var(--brand-title)', border: '1px solid var(--color-main-light)' }}
        >
          💬 Hai domande? Scrivimi!
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
            <p className="font-semibold text-white text-sm leading-tight">Assistente Viva Plant</p>
            <p className="text-white/70 text-xs">Online · rispondo subito</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          aria-label="Chiudi chat"
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
                  {message.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Quick replies after this message */}
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
            placeholder="Scrivi un messaggio..."
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
            aria-label="Invia messaggio"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted, #aaa)' }}>
          Assistente virtuale · Non sostituisce consulenza medica
        </p>
      </div>
    </div>
  );
}
