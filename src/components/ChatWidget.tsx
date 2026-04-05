'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const isBookingPage = pathname === '/prenota';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Messaggio di benvenuto
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "Ciao! 👋 Sono l'assistente virtuale di Viva Plant Nutrition. Come posso aiutarti oggi?\n\n" +
          "Puoi chiedermi informazioni su:\n" +
          "• 🍎 Servizi e prezzi\n" +
          "• 📅 Prenotazioni\n" +
          "• 🤰 Nutrizione in gravidanza\n" +
          "• 🌱 Transizione vegana\n" +
          "• 👶 Alimentazione bambini"
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isBot: true,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isBot: false,
      timestamp: new Date()
    }]);
  };

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // Saluti
    if (msg.match(/ciao|buongiorno|buonasera|salve|hey/)) {
      return "Ciao! 😊 Sono qui per aiutarti. Cosa vorresti sapere sui servizi di nutrizione vegana?";
    }

    // Prezzi e servizi
    if (msg.match(/prezzo|prezzi|costo|costi|quanto costa|tariffe/)) {
      return "Ecco i nostri servizi:\n\n" +
        "💚 **Consulenza Breve** (30 min): 40-45€\n" +
        "Perfetta per check rapidi su valori o supplementi\n\n" +
        "🌿 **Consulenza Standard** (60 min): 85€\n" +
        "Analisi nutrizionale completa con PDF riassuntivo\n\n" +
        "🌟 **Pacchetto Doppio** (2x60 min): 149€\n" +
        "Due sessioni al prezzo vantaggioso\n\n" +
        "⭐ **Percorso Completo** (3 mesi): 499€\n" +
        "6 consulenze + supporto WhatsApp + materiali\n\n" +
        "Vuoi prenotare? [Clicca qui](/prenota)";
    }

    // Prenotazione
    if (msg.match(/prenotare|prenota|appuntamento|disponibilità|quando/)) {
      return "Fantastico! 📅 Puoi prenotare direttamente online:\n\n" +
        "[➡️ Prenota la tua consulenza](/prenota)\n\n" +
        "Oppure contattami:\n" +
        "📧 Email: info@puraessenzavegetale.it\n" +
        "📱 WhatsApp: [Scrivimi](https://wa.me/393123456789)\n\n" +
        "La prima consulenza conoscitiva di 15 minuti è GRATUITA! 🎁";
    }

    // Gravidanza
    if (msg.match(/gravidanza|incinta|pregnancy|pregnant|mamma|allattamento/)) {
      return "🤰 Ottima domanda! Sono specializzata in nutrizione vegana in gravidanza.\n\n" +
        "Durante la gravidanza, una dieta vegana ben pianificata è sicura e salutare per te e il bambino.\n\n" +
        "Ti aiuto con:\n" +
        "✓ Piano alimentare bilanciato\n" +
        "✓ Integrazione corretta (B12, ferro, omega-3)\n" +
        "✓ Gestione nausee e appetito\n" +
        "✓ Monitoraggio valori ematici\n\n" +
        "Molte mie clienti hanno avuto gravidanze vegane serene e bambini sani! 💚\n\n" +
        "[Prenota una consulenza](/prenota)";
    }

    // Transizione vegana
    if (msg.match(/transizione|diventare vegano|iniziare|come si fa|passare al veganesimo/)) {
      return "🌱 Bellissimo che tu voglia intraprendere questo percorso!\n\n" +
        "Ti accompagno nella transizione graduale verso un'alimentazione 100% vegetale.\n\n" +
        "Il mio metodo:\n" +
        "1️⃣ Analisi delle tue abitudini attuali\n" +
        "2️⃣ Piano graduale personalizzato\n" +
        "3️⃣ Ricette semplici e gustose\n" +
        "4️⃣ Gestione sociale e pratica\n" +
        "5️⃣ Monitoraggio nutrienti\n\n" +
        "Senza rinunce, solo nuove scoperte! 😊\n\n" +
        "[Inizia il tuo percorso](/servizi)";
    }

    // Bambini
    if (msg.match(/bambini|bambino|figlio|figli|kids|children|svezzamento/)) {
      return "👶 L'alimentazione vegana è adatta anche ai bambini!\n\n" +
        "Con una corretta pianificazione, i bambini vegani crescono sani e forti.\n\n" +
        "Ti aiuto con:\n" +
        "✓ Svezzamento vegano\n" +
        "✓ Menu equilibrati per ogni età\n" +
        "✓ Gestione capricci a tavola\n" +
        "✓ Integratori necessari\n" +
        "✓ Lunchbox per scuola\n\n" +
        "Molte famiglie che seguo hanno bambini vegani sereni e in salute! 🌈\n\n" +
        "[Scopri di più](/servizi)";
    }

    // Ricette
    if (msg.match(/ricetta|ricette|recipe|menu|cosa mangiare|idee/)) {
      return "🍽️ Cerchi ispirazione in cucina?\n\n" +
        "Sul sito trovi tante ricette vegane bilanciate:\n" +
        "• Colazioni energetiche\n" +
        "• Pranzi e cene complete\n" +
        "• Snack sani\n" +
        "• Dolci senza sensi di colpa\n\n" +
        "Tutte con valori nutrizionali e difficoltà indicate!\n\n" +
        "[Vai alle ricette](/ricette) 👩‍🍳";
    }

    // Chi sono
    if (msg.match(/chi sei|chi è arianna|nutrizionista|qualifica|esperienza/)) {
      return "Sono l'assistente virtuale di **Arianna Ciervo**, nutrizionista specializzata in alimentazione vegetale.\n\n" +
        "Arianna aiuta persone, famiglie e mamme in gravidanza a vivere al meglio con una dieta vegana bilanciata.\n\n" +
        "🎓 Qualifiche professionali\n" +
        "💚 Esperienza con gravidanze vegane\n" +
        "👶 Specializzazione alimentazione bambini\n\n" +
        "[Scopri di più su Arianna](/chi-sono)";
    }

    // Contatti
    if (msg.match(/contatto|contatti|email|telefono|whatsapp|scrivere/)) {
      return "📬 Ecco come puoi contattarmi:\n\n" +
        "📧 **Email**: info@puraessenzavegetale.it\n" +
        "📱 **WhatsApp**: [Scrivimi ora](https://wa.me/393123456789)\n" +
        "💬 **Telegram**: @puraessenzavegetale\n" +
        "📷 **Instagram**: @pura_essenza_vegetale\n\n" +
        "Oppure [compila il form contatti](/contatti)";
    }

    // Valori nutrizionali / carenze
    if (msg.match(/b12|ferro|calcio|proteine|vitamina|carenza|carenze|nutrienti/)) {
      return "💊 Ottima domanda sui nutrienti!\n\n" +
        "Una dieta vegana ben pianificata fornisce tutti i nutrienti necessari.\n\n" +
        "I nutrienti chiave da monitorare:\n" +
        "🔴 **Vitamina B12** (integrazione obbligatoria)\n" +
        "🔴 **Ferro** (fonti vegetali + vitamina C)\n" +
        "🔴 **Calcio** (verdure, semi, fortificati)\n" +
        "🔴 **Omega-3** (semi lino, noci, alghe)\n" +
        "🔴 **Vitamina D** (sole + integrazione)\n" +
        "🔴 **Proteine** (legumi, tofu, seitan)\n\n" +
        "Durante la consulenza analizzo i tuoi valori e creo un piano personalizzato! 📊\n\n" +
        "[Prenota consulenza](/prenota)";
    }

    // Sport
    if (msg.match(/sport|palestra|muscoli|performance|atleta|allenamento/)) {
      return "💪 Sì, gli atleti vegani esistono eccome!\n\n" +
        "Moltissimi sportivi hanno performance eccellenti con dieta vegana.\n\n" +
        "Ti aiuto con:\n" +
        "✓ Piano alimentare per il tuo sport\n" +
        "✓ Timing dei pasti\n" +
        "✓ Proteine vegetali per muscoli\n" +
        "✓ Recupero post-allenamento\n" +
        "✓ Integrazione specifica\n\n" +
        "Forza, energia e risultati garantiti! 🏃‍♀️\n\n" +
        "[Scopri i servizi](/servizi)";
    }

    // Risposta generica
    return "Grazie per la tua domanda! 😊\n\n" +
      "Per una risposta personalizzata, ti consiglio di:\n\n" +
      "1️⃣ [Prenotare una consulenza gratuita](/prenota)\n" +
      "2️⃣ [Scrivermi su WhatsApp](https://wa.me/393123456789)\n" +
      "3️⃣ [Inviarmi una email](/contatti)\n\n" +
      "Arianna ti risponderà personalmente entro 24 ore! 💚\n\n" +
      "Nel frattempo, esplora:\n" +
      "• [I servizi disponibili](/servizi)\n" +
      "• [Le ricette](/ricette)\n" +
      "• [Il blog](/blog)";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Aggiungi messaggio utente
    addUserMessage(inputValue);
    setInputValue('');

    // Simula typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = getBotResponse(inputValue);
      addBotMessage(response);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = [
    { text: "💰 Prezzi", query: "Quali sono i prezzi?" },
    { text: "📅 Prenota", query: "Come posso prenotare?" },
    { text: "🤰 Gravidanza", query: "Nutrizione in gravidanza" },
    { text: "🍽️ Ricette", query: "Voglio vedere le ricette" }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-6 z-50 p-5 rounded-full shadow-2xl transition-all hover:scale-110 group ${isBookingPage ? 'bottom-24 md:bottom-6' : 'bottom-6'}`}
        style={{ background: 'var(--brand-title)' }}
        aria-label="Apri chat assistente"
      >
        <div className="relative">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {/* Pulse animation */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ background: 'white', color: 'var(--brand-title)' }}
        >
          💬 Chiedimi qualsiasi cosa!
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed right-6 z-50 w-96 max-w-[calc(100vw-3rem)] shadow-2xl rounded-2xl overflow-hidden ${isBookingPage ? 'bottom-24 md:bottom-6' : 'bottom-6'}`}
      style={{ background: 'white', height: '600px', maxHeight: 'calc(100vh-3rem)' }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between" style={{ background: 'var(--brand-title)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Assistente Pura Essenza</h3>
            <p className="text-xs text-white/80">Online • Rispondo subito</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          aria-label="Chiudi chat"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5L5 15M5 5l10 10" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto" style={{ height: 'calc(100% - 180px)', background: '#f5f5f5' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.isBot ? 'rounded-tl-none' : 'rounded-tr-none'
              }`}
              style={{
                background: message.isBot ? 'white' : 'var(--brand-title)',
                color: message.isBot ? 'var(--text-dark-green)' : 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {message.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length === 1 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => {
                addUserMessage(reply.query);
                setTimeout(() => {
                  setIsTyping(true);
                  setTimeout(() => {
                    setIsTyping(false);
                    addBotMessage(getBotResponse(reply.query));
                  }, 800);
                }, 100);
              }}
              className="px-3 py-2 rounded-full text-sm whitespace-nowrap transition-all hover:scale-105"
              style={{
                background: 'var(--bg-section-warm)',
                color: 'var(--brand-title)',
                border: '1px solid var(--color-main)'
              }}
            >
              {reply.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Scrivi un messaggio..."
            className="flex-1 px-4 py-3 rounded-full border-2 outline-none focus:border-opacity-100 transition-all"
            style={{ 
              borderColor: 'var(--color-main-light)',
              color: 'var(--text-dark-green)',
              background: 'white'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
            style={{ background: 'var(--brand-title)', color: 'white' }}
            aria-label="Invia messaggio"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
