'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
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
  canReschedule: boolean;
  canCancel: boolean;
};

type View = 'loading' | 'error' | 'main' | 'reschedule' | 'confirm-cancel' | 'done-cancel' | 'done-reschedule';

export default function GestisciPage() {
  const { token } = useParams<{ token: string }>();

  const [view, setView] = useState<View>('loading');
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reschedule state
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  useEffect(() => {
    fetch(`/api/appointments/manage?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setErrorMsg(data.error);
          setView('error');
        } else {
          setAppointment(data);
          setView('main');
        }
      })
      .catch(() => {
        setErrorMsg('Errore di connessione. Riprova più tardi.');
        setView('error');
      });
  }, [token]);

  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days = Array(offset).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i).toISOString().split('T')[0]);
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
      setErrorMsg(data.error || 'Errore durante la cancellazione.');
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
      setErrorMsg(data.error || 'Errore durante lo spostamento.');
      setView('error');
    }
  };

  const formattedDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('it-IT', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

  // --- LOADING ---
  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--brand-title)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Caricamento appuntamento...</p>
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Link non valido</h2>
          <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
          <Button href="/" className="bg-[var(--brand-title)] text-white w-full">Torna alla Home</Button>
        </div>
      </div>
    );
  }

  // --- DONE: CANCELLED ---
  if (view === 'done-cancel') {
    return (
      <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-t-4 border-[var(--brand-title)]">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check" size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Appuntamento cancellato</h2>
          <p className="text-gray-500 text-sm mb-6">
            Il tuo appuntamento è stato cancellato. Se vuoi prenotarne uno nuovo, puoi farlo dal sito.
          </p>
          <Button href="/prenota" className="bg-[var(--brand-title)] text-white w-full">Prenota un nuovo appuntamento</Button>
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Appuntamento spostato</h2>
          <p className="text-gray-500 text-sm mb-2">Il tuo appuntamento è stato spostato a:</p>
          <p className="font-bold text-gray-800 mb-6">
            {formattedDate(newDate)} alle {newTime}
          </p>
          <Button href="/" className="bg-[var(--brand-title)] text-white w-full">Torna alla Home</Button>
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Conferma cancellazione</h2>
          <p className="text-gray-500 text-sm mb-6">
            Sei sicuro di voler cancellare l'appuntamento del{' '}
            <strong>{appointment && formattedDate(appointment.date)}</strong> alle{' '}
            <strong>{appointment?.time}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setView('main')}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <Button
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex-1 bg-red-500 text-white rounded-xl hover:bg-red-600"
            >
              {isProcessing ? 'Cancellazione...' : 'Sì, cancella'}
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
            <Icon name="chevronLeft" size={16} /> Indietro
          </button>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Scegli la nuova data</h1>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Appuntamento attuale: <strong>{appointment && formattedDate(appointment.date)}</strong> alle <strong>{appointment?.time}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CALENDAR */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex justify-between mb-6 items-center">
                <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))} className="hover:bg-gray-100 p-2 rounded-full text-gray-600 transition-colors">
                  <Icon name="chevronLeft" />
                </button>
                <span className="font-bold capitalize text-lg text-gray-900">
                  {currentMonthDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))} className="hover:bg-gray-100 p-2 rounded-full text-gray-600 transition-colors">
                  <Icon name="chevronRight" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, i) => (
                  <span key={i} className="text-xs font-bold text-gray-400">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const isSel = d === newDate;
                  const isPast = new Date(d) <= today;
                  const isCurrent = d === appointment?.date;
                  return (
                    <button
                      key={d}
                      onClick={() => !isPast && !isCurrent && setNewDate(d)}
                      disabled={isPast || isCurrent}
                      title={isCurrent ? 'Data attuale' : undefined}
                      className={`
                        w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm transition-all font-medium
                        ${isPast || isCurrent
                          ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                          : isSel
                          ? 'bg-[var(--brand-title)] text-white font-bold shadow-md scale-110'
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
              <h3 className="font-bold text-gray-900 mb-4 text-center">Orari disponibili</h3>
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
                  {isProcessing ? 'Spostamento in corso...' : 'Conferma spostamento'}
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
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Il tuo appuntamento</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Ciao <strong>{appointment?.clientName}</strong></p>

        {/* Dettagli appuntamento */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Data</span>
            <span className="font-bold text-gray-800">{appointment && formattedDate(appointment.date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Orario</span>
            <span className="font-bold text-gray-800">{appointment?.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Stato</span>
            <span className={`font-bold text-sm ${appointment?.isPending ? 'text-amber-600' : 'text-green-600'}`}>
              {appointment?.isPending ? '⏳ In attesa di pagamento' : '✅ Confermato'}
            </span>
          </div>
        </div>

        {/* Azioni */}
        <div className="space-y-3">
          {appointment?.canReschedule && (
            <Button
              onClick={() => setView('reschedule')}
              className="w-full bg-[var(--brand-title)] text-white rounded-xl py-3 font-bold"
            >
              Sposta appuntamento
            </Button>
          )}

          {!appointment?.canReschedule && appointment?.status === 'CONFIRMED' && (
            <div className="text-center text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-3">
              Lo spostamento non è più disponibile (meno di 24 ore all'appuntamento).
            </div>
          )}

          {appointment?.canCancel && (
            <button
              onClick={() => setView('confirm-cancel')}
              className="w-full py-3 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Cancella appuntamento
            </button>
          )}

          {!appointment?.canCancel && !appointment?.canReschedule && (
            <p className="text-center text-sm text-gray-400">
              Per modifiche contatta direttamente Arianna.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
