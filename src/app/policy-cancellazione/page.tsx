export const metadata = {
  title: 'Policy di Cancellazione - Viva Plant Nutrition',
  description: 'Policy di cancellazione e rimborso per le consulenze di Viva Plant Nutrition.',
};

export default function PoliceCancellazione() {
  return (
    <div className="min-h-screen">
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-center" style={{ color: 'var(--brand-title)' }}>
            Policy di Cancellazione
          </h1>
          <p className="text-lg text-center" style={{ color: 'var(--text-dark-green)' }}>
            Ultimo aggiornamento: 29 Maggio 2026
          </p>
        </div>
      </section>

      <section className="py-12" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
          <div style={{ color: 'var(--text-dark-green)' }}>

            <h2 style={{ color: 'var(--brand-title)' }}>1. Spostamento Appuntamento</h2>
            <p>
              Puoi spostare il tuo appuntamento in autonomia direttamente dal link ricevuto nell'email di conferma, entro le seguenti fasce orarie:
            </p>
            <ul>
              <li><strong>Più di 7 giorni prima:</strong> spostamento libero senza limitazioni.</li>
              <li><strong>Da 2 a 7 giorni prima:</strong> spostamento consentito una sola volta.</li>
              <li><strong>Meno di 24 ore prima:</strong> non è possibile spostare autonomamente. Contatta Arianna Ciervo direttamente a <a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a> — ogni caso verrà valutato singolarmente.</li>
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>2. Cancellazione e Rimborsi</h2>
            <ul>
              <li><strong>Più di 7 giorni prima:</strong> cancellazione con rimborso completo. Contatta Arianna Ciervo a <a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a>.</li>
              <li><strong>Da 2 a 7 giorni prima:</strong> nessun rimborso. È possibile spostare l'appuntamento a una data futura.</li>
              <li><strong>Meno di 24 ore prima o assenza senza preavviso:</strong> nessun rimborso, seduta considerata effettuata.</li>
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>3. Percorsi Nutrizionali (3 e 6 Mesi)</h2>
            <ul>
              <li><strong>Cancellazione prima della prima visita:</strong> rimborso completo contattando Arianna Ciervo a <a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a>.</li>
              <li><strong>Cancellazione dopo la prima visita:</strong> nessun rimborso. Il percorso è considerato iniziato.</li>
              <li><strong>Spostamento delle singole sessioni:</strong> stessa policy delle visite singole (vedi punto 1).</li>
              <li><strong>Mancata presentazione o disdetta con meno di 24 ore:</strong> la sessione è considerata effettuata, salvo valutazione discrezionale da parte di Arianna Ciervo. Contatta <a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a> per qualsiasi situazione eccezionale.</li>
              <li><strong>Scadenza sessioni:</strong> le sessioni devono essere utilizzate entro <strong>6 mesi</strong> dalla prima visita per il Percorso 3 Mesi, e entro <strong>12 mesi</strong> per il Percorso 6 Mesi. Le sessioni non utilizzate entro questi termini decadono senza diritto a rimborso.</li>
            </ul>

            <h2 style={{ color: 'var(--brand-title)' }}>4. Colloquio Gratuito</h2>

            <p>
              Il colloquio gratuito può essere cancellato in qualsiasi momento senza penali. È gradito un preavviso di almeno 24 ore.
            </p>

            <h2 style={{ color: 'var(--brand-title)' }}>5. Pagamento con Bonifico</h2>
            <p>
              Le prenotazioni con bonifico bancario devono essere confermate tramite pagamento entro <strong>72 ore</strong> dalla prenotazione. Trascorso questo termine senza ricezione del pagamento, la prenotazione viene annullata automaticamente e lo slot reso disponibile.
            </p>

            <h2 style={{ color: 'var(--brand-title)' }}>6. Contatti</h2>
            <p>
              Per qualsiasi necessità scrivi a <a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a>.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}
