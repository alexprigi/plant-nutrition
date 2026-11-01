'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import Button from '@/components/ui/Button';
import Icon from '@/components/icons/Icon';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
];

type AppointmentData = {
  id: string;
  date: string;
  time: string;
  status: string;
  clientName: string;
  serviceName: string;
  price: number;
  isPaid: boolean;
  isPending: boolean;
  isFree: boolean;
  daysUntil: number;
  canReschedule: boolean;
  canCancel: boolean;
  contactRequired: boolean;
  locale?: string;
};

const DATE_LOCALES: Record<Locale, string> = { it: 'it-IT', de: 'de-DE', en: 'en-GB' };

type View = 'loading' | 'error' | 'main' | 'reschedule' | 'confirm-cancel' | 'done-cancel' | 'done-reschedule';

export default function GestisciPage() {
  const { token } = useParams<{ token: string }>();
  const t = useTranslations('gestisci');
  const locale = useLocale() as Locale;
  const dateLocale = DATE_LOCALES[locale];

  const [view, setView] = useState<View>('loading');
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reschedule state
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (now.getDate() >= daysInMonth) return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return now;
  });

  const errorMessage = (data: { code?: string; error?: string }, fallbackKey?: 'errore-cancellazione' | 'errore-spostamento') =>
    data.code && t.has(`errori.${data.code}`) ? t(`errori.${data.code}`) : data.error || (fallbackKey ? t(fallbackKey) : t('errore-connessione'));

  useEffect(() => {
    fetch(`/api/appointments/manage?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setErrorMsg(errorMessage(data));
          setView('error');
        } else {
          setAppointment(data);
          setView('main');
        }
      })
      .catch(() => {
        setErrorMsg(t('errore-connessione'));
        setView('error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);


  const weekdayInitials = useMemo(
    () => Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(dateLocale, { weekday: 'narrow' })),
    [dateLocale],
  );

  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days = Array(offset).fill(null);
    const pad = (n: number) => String(n).padStart(2, '0');
    for (let i = 1; i <= daysInMonth; i++) days.push(`${year}-${pad(month + 1)}-${pad(i)}`);
    return days;
  }, [currentMonthDate]);

  const handleCancel = async () => {
    setIsProcessing(true);
    const res = await fetch('/api/appointments/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: 'cancel' }),
    });
    const data = await res.json();
    setIsProcessing(false);
    if (data.success) {
      setView('done-cancel');
    } else {
      setErrorMsg(errorMessage(data, 'errore-cancellazione'));
      setView('error');
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) return;
    setIsProcessing(true);
    const res = await fetch('/api/appointments/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: 'reschedule', date: newDate, time: newTime }),
    });
    const data = await res.json();
    setIsProcessing(false);
    if (data.success) {
      setView('done-reschedule');
    } else {
      setErrorMsg(errorMessage(data, 'errore-spostamento'));
      setView('error');
    }
  };

  const formattedDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(dateLocale, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

  // --- LOADING ---
  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--brand-title)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">{t('caricamento')}</p>
        </div>
      </div>
    );
  }

  // --- ERROR ---
  if (view === 'error') {
    return (
      <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-t-4 border-red-400">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="alert" size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('errore-titolo')}</h2>
          <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
          <Button href="/" className="bg-[var(--brand-title)] text-white w-full">{t('torna-home')}</Button>
        </div>
      </div>
    );
  }

  // --- DONE: CANCELLED ---
  if (view === 'done-cancel') {
    const wasRefundable = !!(appointment?.isPaid && !appointment?.isFree && (appointment?.daysUntil ?? 0) > 7);
    return (
      <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-t-4 border-[var(--brand-title)]">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check" size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('cancellato-titolo')}</h2>
          {wasRefundable ? (
            <>
              <p className="text-gray-500 text-sm mb-3">
                {t('rimborso-contatto')}
              </p>
              <a href="mailto:info@vivaplantnutrition.com" className="text-sm font-semibold mb-6 block" style={{ color: 'var(--brand-title)' }}>
                info@vivaplantnutrition.com
              </a>
            </>
          ) : (
            <p className="text-gray-500 text-sm mb-6">
              {t('cancellato-testo')}
            </p>
          )}
          <Button href="/booking" className="bg-[var(--brand-title)] text-white w-full">{t('prenota-nuovo')}</Button>
        </div>
      </div>
    );
  }

  // --- DONE: RESCHEDULED ---
  if (view === 'done-reschedule') {
    return (
      <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-t-4 border-[var(--brand-title)]">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check" size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('spostato-titolo')}</h2>
          <p className="text-gray-500 text-sm mb-2">{t('spostato-a')}</p>
          <p className="font-bold text-gray-800 mb-6">
            {t('data-ora', { data: formattedDate(newDate), ora: newTime })}
          </p>
          <Button href="/" className="bg-[var(--brand-title)] text-white w-full">{t('torna-home')}</Button>
        </div>
      </div>
    );
  }

  // --- CONFIRM CANCEL ---
  if (view === 'confirm-cancel') {
    return (
      <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-t-4 border-red-400">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="alert" size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('conferma-cancellazione-titolo')}</h2>
          <p className="text-gray-500 text-sm mb-6">
            {t.rich('conferma-cancellazione-testo', {
              data: appointment ? formattedDate(appointment.date) : '',
              ora: appointment?.time ?? '',
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setView('main')}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              {t('annulla')}
            </button>
            <Button
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex-1 bg-red-500 text-white rounded-xl hover:bg-red-600"
            >
              {isProcessing ? t('cancellazione-in-corso') : t('si-cancella')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- RESCHEDULE VIEW ---
  if (view === 'reschedule') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="min-h-screen bg-[#F5F7F5] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setView('main')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm font-medium transition-colors"
          >
            <Icon name="chevronLeft" size={16} /> {t('indietro')}
          </button>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{t('nuova-data-titolo')}</h1>
          <p className="text-center text-gray-500 mb-8 text-sm">
            {t.rich('appuntamento-attuale', {
              data: appointment ? formattedDate(appointment.date) : '',
              ora: appointment?.time ?? '',
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CALENDAR */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex justify-between mb-6 items-center">
                <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))} className="hover:bg-gray-100 p-2 rounded-full text-gray-600 transition-colors">
                  <Icon name="chevronLeft" />
                </button>
                <span className="font-bold capitalize text-lg text-gray-900">
                  {currentMonthDate.toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))} className="hover:bg-gray-100 p-2 rounded-full text-gray-600 transition-colors">
                  <Icon name="chevronRight" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {weekdayInitials.map((d, i) => (
                  <span key={i} className="text-xs font-bold text-gray-400">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const isSel = d === newDate;
                  const isPast = new Date(d) <= today;
                  const isWeekend = new Date(d).getDay() === 0 || new Date(d).getDay() === 6;
                  const isCurrent = d === appointment?.date;
                  return (
                    <button
                      key={d}
                      onClick={() => !isPast && !isWeekend && setNewDate(d)}
                      disabled={isPast || isWeekend}
                      title={isCurrent ? t('data-attuale') : undefined}
                      className={`
                        w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm transition-all font-medium
                        ${isPast || isWeekend
                          ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                          : isSel
                          ? 'bg-[var(--brand-title)] text-white font-bold shadow-md scale-110'
                          : isCurrent
                          ? 'text-[var(--brand-title)] font-bold ring-2 ring-[var(--brand-title)] ring-offset-1 hover:bg-gray-100'
                          : 'text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      {new Date(d).getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SLOTS */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
              <h3 className="font-bold text-gray-900 mb-4 text-center">{t('orari-disponibili')}</h3>
              <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setNewTime(slot)}
                    className={`
                      py-2 rounded-lg text-sm border transition-all font-medium
                      ${newTime === slot
                        ? 'bg-[var(--brand-title)] text-white border-[var(--brand-title)] shadow-md'
                        : 'text-gray-600 border-gray-200 hover:border-[var(--brand-title)] hover:text-[var(--brand-title)]'}
                    `}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <Button
                  onClick={handleReschedule}
                  disabled={!newDate || !newTime || isProcessing}
                  className={`w-full rounded-xl py-3 font-bold text-white transition-all ${
                    !newDate || !newTime
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[var(--brand-title)] hover:-translate-y-0.5 hover:shadow-lg'
                  }`}
                >
                  {isProcessing ? t('spostamento-in-corso') : t('conferma-spostamento')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN VIEW ---
  return (
    <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">{t('tuo-appuntamento')}</h1>
        <p className="text-center text-gray-500 text-sm mb-6">{t.rich('ciao', { nome: appointment?.clientName ?? '', b: (chunks) => <strong>{chunks}</strong> })}</p>

        {/* Dettagli appuntamento */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">{t('etichetta-data')}</span>
            <span className="font-bold text-gray-800">{appointment && formattedDate(appointment.date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">{t('etichetta-orario')}</span>
            <span className="font-bold text-gray-800">{appointment?.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">{t('etichetta-stato')}</span>
            <span className={`font-bold text-sm ${appointment?.isPending ? 'text-amber-600' : 'text-green-600'}`}>
              {appointment?.isPending ? t('stato-in-attesa') : t('stato-confermato')}
            </span>
          </div>
        </div>

        {/* Azioni */}
        <div className="space-y-3">
          {/* Contatto richiesto: meno di 24h */}
          {appointment?.contactRequired && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-bold mb-1">{t('meno-24h-titolo')}</p>
              <p>{t('meno-24h-testo')}</p>
              <a href="mailto:info@vivaplantnutrition.com" className="font-semibold underline mt-1 block">
                info@vivaplantnutrition.com
              </a>
            </div>
          )}

          {/* Spostamento disponibile */}
          {appointment?.canReschedule && (
            <Button
              onClick={() => setView('reschedule')}
              className="w-full bg-[var(--brand-title)] text-white rounded-xl py-3 font-bold"
            >
              {t('sposta')}
            </Button>
          )}

          {/* Info fascia 2-7 giorni: solo spostamento, no rimborso */}
          {appointment?.canReschedule && !appointment?.canCancel && (
            <p className="text-xs text-gray-400 text-center">
              {t.rich('solo-spostamento', {
                link: (chunks) => <Link href="/cancellation-policy" target="_blank" className="underline">{chunks}</Link>,
              })}
            </p>
          )}

          {/* Cancellazione disponibile */}
          {appointment?.canCancel && (
            <button
              onClick={() => setView('confirm-cancel')}
              className="w-full py-3 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
            >
              {t('cancella')}
            </button>
          )}

          {/* Info rimborso per cancellazione >7 giorni */}
          {appointment?.canCancel && appointment?.isPaid && !appointment?.isFree && (appointment?.daysUntil ?? 0) > 7 && (
            <p className="text-xs text-gray-400 text-center">
              {t.rich('info-rimborso', {
                mail: (chunks) => <a href="mailto:info@vivaplantnutrition.com" className="underline">{chunks}</a>,
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
