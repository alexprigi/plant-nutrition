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

type FollowUpData = {
  subscriptionId: string;
  sessionsRemaining: number;
  serviceName: string;
  client: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    civicNumber: string;
    city: string;
    zipCode: string;
    country: string;
    fiscalCode: string;
  };
};

type View = 'loading' | 'error' | 'calendar' | 'success';

export default function FollowUpBookingPage() {
  const { token } = useParams<{ token: string }>();

  const [view, setView] = useState<View>('loading');
  const [data, setData] = useState<FollowUpData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (now.getDate() >= daysInMonth) return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return now;
  });

  useEffect(() => {
    fetch(`/api/follow-up?token=${token}`)
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          setErrorMsg(res.error);
          setView('error');
        } else {
          setData({
            subscriptionId: res.subscriptionId,
            sessionsRemaining: res.sessionsRemaining,
            serviceName: res.serviceType === 'follow-up' ? 'Visita di Controllo' : res.serviceType,
            client: res.client,
          });
          setView('calendar');
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
    const pad = (n: number) => String(n).padStart(2, '0');
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(`${year}-${pad(month + 1)}-${pad(i)}`);
    }
    return days;
  }, [currentMonthDate]);

  const [slotAvailability, setSlotAvailability] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedDate) return;
    fetch(`/api/bookings?date=${selectedDate}&duration=30`)
      .then(r => r.json())
      .then(data => {
        if (!data.slots) return;
        const map: Record<string, boolean> = {};
        data.slots.forEach((s: { time: string; available: boolean }) => { map[s.time] = s.available; });
        setSlotAvailability(map);
      })
      .catch(() => {});
  }, [selectedDate]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return TIME_SLOTS;
    const today = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === today;
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    return TIME_SLOTS.map(slot => {
      let available = true;
      if (isToday) {
        const [hours, minutes] = slot.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        available = slotTime >= fourHoursFromNow;
      }
      if (Object.keys(slotAvailability).length > 0) {
        available = available && (slotAvailability[slot] ?? true);
      }
      return { time: slot, available };
    });
  }, [selectedDate, slotAvailability]);

  const handleConfirm = async () => {
    if (!data || !selectedDate || !selectedTime) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data.client,
          commercialType: 'follow-up',
          paymentMethod: 'none',
          selectedDate,
          selectedTime,
          notes: notes.trim(),
          isPaid: true,
          status: 'confirmed',
          existingSubscriptionId: data.subscriptionId,
        }),
      });

      if (!res.ok) throw new Error();

      const result = await res.json();

      // Email conferma
      fetch('/api/send-booking-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: `${data.client.name} ${data.client.surname}`,
          clientEmail: data.client.email,
          clientPhone: data.client.phone,
          serviceName: data.serviceName,
          price: 0,
          date: selectedDate,
          time: selectedTime,
          notes: notes.trim(),
          paymentMethod: 'none',
          isPaid: true,
          managementToken: result?.appointment?.managementToken,
          durationMinutes: 30,
        }),
      }).catch(() => {});

      setView('success');
    } catch {
      setErrorMsg('Errore durante la prenotazione. Riprova.');
      setView('error');
    } finally {
      setIsProcessing(false);
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
          <p className="text-gray-600 font-medium">Caricamento...</p>
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

  // --- SUCCESS ---
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-t-4 border-[var(--brand-title)]">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check" size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appuntamento confermato!</h2>
          <p className="text-gray-500 text-sm mb-2">
            Ciao <strong>{data?.client.name}</strong>, il tuo appuntamento è stato prenotato.
          </p>
          <p className="font-bold text-gray-800 mb-6">
            {formattedDate(selectedDate)} alle {selectedTime}
          </p>
          <p className="text-sm text-gray-400 mb-6">Riceverai una email di conferma a breve.</p>
          <Button href="/" className="bg-[var(--brand-title)] text-white w-full">Torna alla Home</Button>
        </div>
      </div>
    );
  }

  // --- CALENDAR ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="min-h-screen bg-[#F5F7F5] py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Prenota la prossima sessione</h1>
          <p className="text-gray-500">
            Ciao <strong>{data?.client.name}</strong> —{' '}
            <span className="text-[var(--brand-title)] font-medium">
              {data?.sessionsRemaining} {data?.sessionsRemaining === 1 ? 'sessione rimasta' : 'sessioni rimaste'}
            </span>{' '}
            nel tuo percorso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Calendario */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex justify-between mb-6 items-center">
              <button
                onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))}
                className="hover:bg-gray-100 p-2 rounded-full text-gray-600 transition-colors"
              >
                <Icon name="chevronLeft" />
              </button>
              <span className="font-bold capitalize text-lg text-gray-900">
                {currentMonthDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))}
                className="hover:bg-gray-100 p-2 rounded-full text-gray-600 transition-colors"
              >
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
                const isSel = d === selectedDate;
                const isPast = new Date(d) < today;
                const isWeekend = new Date(d).getDay() === 0 || new Date(d).getDay() === 6;
                return (
                  <button
                    key={d}
                    onClick={() => !isPast && !isWeekend && setSelectedDate(d)}
                    disabled={isPast || isWeekend}
                    className={`
                      w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm transition-all font-medium
                      ${isPast || isWeekend ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                        : isSel ? 'bg-[var(--brand-title)] text-white font-bold shadow-md scale-110'
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    {new Date(d).getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orari + note + conferma */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
            <h3 className="font-bold text-gray-900 mb-4 text-center">Orari disponibili</h3>
            <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 mb-4">
              {availableTimeSlots.map(slot => {
                const time = typeof slot === 'string' ? slot : slot.time;
                const available = typeof slot === 'string' ? true : slot.available;
                return (
                  <button
                    key={time}
                    onClick={() => available && setSelectedTime(time)}
                    disabled={!available}
                    className={`
                      py-2 rounded-lg text-sm border transition-all font-medium
                      ${!available
                        ? 'text-gray-300 border-gray-100 cursor-not-allowed bg-gray-50'
                        : selectedTime === time
                        ? 'bg-[var(--brand-title)] text-white border-[var(--brand-title)] shadow-md'
                        : 'text-gray-600 border-gray-200 hover:border-[var(--brand-title)] hover:text-[var(--brand-title)]'}
                    `}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-700">Messaggio per Arianna (opzionale)</label>
                <span className="text-xs text-gray-400">{notes.length}/500</span>
              </div>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                maxLength={500}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[var(--brand-title)] resize-none mb-4"
                placeholder="Aggiornamenti, domande..."
              />

              <Button
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime || isProcessing}
                className={`w-full rounded-xl py-3 font-bold text-white transition-all ${
                  !selectedDate || !selectedTime || isProcessing
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[var(--brand-title)] hover:-translate-y-0.5 hover:shadow-lg'
                }`}
              >
                {isProcessing ? 'Conferma in corso...' : 'Conferma appuntamento'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
