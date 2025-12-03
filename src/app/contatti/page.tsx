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
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-main-dark)' }}>Messaggio Inviato!</h1>
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
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-main-dark)' }}>
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
              
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-main-dark)' }}>
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
                      style={{ borderColor: 'var(--color-main)', color: 'var(--foreground)' }}
                      onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-main)'}
                      onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                      placeholder="Il tuo nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-main-dark)' }}>
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
                      style={{ borderColor: 'var(--color-main)', color: 'var(--foreground)' }}
                      onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-main)'}
                      onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                      placeholder="la-tua-email@esempio.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-main-dark)' }}>
                      Telefono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ borderColor: 'var(--color-main)', color: 'var(--foreground)' }}
                      onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-main)'}
                      onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                      placeholder="+39 123 456 789"
                    />
                  </div>

                  <div>
                    <label htmlFor="servizio" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-main-dark)' }}>
                      Servizio di Interesse *
                    </label>
                    <select
                      id="servizio"
                      name="servizio"
                      required
                      value={formData.servizio}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ borderColor: 'var(--color-main)', color: 'var(--foreground)' }}
                      onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-main)'}
                      onBlur={e => e.currentTarget.style.boxShadow = 'none'}
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
                    <label htmlFor="messaggio" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-main-dark)' }}>
                      Messaggio
                    </label>
                    <textarea
                      id="messaggio"
                      name="messaggio"
                      rows={5}
                      value={formData.messaggio}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ borderColor: 'var(--color-main)', color: 'var(--foreground)' }}
                      onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-main)'}
                      onBlur={e => e.currentTarget.style.boxShadow = 'none'}
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

                  <p className="text-sm text-center" style={{ color: 'var(--color-main)' }}>
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
                <Card className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p style={{ color: 'var(--color-main)' }}>info@puraessenzavegetale.it</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📞</div>
                    <div>
                      <h3 className="font-semibold">Telefono</h3>
                      <p style={{ color: 'var(--color-main)' }}>+39 349 123 4567</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📍</div>
                    <div>
                      <h3 className="font-semibold">Studio</h3>
                      <p style={{ color: 'var(--color-main)' }}>
                        Via Roma 123<br />
                        20121 Milano (MI)
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">🕒</div>
                    <div>
                      <h3 className="font-semibold">Orari</h3>
                      <div style={{ color: 'var(--color-main)' }}>
                        <p>Lun - Ven: 9:00 - 18:00</p>
                        <p>Sab: 9:00 - 13:00</p>
                        <p>Dom: Chiuso</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Seguimi sui Social</h3>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="#" 
                    className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="#" 
                    className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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