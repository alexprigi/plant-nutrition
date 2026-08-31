'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const t = useTranslations('booking-success')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }
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
          <p className="text-gray-600 mb-6">{t('error-testo')}</p>
          <Link href="/booking" className="text-[var(--brand-title)] underline">{t('error-link')}</Link>
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

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('titolo')}</h1>
        <p className="text-gray-600 mb-2">{t('testo')}</p>
        <p className="text-sm text-gray-400 mb-8">{t('spam')}</p>

        <Link
          href="/"
          className="inline-block bg-[var(--brand-title)] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          {t('torna-home')}
        </Link>
      </div>
    </div>
  )
}
