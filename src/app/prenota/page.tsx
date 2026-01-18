'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import Button from '@/components/ui/Button';
// Rimosso Card per evitare conflitti di stile globali
import { createBooking } from '@/lib/bookingService';
import Icon from '@/components/icons/Icon';

// --- TIPI ---
interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  consultationType: string;
  selectedDate: string;
  selectedTime: string;
  notes: string;
}

// --- COSTANTI ---
const CONSULTATION_TYPES = [
  {
    value: 'consulenza-gratuita',
    title: 'Colloquio Gratuito',
    duration: '15 minuti',
    price: 'Gratuito',
    description: 'Conosciamoci! Ti ascolto, capisco i tuoi obiettivi e ti spiego come posso aiutarti.',
    iconName: 'gift',
    iconColor: '#EA580C',
    iconBg: '#FFF7ED',
    badge: 'SENZA IMPEGNO',
    badgeColor: 'var(--brand-title)', // VERDE SCURO
    bgStyle: { background: 'linear-gradient(to bottom right, #FEF3C7 0%, #FFFBEB 100%)', borderColor: '#FCD34D' }
  },
  {
    value: 'visita-controllo',
    title: 'Visita di Controllo',
    duration: '30 minuti',
    price: '50€',
    description: 'Monitoraggio progressi, analisi esami o integrazione, aggiornamento piano esistente.',
    iconName: 'refreshCcw',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    bgStyle: { background: 'white', borderColor: '#E5E7EB' }
  },
  {
    value: 'prima-visita',
    title: 'Prima Visita Completa',
    duration: '60 min + elaborazione',
    price: '85€',
    description: 'Anamnesi approfondita, piano nutrizionale su misura, protocollo integratori, ricettario e lista spesa.',
    iconName: 'star',
    iconColor: '#CA8A04',
    iconBg: '#FEF9C3',
    badge: 'PER INIZIARE',
    badgeColor: 'var(--brand-title)', // VERDE SCURO
    bgStyle: { background: 'linear-gradient(to bottom right, #D1FAE5 0%, #ECFDF5 100%)', borderColor: '#34D399' }
  },
  {
    value: 'percorso-3mesi',
    title: 'Percorso 3 Mesi',
    duration: '3 consulenze + supporto',
    price: '237€',
    oldPrice: '255€',
    description: '3 consulenze (1 al mese), analisi diario alimentare, Kit "Vegan Safe", supporto email prioritario.',
    iconName: 'route',
    iconColor: '#EA580C',
    iconBg: '#FFF7ED',
    bgStyle: { background: 'white', borderColor: '#E5E7EB' }
  },
  {
    value: 'percorso-6mesi',
    title: 'Percorso 6 Mesi VIP',
    duration: '6 consulenze + chat',
    price: '450€',
    oldPrice: '510€',
    description: '6 consulenze, chat WhatsApp diretta, libreria PDF, analisi etichette e esami del sangue.',
    iconName: 'sparkles',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    badge: 'RISPARMIA 60€',
    badgeColor: '#059669',
    bgStyle: { background: 'linear-gradient(to bottom right, #FFF7ED 0%, #FFFBEB 100%)', borderColor: '#FDBA74' }
  },
];

const TIME_SLOTS: TimeSlot[] = [
  '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
].map(time => ({ time, available: true }));


