export const metadata = {
  title: 'Privacy Policy - Pura Essenza Vegetale',
  description: 'Informativa sulla privacy e il trattamento dei dati personali di Pura Essenza Vegetale.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-center" style={{ color: 'var(--brand-title)' }}>
            Privacy Policy
          </h1>
          <p className="text-lg text-center" style={{ color: 'var(--text-dark-green)' }}>
            Ultimo aggiornamento: 5 Gennaio 2026
          </p>
        </div>
      </section>

      {/* Contenuto Privacy Policy */}
      <section className="py-12" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
          <div style={{ color: 'var(--text-dark-green)' }}>
            
            <h2 style={{ color: 'var(--brand-title)' }}>1. Titolare del Trattamento</h2>
            <p>
              <strong>Pura Essenza Vegetale</strong><br />
              Dott.ssa Arianna Ciervo - Nutrizionista<br />
              Email: <a href="mailto:info@puraessenzavegetale.it">info@puraessenzavegetale.it</a>
            </p>

            <h2 style={{ color: 'var(--brand-title)' }}>2. Tipologie di Dati Raccolti</h2>
            
            <h3 style={{ color: 'var(--brand-title)' }}>2.1 Dati di Navigazione</h3>
            <p>Durante la navigazione del sito vengono raccolti:</p>
            <ul>
              <li>Indirizzo IP</li>
              <li>Browser utilizzato</li>
              <li>Pagine visitate</li>
              <li>Tempo di permanenza</li>
              <li>Dati di interazione con il sito</li>
            </ul>

            <h3 style={{ color: 'var(--brand-title)' }}>2.2 Dati Forniti Volontariamente</h3>
            <p>Quando prenoti una consulenza o compili un form:</p>
            <ul>
              <li>Nome e cognome</li>
              <li>Email</li>
              <li>Numero di telefono</li>
              <li>Dati anamnestici (stato di salute, obiettivi nutrizionali)</li>
              <li>Eventuali allergie o intolleranze</li>
            </ul>

            <h3 style={{ color: 'var(--brand-title)' }}>2.3 Cookie</h3>
            <p>Il sito utilizza:</p>
            <ul>
              <li><strong>Cookie tecnici necessari</strong>: per il funzionamento del sito (gestione sessioni, preferenze cookie)</li>
              <li><strong>Cookie analitici</strong>: Google Analytics per statistiche anonime (solo con consenso)</li>
              <li><strong>Cookie di marketing</strong>: per pubblicità personalizzata (solo con consenso)</li>
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>3. Finalità del Trattamento</h2>
            <p>I dati vengono utilizzati per:</p>
            <ul>
              <li>Erogare i servizi di consulenza nutrizionale richiesti</li>
              <li>Gestire le prenotazioni degli appuntamenti</li>
              <li>Rispondere alle richieste di informazioni</li>
              <li>Inviare comunicazioni relative ai servizi (con consenso per newsletter)</li>
              <li>Migliorare l'esperienza utente sul sito</li>
              <li>Adempiere agli obblighi di legge</li>
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>4. Base Giuridica</h2>
            <p>Il trattamento dei dati si basa su:</p>
            <ul>
              <li><strong>Esecuzione del contratto</strong>: per fornire i servizi richiesti</li>
              <li><strong>Consenso</strong>: per l'invio di comunicazioni promozionali</li>
              <li><strong>Legittimo interesse</strong>: per migliorare i servizi offerti</li>
              <li><strong>Obbligo di legge</strong>: per adempimenti fiscali e contabili</li>
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>5. Condivisione dei Dati</h2>
            <p>I tuoi dati possono essere condivisi con:</p>
            <ul>
              <li><strong>Fornitori di servizi tecnici</strong>: hosting web, email</li>
              <li><strong>Chat live</strong>: Tawk.to (server EU) per assistenza clienti</li>
              <li><strong>Sistemi di prenotazione</strong>: per gestire gli appuntamenti</li>
              <li><strong>Strumenti di analytics</strong>: Google Analytics (dati anonimi)</li>
              <li><strong>Commercialisti/consulenti</strong>: per adempimenti fiscali</li>
            </ul>
            <p><strong>I dati NON vengono venduti a terze parti.</strong></p>

            <h2 style={{ color: 'var(--brand-title)' }}>6. Conservazione dei Dati</h2>
            <ul>
              <li><strong>Dati di contatto</strong>: fino a revoca del consenso</li>
              <li><strong>Dati di consulenza</strong>: 10 anni (obbligo di legge professionale)</li>
              <li><strong>Cookie analytics</strong>: massimo 24 mesi</li>
              <li><strong>Cookie marketing</strong>: massimo 12 mesi</li>
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>7. Diritti dell'Interessato</h2>
            <p>Hai diritto di:</p>
            <ul>
              <li><strong>Accedere</strong> ai tuoi dati personali</li>
              <li><strong>Rettificare</strong> dati inesatti o incompleti</li>
              <li><strong>Cancellare</strong> i tuoi dati (diritto all'oblio)</li>
              <li><strong>Limitare</strong> il trattamento</li>
              <li><strong>Opporti</strong> al trattamento per finalità di marketing</li>
              <li><strong>Portabilità</strong> dei dati in formato strutturato</li>
              <li><strong>Revocare il consenso</strong> in qualsiasi momento</li>
            </ul>
            <p>
              Per esercitare i tuoi diritti, contatta:{' '}
              <a href="mailto:privacy@puraessenzavegetale.it">privacy@puraessenzavegetale.it</a>
            </p>

            <h2 style={{ color: 'var(--brand-title)' }}>8. Sicurezza dei Dati</h2>
            <p>Adottiamo misure di sicurezza appropriate:</p>
            <ul>
              <li>Connessioni SSL/TLS criptate</li>
              <li>Backup regolari</li>
              <li>Accesso limitato ai dati solo a personale autorizzato</li>
              <li>Formazione sulla privacy</li>
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>9. Dati Sensibili (Salute)</h2>
            <p>
              I dati relativi alla tua salute (anamnesi, esami clinici) sono <strong>dati particolari</strong> ai sensi del GDPR.
              Il loro trattamento è necessario per l'erogazione dei servizi sanitari e avviene solo con il tuo <strong>consenso esplicito</strong>.
            </p>
            <p>
              Questi dati sono protetti con misure di sicurezza rafforzate e accessibili solo alla Dott.ssa Arianna Ciervo.
            </p>

            <h2 style={{ color: 'var(--brand-title)' }}>10. Minori</h2>
            <p>
              Il sito non è destinato a minori di 16 anni.
              Per consulenze nutrizionali a minori è necessario il consenso dei genitori/tutori.
            </p>

            <h2 style={{ color: 'var(--brand-title)' }}>11. Modifiche alla Privacy Policy</h2>
            <p>
              Ci riserviamo il diritto di modificare questa Privacy Policy.
              Le modifiche saranno pubblicate su questa pagina con la data di "Ultimo aggiornamento".
            </p>

            <h2 style={{ color: 'var(--brand-title)' }}>12. Contatti</h2>
            <p>Per qualsiasi domanda sulla privacy:</p>
            <ul>
              <li><strong>Email</strong>: <a href="mailto:privacy@puraessenzavegetale.it">privacy@puraessenzavegetale.it</a></li>
              <li><strong>Email generale</strong>: <a href="mailto:info@puraessenzavegetale.it">info@puraessenzavegetale.it</a></li>
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>13. Autorità di Controllo</h2>
            <p>Hai diritto di presentare reclamo al Garante per la Protezione dei Dati Personali:</p>
            <ul>
              <li><strong>Sito</strong>: <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a></li>
              <li><strong>Email</strong>: garante@gpdp.it</li>
              <li><strong>PEC</strong>: protocollo@pec.gpdp.it</li>
            </ul>

            <div className="mt-12 p-6 rounded-lg" style={{ background: 'var(--bg-section-light)', borderLeft: '4px solid var(--brand-title)' }}>
              <h3 style={{ color: 'var(--brand-title)' }}>Consenso al Trattamento dei Dati</h3>
              <p>
                Utilizzando questo sito web e i suoi servizi, dichiari di aver letto e compreso questa Privacy Policy.
              </p>
              <p>
                Per l'invio di comunicazioni promozionali (newsletter) è necessario un consenso esplicito mediante flag nel form di iscrizione.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Contatti */}
      <section className="py-12" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
            Hai Domande sulla Privacy?
          </h3>
          <p className="mb-6" style={{ color: 'var(--text-dark-green)' }}>
            Siamo qui per rispondere a qualsiasi dubbio sui tuoi dati personali.
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
