'use client';

import { useState, useEffect } from 'react';
import Button from './ui/Button';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
    
    // Initialize analytics if accepted
    if (allAccepted.analytics) {
      initializeAnalytics();
    }
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    setPreferences(onlyNecessary);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
    
    // Initialize analytics if accepted
    if (preferences.analytics) {
      initializeAnalytics();
    }
  };

  const initializeAnalytics = () => {
    // TODO: Inizializza Google Analytics o altro strumento
    // window.gtag('consent', 'update', {
    //   'analytics_storage': 'granted'
    // });
  };

  if (!showBanner) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-[998]"
        style={{ backdropFilter: 'blur(2px)' }}
      />
      
      <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 sm:p-6" style={{ background: 'rgba(255, 255, 255, 0.98)' }}>
        <div className="max-w-6xl mx-auto">
          {!showSettings ? (
            // Banner principale
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--brand-title)' }}>
                  🍪 Questo sito utilizza i cookie
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-dark-green)' }}>
                  Utilizziamo i cookie per migliorare la tua esperienza di navigazione, analizzare il traffico del sito e personalizzare i contenuti. 
                  I cookie necessari sono sempre abilitati. Puoi gestire le tue preferenze cliccando su "Impostazioni Cookie".
                </p>
                <a 
                  href="/privacy-policy" 
                  className="text-sm underline"
                  style={{ color: 'var(--color-main)' }}
                >
                  Leggi la Privacy Policy completa
                </a>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 rounded-lg border transition-all text-sm font-medium whitespace-nowrap"
                  style={{ 
                    borderColor: 'var(--brand-title)', 
                    color: 'var(--brand-title)',
                    background: 'white'
                  }}
                >
                  Impostazioni Cookie
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap"
                  style={{ 
                    background: '#e5e7eb', 
                    color: '#374151',
                    border: '1px solid #d1d5db'
                  }}
                >
                  Rifiuta Tutti
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap"
                  style={{ 
                    background: 'var(--brand-title)', 
                    color: 'white'
                  }}
                >
                  Accetta Tutti
                </button>
              </div>
            </div>
          ) : (
            // Pannello impostazioni
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--brand-title)' }}>
                  Gestisci Preferenze Cookie
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Chiudi"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Cookie Necessari */}
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-section-light)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold" style={{ color: 'var(--brand-title)' }}>
                      Cookie Necessari
                    </h4>
                    <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'var(--color-main)', color: 'white' }}>
                      Sempre Attivi
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-dark-green)' }}>
                    Questi cookie sono essenziali per il corretto funzionamento del sito web e non possono essere disattivati. 
                    Includono le preferenze sui cookie e la gestione delle sessioni di prenotazione.
                  </p>
                </div>

                {/* Cookie Analitici */}
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-section-light)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold" style={{ color: 'var(--brand-title)' }}>
                      Cookie Analitici
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" 
                        style={{ 
                          background: preferences.analytics ? 'var(--color-main)' : '#ccc'
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-dark-green)' }}>
                    Questi cookie ci aiutano a capire come i visitatori interagiscono con il sito, raccogliendo informazioni in forma anonima. 
                    Utilizziamo Google Analytics per migliorare continuamente l'esperienza utente.
                  </p>
                </div>

                {/* Cookie Marketing */}
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-section-light)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold" style={{ color: 'var(--brand-title)' }}>
                      Cookie di Marketing
                    </h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" 
                        style={{ 
                          background: preferences.marketing ? 'var(--color-main)' : '#ccc'
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-dark-green)' }}>
                    Questi cookie vengono utilizzati per mostrare annunci pubblicitari pertinenti e personalizzati. 
                    Possono essere impostati tramite il nostro sito dai nostri partner pubblicitari.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  style={{ 
                    background: '#e5e7eb', 
                    color: '#374151',
                    border: '1px solid #d1d5db'
                  }}
                >
                  Rifiuta Tutti
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  style={{ 
                    background: 'var(--brand-title)', 
                    color: 'white'
                  }}
                >
                  Salva Preferenze
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  style={{ 
                    background: 'var(--color-main)', 
                    color: 'white'
                  }}
                >
                  Accetta Tutti
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