// --- COMPONENTE ---
const PrenotaPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- STATO ---
  const [currentStep, setCurrentStep] = useState(1);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastBookingId, setLastBookingId] = useState<string | null>(null);

  // Data management
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [bookingData, setBookingData] = useState<BookingData>({
    name: '', surname: '', email: '', phone: '',
    consultationType: 'consulenza-gratuita',
    selectedDate: '', selectedTime: '', notes: '',
  });

  // --- NAVIGAZIONE ---
  useEffect(() => {
    const stepParam = Number(searchParams.get('step')) || 1;
    const showTimeParam = searchParams.get('showTime') === 'true';
    if (stepParam !== currentStep || showTimeParam !== showTimeSelection) {
      setCurrentStep(stepParam);
      setShowTimeSelection(showTimeParam);
    }
  }, [searchParams, currentStep, showTimeSelection]);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      const typeMap: { [key: string]: string } = {
        'controllo': 'visita-controllo',
        'first': 'prima-visita',
        '3mesi': 'percorso-3mesi',
        '6mesi': 'percorso-6mesi',
        'guida-svezzamento': 'guida-svezzamento'
      };
      const mappedType = typeMap[typeParam];
      if (mappedType && bookingData.consultationType !== mappedType) {
        setBookingData(prev => ({ ...prev, consultationType: mappedType }));
      }
    }
  }, [searchParams]);

  const updateUrl = useCallback((step: number, showTime: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', String(step));
    if (showTime) params.set('showTime', 'true');
    else params.delete('showTime');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const goToStep = (step: number, showTime: boolean = false) => {
    setCurrentStep(step);
    setShowTimeSelection(showTime);
    updateUrl(step, showTime);
  };

  // --- CALENDARIO LOGICA ---
  const calendarData = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayObj = new Date(year, month, 1);

    // Lun = 0, Dom = 6
    let startingDayIndex = firstDayObj.getDay() - 1;
    if (startingDayIndex === -1) startingDayIndex = 6;

    const days = [];
    for (let i = 0; i < startingDayIndex; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
    }
    return days;
  }, [currentMonthDate]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentMonthDate);
    newDate.setMonth(newDate.getMonth() + offset);
    const today = new Date();
    const sixMonthsFuture = new Date();
    sixMonthsFuture.setMonth(today.getMonth() + 6);
    if (offset < 0 && newDate.getMonth() < today.getMonth() && newDate.getFullYear() === today.getFullYear()) return;
    if (offset > 0 && newDate > sixMonthsFuture) return;
    setCurrentMonthDate(newDate);
    setSelectedDate('');
  };

  const formatDateIT = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('it-IT', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // --- HANDLER INVIO ---
  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!bookingData.name || !bookingData.surname || !bookingData.email || !bookingData.phone) {
        throw new Error('Compila tutti i campi obbligatori.');
      }
      const newBooking = await createBooking({
        ...bookingData,
        selectedDate,
        selectedTime,
        status: 'pending',
      });
      setLastBookingId(newBooking.id);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert(`Errore: ${error instanceof Error ? error.message : 'Problema sconosciuto'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4" style={{ background: '#F5F7F5' }}>
        <div className="max-w-xl w-full p-8 text-center bg-white rounded-3xl shadow-xl text-gray-800" style={{ borderTop: '5px solid var(--brand-title)' }}>
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="check" size={40} style={{ color: 'var(--brand-title)' }} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Prenotazione Ricevuta!</h2>
          <p className="text-lg mb-6 text-gray-600">
            Grazie <strong>{bookingData.name}</strong>, ti ho inviato una mail di riepilogo.
          </p>
          <Button href="/" variant="primary" className="w-full sm:w-auto" style={{ background: 'var(--brand-title)', color: 'white' }}>
            Torna alla Home
          </Button>
        </div>
      </div>
    );
  }

  // --- HELPER STEPPER (SOLO NUMERI) ---
  const getStepCircleClass = (step: number) => {
    // Step Attivo o Passato: VERDE BRAND
    if (currentStep >= step) return 'bg-[var(--brand-title)] text-white shadow-md border-2 border-[var(--brand-title)]';
    // Step Futuro: Grigio
    return 'bg-white text-gray-300 border-2 border-gray-200';
  };

  const getStepTextClass = (step: number) => {
    if (currentStep >= step) return 'text-[var(--brand-title)] font-bold';
    return 'text-gray-400 font-medium';
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#F5F7F5' }}>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-20">

        {/* --- STEPPER --- */}
        <div className="mb-14 flex justify-center">
          <div className="flex items-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center relative gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${getStepCircleClass(1)}`}>
                1
              </div>
              <span className={`text-[10px] uppercase tracking-widest ${getStepTextClass(1)}`}>Servizio</span>
            </div>
            {/* Linea 1-2 */}
            <div className={`w-24 h-[2px] mx-2 -mt-6 transition-all duration-500 ${currentStep >= 2 ? 'bg-[var(--brand-title)]' : 'bg-gray-200'}`}></div>
            {/* Step 2 */}
            <div className="flex flex-col items-center relative gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${getStepCircleClass(2)}`}>
                2
              </div>
              <span className={`text-[10px] uppercase tracking-widest ${getStepTextClass(2)}`}>Data</span>
            </div>
            {/* Linea 2-3 */}
            <div className={`w-24 h-[2px] mx-2 -mt-6 transition-all duration-500 ${currentStep >= 3 ? 'bg-[var(--brand-title)]' : 'bg-gray-200'}`}></div>
            {/* Step 3 */}
            <div className="flex flex-col items-center relative gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${getStepCircleClass(3)}`}>
                3
              </div>
              <span className={`text-[10px] uppercase tracking-widest ${getStepTextClass(3)}`}>Dati</span>
            </div>
          </div>
        </div>

        {/* --- STEP 1: SCELTA SERVIZIO --- */}
        {currentStep === 1 && (
          <div className="animate-fade-in space-y-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Scegli il tuo percorso</h1>

            {CONSULTATION_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setBookingData(prev => ({ ...prev, consultationType: type.value }))}
                className={`w-full p-6 rounded-2xl border transition-all duration-200 text-left relative group overflow-hidden
                  ${bookingData.consultationType === type.value
                    ? 'ring-2 ring-[var(--brand-title)] shadow-lg transform scale-[1.01]'
                    : 'hover:shadow-md border-transparent'
                  }
                `}
                style={{
                  background: type.bgStyle.background,
                  borderColor: bookingData.consultationType === type.value ? 'transparent' : type.bgStyle.borderColor
                }}
              >
                {type.badge && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm tracking-wide uppercase"
                    style={{ background: type.badgeColor }}
                  >
                    {type.badge}
                  </div>
                )}

                <div className="flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm mt-1"
                    style={{ background: type.iconBg, color: type.iconColor }}
                  >
                    <Icon name={type.iconName as any} size={24} />
                  </div>

                  <div className="flex-1 pr-16">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{type.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3 opacity-90">
                      {type.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-gray-900">{type.price}</span>
                      {type.oldPrice && <span className="text-sm line-through text-gray-400">{type.oldPrice}</span>}
                      <span className="text-xs font-semibold text-gray-500 bg-white/50 px-2 py-1 rounded uppercase tracking-wide">
                        {type.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            <div className="mt-10 text-center">
              <Button
                onClick={() => goToStep(2)}
                className="rounded-full px-10 py-3 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                style={{ background: 'var(--brand-title)', color: 'white' }}
              >
                Continua
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP 2: DATA (DIV BIANCO PURO) --- */}
        {currentStep === 2 && !showTimeSelection && (
          <div className="animate-fade-in">
            <div
              className="p-8 bg-white shadow-xl rounded-3xl border border-gray-100 text-gray-800"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="flex justify-between items-center mb-8">
                <button onClick={() => goToStep(1)} className="text-sm text-gray-500 hover:text-[var(--brand-title)] flex items-center gap-1 transition-colors">
                  ← Indietro
                </button>
                <div className="text-sm font-bold text-gray-800 bg-gray-100 px-4 py-1 rounded-full">
                  {CONSULTATION_TYPES.find(t => t.value === bookingData.consultationType)?.title}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Seleziona una data</h2>

              {/* Controlli Mese (Frecce Pulite) */}
              <div className="flex items-center justify-between mb-8 px-8 max-w-sm mx-auto">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 bg-transparent border-none"
                >
                  <Icon name="chevronLeft" size={24} />
                </button>

                <h3 className="text-xl font-bold capitalize text-gray-900">
                  {currentMonthDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                </h3>

                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 bg-transparent border-none"
                >
                  <Icon name="chevronRight" size={24} />
                </button>
              </div>

              {/* Griglia Calendario */}
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'].map(day => (
                    <div key={day} className="text-center text-[11px] font-bold text-gray-400 tracking-widest">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarData.map((dateStr, idx) => {
                    if (!dateStr) return <div key={`empty-${idx}`} />;
                    const dateObj = new Date(dateStr);
                    const isSelected = selectedDate === dateStr;
                    const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
                    const isToday = dateObj.toDateString() === new Date().toDateString();

                    return (
                      <button
                        key={dateStr}
                        onClick={() => !isPast && setSelectedDate(dateStr)}
                        disabled={isPast}
                        className={`
                          w-10 h-10 mx-auto flex items-center justify-center rounded-full text-sm transition-all duration-200
                          ${isSelected
                            ? 'bg-[var(--brand-title)] text-white font-bold shadow-lg scale-110' // VERDE SCURO
                            : isPast
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-gray-100'
                          }
                          ${!isSelected && isToday ? 'text-[var(--brand-title)] font-extrabold' : ''} // Solo testo verde per oggi
                        `}
                        // Inline style per forzare la visibilità del testo selezionato
                        style={isSelected ? { backgroundColor: 'var(--brand-title)', color: 'white' } : {}}
                      >
                        {dateObj.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10 text-center h-12">
                {selectedDate && (
                  <Button
                    onClick={() => goToStep(2, true)}
                    className="rounded-full px-8 py-2 animate-fade-in-up shadow-lg"
                    style={{ background: 'var(--brand-title)', color: 'white' }}
                  >
                    Conferma Data
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2b: ORARIO --- */}
        {currentStep === 2 && showTimeSelection && (
          <div className="animate-fade-in">
            <div
              className="p-8 bg-white shadow-xl rounded-3xl border border-gray-100 text-gray-800"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="flex justify-between items-center mb-8">
                <button onClick={() => goToStep(2, false)} className="text-sm text-gray-500 hover:text-[var(--brand-title)] flex items-center gap-1">
                  ← Cambia Data
                </button>
                <div className="text-sm font-bold text-gray-800">
                  {formatDateIT(selectedDate)}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Seleziona l'orario</h2>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`
                      py-3 rounded-xl text-sm font-semibold border transition-all duration-200
                      ${selectedTime === slot.time
                        ? 'bg-[var(--brand-title)] text-white border-[var(--brand-title)] shadow-md transform scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                      }
                    `}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              <div className="mt-10 text-center h-12">
                {selectedTime && (
                  <Button
                    onClick={() => goToStep(3)}
                    className="rounded-full px-8 py-2 animate-fade-in-up shadow-lg"
                    style={{ background: 'var(--brand-title)', color: 'white' }}
                  >
                    Prosegui
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: DATI --- */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <div
              className="p-8 bg-white shadow-xl rounded-3xl border border-gray-100 max-w-2xl mx-auto"
              style={{ backgroundColor: '#ffffff', color: '#111827' }}
            >
              <button onClick={() => goToStep(2, true)} className="text-sm text-gray-500 hover:text-[var(--brand-title)] flex items-center gap-1 mb-6">
                ← Indietro
              </button>

              <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">I tuoi dati</h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nome</label>
                    <input
                      type="text"
                      value={bookingData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-[var(--brand-title)] focus:ring-1 focus:ring-[var(--brand-title)] transition-all outline-none"
                      placeholder="Nome"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Cognome</label>
                    <input
                      type="text"
                      value={bookingData.surname}
                      onChange={(e) => handleInputChange('surname', e.target.value)}
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-[var(--brand-title)] focus:ring-1 focus:ring-[var(--brand-title)] transition-all outline-none"
                      placeholder="Cognome"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email</label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-[var(--brand-title)] focus:ring-1 focus:ring-[var(--brand-title)] transition-all outline-none"
                    placeholder="tua@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Telefono</label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-[var(--brand-title)] focus:ring-1 focus:ring-[var(--brand-title)] transition-all outline-none"
                    placeholder="+39 ..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Note (Opzionale)</label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-[var(--brand-title)] focus:ring-1 focus:ring-[var(--brand-title)] transition-all outline-none resize-none"
                    placeholder="Allergie o richieste..."
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-full px-12 py-3 text-lg font-medium shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                  style={{ background: 'var(--brand-title)', color: 'white' }}
                >
                  {isSubmitting ? 'Invio in corso...' : 'Conferma Prenotazione'}
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PrenotaPage;