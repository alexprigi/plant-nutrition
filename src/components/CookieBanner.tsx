'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function CookieBanner() {
  const t = useTranslations('cookie');
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
    if (allAccepted.analytics) initializeAnalytics();
  };

  const handleRejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    setPreferences(onlyNecessary);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
    if (preferences.analytics) initializeAnalytics();
  };

  const initializeAnalytics = () => {
    // TODO: Inizializza Google Analytics
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[998]" style={{ backdropFilter: 'blur(2px)' }} />

      <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 sm:p-6" style={{ background: 'rgba(255, 255, 255, 0.98)' }}>
        <div className="max-w-6xl mx-auto">
          {!showSettings ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--brand-title)' }}>
                  {t('titolo')}
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-dark-green)' }}>
                  {t('testo')}
                </p>
                <Link href="/privacy-policy" className="text-sm underline" style={{ color: 'var(--color-main)' }}>
                  {t('privacy-link')}
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 rounded-lg border transition-all text-sm font-medium whitespace-nowrap"
                  style={{ borderColor: 'var(--brand-title)', color: 'var(--brand-title)', background: 'white' }}
                >
                  {t('impostazioni')}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap"
                  style={{ background: '#e5e7eb', color: '#374151', border: '1px solid #d1d5db' }}
                >
                  {t('rifiuta')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  {t('accetta')}
                </button>
              </div>
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--brand-title)' }}>
                  {t('gestisci-titolo')}
                </h3>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full" aria-label={t('chiudi')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-section-light)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold" style={{ color: 'var(--brand-title)' }}>{t('necessari-titolo')}</h4>
                    <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'var(--color-main)', color: 'white' }}>{t('necessari-badge')}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('necessari-testo')}</p>
                </div>

                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-section-light)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold" style={{ color: 'var(--brand-title)' }}>{t('analitici-titolo')}</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ background: preferences.analytics ? 'var(--color-main)' : '#ccc' }} />
                    </label>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('analitici-testo')}</p>
                </div>

                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-section-light)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold" style={{ color: 'var(--brand-title)' }}>{t('marketing-titolo')}</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={preferences.marketing} onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ background: preferences.marketing ? 'var(--color-main)' : '#ccc' }} />
                    </label>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-dark-green)' }}>{t('marketing-testo')}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleRejectAll} className="flex-1 px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  style={{ background: '#e5e7eb', color: '#374151', border: '1px solid #d1d5db' }}>
                  {t('rifiuta')}
                </button>
                <button onClick={handleSavePreferences} className="flex-1 px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  style={{ background: 'var(--brand-title)', color: 'white' }}>
                  {t('salva')}
                </button>
                <button onClick={handleAcceptAll} className="flex-1 px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  style={{ background: 'var(--color-main)', color: 'white' }}>
                  {t('accetta')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
