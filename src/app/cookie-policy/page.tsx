import React from "react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-center" style={{ color: 'var(--brand-title)' }}>
            Cookie Policy
          </h1>
          <p className="text-lg text-center" style={{ color: 'var(--text-dark-green)' }}>
            Ultimo aggiornamento: 6 Gennaio 2026
          </p>
        </div>
      </section>

      {/* Contenuto Cookie Policy */}
      <section className="py-12" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg" style={{ color: 'var(--text-dark-green)' }}>
          <p className="mb-4">Questa pagina descrive l'uso dei cookie su questo sito web. I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo per migliorare l'esperienza di navigazione.</p>
          <h2 style={{ color: 'var(--brand-title)' }}>Tipi di cookie utilizzati</h2>
          <ul>
            <li>Cookie tecnici: necessari per il funzionamento del sito.</li>
            <li>Cookie di analisi: utilizzati per raccogliere dati statistici anonimi.</li>
            <li>Cookie di terze parti: possono essere utilizzati da servizi esterni come Google Analytics.</li>
          </ul>
          <h2 style={{ color: 'var(--brand-title)' }}>Gestione dei cookie</h2>
          <p>Puoi gestire le preferenze sui cookie tramite le impostazioni del tuo browser. Disabilitare i cookie potrebbe influire sulla funzionalità del sito.</p>
          <h2 style={{ color: 'var(--brand-title)' }}>Contatti</h2>
          <p>Per domande sulla Cookie Policy, contatta: info@nutrizionista.it</p>
        </div>
      </section>
      {/* CTA Contatti */}
      <section className="py-12" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
            Hai Domande sui Cookie?
          </h3>
          <p className="mb-6" style={{ color: 'var(--text-dark-green)' }}>
            Siamo qui per rispondere a qualsiasi dubbio sull'uso dei cookie.
          </p>
          <a
            href="/contatti"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium transition-all duration-200 text-lg"
            style={{ background: 'var(--brand-title)', color: 'white' }}
          >
            Contattaci
          </a>
        </div>
      </section>
    </div>
  );
}
