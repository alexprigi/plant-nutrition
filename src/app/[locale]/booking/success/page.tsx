'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }
    // Il webhook ha già confermato il pagamento lato server.
    // Qui mostriamo solo la conferma visiva.
    setStatus('success')
  }, [sessionId])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-title)]" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-gray-600 mb-6">Si è verificato un errore. Contattaci a info@vivaplantnutrition.com.</p>
          <Link href="/booking" className="text-[var(--brand-title)] underline">Torna alla prenotazione</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--brand-bg)]">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Pagamento confermato!</h1>
        <p className="text-gray-600 mb-2">
          La tua prenotazione è stata confermata. Riceverai a breve una email di conferma con tutti i dettagli.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Controlla anche la cartella spam se non la ricevi entro qualche minuto.
        </p>

        <Link
          href="/"
          className="inline-block bg-[var(--brand-title)] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Torna alla home
        </Link>
      </div>
    </div>
  )
}
