'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Contatti() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    servizio: '',
    messaggio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simula invio form - qui dovresti integrare con un servizio di email
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>Messaggio Inviato!</h1>
          <p className="mb-8" style={{ color: 'var(--color-main)' }}>
            Grazie per aver contattato Pura Essenza Vegetale. Ti risponderemo entro 24 ore.
          </p>
          <Button href="/">Torna alla Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>
            Contattaci
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--brand-title)' }}>
            Siamo qui per rispondere alle tue domande e aiutarti a iniziare 
            il tuo percorso verso il benessere con Pura Essenza Vegetale.
          </p>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-hero) 0%, var(--bg-section-light) 100%)' }} />

      <section className="py-20" style={{ background: 'var(--bg-section-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form di Contatto */}
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--brand-title)' }}>
                Prenota una Consulenza Gratuita
              </h2>
              
              <Card className="p-8" style={{ background: 'var(--bg-section-warm)' }}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-title)' }}>
                      Nome e Cognome *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ borderColor: 'var(--color-main)', color: 'var(--brand-title)', background: 'var(--bg-section-light)', '::placeholder': { color: 'var(--color-main)' } }}
                      onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--brand-title)'; e.currentTarget.style.borderColor = 'var(--brand-title)'; }}
                      onBlur={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--color-main)'; }}
                      placeholder="Il tuo nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-title)' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ borderColor: 'var(--color-main)', color: 'var(--brand-title)', background: 'var(--bg-section-light)', '::placeholder': { color: 'var(--color-main)' } }}
                      onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--brand-title)'; e.currentTarget.style.borderColor = 'var(--brand-title)'; }}
                      onBlur={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--color-main)'; }}
                      placeholder="la-tua-email@esempio.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-title)' }}>
                      Telefono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ borderColor: 'var(--color-main)', color: 'var(--brand-title)', background: 'var(--bg-section-light)', '::placeholder': { color: 'var(--color-main)' } }}
                      onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--brand-title)'; e.currentTarget.style.borderColor = 'var(--brand-title)'; }}
                      onBlur={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--color-main)'; }}
                      placeholder="+39 123 456 789"
                    />
                  </div>

                  <div>
                    <label htmlFor="servizio" className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-title)' }}>
                      Servizio di Interesse *
                    </label>
                    <select
                      id="servizio"
                      name="servizio"
                      required
                      value={formData.servizio}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ borderColor: 'var(--color-main)', color: 'var(--brand-title)', background: 'var(--bg-section-light)', '::placeholder': { color: 'var(--color-main)' } }}
                      onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--brand-title)'; e.currentTarget.style.borderColor = 'var(--brand-title)'; }}
                      onBlur={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--color-main)'; }}
                    >
                      <option value="">Seleziona un servizio</option>
                      <option value="consulenza-nutrizionale">Consulenza Nutrizionale</option>
                      <option value="transizione-graduale">Piano Transizione Graduale</option>
                      <option value="nutrizione-pediatrica">Nutrizione Pediatrica</option>
                      <option value="nutrizione-gravidanza">Nutrizione in Gravidanza</option>
                      <option value="nutrizione-sportiva">Nutrizione Sportiva</option>
                      <option value="corso-online">Corso Online</option>
                      <option value="workshop">Workshop</option>
                      <option value="altro">Altro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="messaggio" className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-title)' }}>
                      Messaggio
                    </label>
                    <textarea
                      id="messaggio"
                      name="messaggio"
                      rows={5}
                      value={formData.messaggio}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ borderColor: 'var(--color-main)', color: 'var(--brand-title)', background: 'var(--bg-section-light)', '::placeholder': { color: 'var(--color-main)' } }}
                      onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--brand-title)'; e.currentTarget.style.borderColor = 'var(--brand-title)'; }}
                      onBlur={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--color-main)'; }}
                      placeholder="Raccontami i tuoi obiettivi e le tue esigenze..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
                  </Button>

                  <p className="text-sm text-center" style={{ color: 'var(--brand-title)' }}>
                    * Campi obbligatori. Ti risponderò entro 24 ore.
                  </p>
                </form>
              </Card>
            </div>

            {/* Informazioni di Contatto */}
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--brand-title)' }}>
                Informazioni di Contatto
              </h2>

              <div className="space-y-6 mb-8">
                <Card className="p-6" style={{ background: 'var(--bg-section-warm)' }}>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl lg:text-3xl" style={{ color: 'var(--brand-title)' }}>📧</div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--brand-title)' }}>Email</h3>
                      <p style={{ color: 'var(--text-darker)' }}>info@puraessenzavegetale.it</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" style={{ background: 'var(--bg-section-warm)' }}>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl lg:text-3xl" style={{ color: 'var(--brand-title)' }}>📞</div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--brand-title)' }}>Telefono</h3>
                      <p style={{ color: 'var(--text-darker)' }}>+39 349 123 4567</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" style={{ background: 'var(--bg-section-warm)' }}>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl lg:text-3xl" style={{ color: 'var(--brand-title)' }}>📍</div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--brand-title)' }}>Studio</h3>
                      <p style={{ color: 'var(--text-darker)' }}>
                        Via Roma 123<br />
                        20121 Milano (MI)
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" style={{ background: 'var(--bg-section-warm)' }}>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl lg:text-3xl" style={{ color: 'var(--brand-title)' }}>🕒</div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--brand-title)' }}>Orari</h3>
                      <div style={{ color: 'var(--text-darker)' }}>
                        <p>Lun - Ven: 9:00 - 18:00</p>
                        <p>Sab: 9:00 - 13:00</p>
                        <p>Dom: Chiuso</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--brand-title)' }}>Seguimi sui Social</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://wa.me/393491234567" 
                    className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
                    aria-label="WhatsApp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="https://t.me/puraessenzavegetale" 
                    className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 transition-colors"
                    aria-label="Telegram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="https://instagram.com/pura_essenza_vegetale" 
                    className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="https://facebook.com/pura.essenza.vegetale" 
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-light) 0%, var(--bg-section-warm) 100%)' }} />

      {/* FAQ Rapide */}
      <section className="py-20" style={{ background: 'var(--bg-section-warm)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--brand-title)' }}>
            Domande Frequenti
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">
                La prima consulenza è davvero gratuita?
              </h3>
              <p style={{ color: 'var(--foreground)' }}>
                Sì! Offro sempre una consulenza gratuita di 30 minuti per conoscerci 
                e capire se posso aiutarti a raggiungere i tuoi obiettivi.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">
                Quanto tempo prima devo prenotare?
              </h3>
              <p style={{ color: 'var(--foreground)' }}>
                Generalmente ho disponibilità entro 1-2 settimane. 
                Per urgenze posso trovare uno spazio prima.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">
                Offri consulenze online?
              </h3>
              <p style={{ color: 'var(--foreground)' }}>
                Sì, le consulenze online sono molto efficaci e mi permettono 
                di seguire pazienti da tutta Italia.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">
                Cosa devo portare alla prima visita?
              </h3>
              <p style={{ color: 'var(--foreground)' }}>
                Eventuali esami del sangue recenti e una lista dei farmaci/integratori 
                che assumi. Ti invierò un questionario preliminare.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Transizione sfumata */}
      <div style={{ height: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(180deg, var(--bg-section-warm) 0%, var(--bg-hero) 100%)' }} />

      {/* Mappa (placeholder) */}
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--brand-title)' }}>
            Come Raggiungermi
          </h2>
          <div style={{ background: 'var(--color-main-light)', height: '24rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <p style={{ color: 'var(--foreground)' }}>
                Mappa interattiva dello studio<br />
                Via Roma 123, Milano
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-main)' }}>
                Metro: Duomo (Linea 1, 3) - 5 minuti a piedi
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}