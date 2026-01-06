'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { createBooking } from '@/lib/bookingService';

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

const PrenotaPage = () => {
  const router = useRouter();
    // Se sei nello step 1 e premi back, torna alla home
    useEffect(() => {
      const onPopState = () => {
        const stepParam = Number(new URLSearchParams(window.location.search).get('step')) || 1;
        if (stepParam <= 1) {
          router.replace('/');
        }
      };
      window.addEventListener('popstate', onPopState);
      return () => window.removeEventListener('popstate', onPopState);
    }, [router]);
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Ottieni il path corrente

  // Inizializza lo stato in base ai parametri URL, se presenti
  // Se non ci sono parametri, lo step iniziale sarà 1 e showTimeSelection false.
  // NON forziamo l'URL qui, lo faremo solo quando l'utente naviga esplicitamente.
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    consultationType: 'consulenza-standard',
    selectedDate: '',
    selectedTime: '',
    notes: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available time slots (configurable) - includes evening hours and weekends
  const timeSlots: TimeSlot[] = [
    { time: '08:30', available: true },
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: true },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
    { time: '18:00', available: true },
    { time: '18:30', available: true },
    { time: '19:00', available: true },
    { time: '19:30', available: true },
    { time: '20:00', available: true },
    { time: '20:30', available: true },
  ];

  // Generate next 6 months of available dates (including weekends)
  const generateAvailableDates = useCallback(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 180; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  const availableDates = generateAvailableDates();

  // Generate available months for the selector
  const generateAvailableMonths = useCallback(() => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = month.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
      });
      const capitalizedLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
      months.push({ key: monthKey, label: capitalizedLabel });
    }
    return months;
  }, []);

  const availableMonths = generateAvailableMonths();

  // Filter dates by selected month
  const getFilteredDates = useCallback(() => {
    return availableDates.filter(date => date.startsWith(selectedMonth));
  }, [availableDates, selectedMonth]);

  // Organize dates into weeks with weekends always in the last columns
  const organizeWeeks = useCallback((dates: string[]) => {
    const weeks: string[][] = [];
    let currentWeek: string[] = [];
    dates.forEach(date => {
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      if (dayOfWeek === 1 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(date);
    });
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    return weeks;
  }, []);

  const filteredDates = getFilteredDates();
  const weekGroups = organizeWeeks(filteredDates);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Funzione per aggiornare l'URL con i parametri dello step e showTime
  // Questa funzione ora gestisce anche l'assenza di parametri iniziali per evitare push inutili
  const updateUrl = useCallback(
    (step: number, showTime: boolean, replace: boolean = false) => {
      const params = new URLSearchParams();
      params.set('step', String(step));
      if (showTime) {
        params.set('showTime', 'true');
      }

      const queryString = params.toString();
      const newUrl = `${pathname}?${queryString}`;

      if (replace) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }
    },
    [router, pathname]
  );

  // Sincronizza lo stato React con i parametri dell'URL
  useEffect(() => {
    const stepParam = Number(searchParams.get('step')) || 1;
    const showTimeParam = searchParams.get('showTime') === 'true';

    // Aggiorna lo stato React solo se ci sono parametri nell'URL
    // o se lo step attuale è diverso da quello predefinito (1)
    if (searchParams.has('step') || currentStep !== stepParam || showTimeSelection !== showTimeParam) {
      setCurrentStep(stepParam);
      setShowTimeSelection(showTimeParam);
    }
  }, [searchParams, currentStep, showTimeSelection]);


  // Funzioni di navigazione che aggiornano lo stato e l'URL
  const goToStep = (step: number, showTime: boolean = false) => {
    setCurrentStep(step);
    setShowTimeSelection(showTime);
    updateUrl(step, showTime);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setBookingData(prev => ({ ...prev, selectedDate: date }));
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, selectedTime: time }));
  };
  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validazione minima dei campi obbligatori
      if (!bookingData.name || !bookingData.surname || !bookingData.email || !bookingData.phone) {
        throw new Error('Per favore, compila tutti i campi obbligatori.');
      }

      const newBooking = createBooking({
        name: bookingData.name,
        surname: bookingData.surname,
        email: bookingData.email,
        phone: bookingData.phone,
        consultationType: bookingData.consultationType,
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        notes: bookingData.notes,
        status: 'pending',
      });
      alert(`Prenotazione confermata!
ID: ${newBooking.id}
Cliente: ${newBooking.name} ${newBooking.surname}
Data: ${formatDate(newBooking.selectedDate)} alle ${newBooking.selectedTime}

Riceverai una conferma via email entro 24 ore.`);
      // Reset form
      setBookingData({
        name: '',
        surname: '',
        email: '',
        phone: '',
        consultationType: 'consulenza-standard',
        selectedDate: '',
        selectedTime: '',
        notes: '',
      });
      setSelectedDate('');
      setSelectedTime('');
      // Dopo la prenotazione, vogliamo tornare allo step 1 e pulire l'URL
      // Usiamo 'replace' per non aggiungere una nuova entry nella cronologia
      // e permettere all'utente di tornare indietro alla pagina precedente alla prenotazione.
      router.replace(pathname, { scroll: false });
      setCurrentStep(1);
      setShowTimeSelection(false);
    } catch (error) {
      console.error('Errore invio prenotazione:', error);
      alert(`Errore nell'invio della prenotazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-section-light)' }}>
      {/* Decorative circles */}
      <div className="absolute top-20 right-0 w-80 h-80 rounded-full opacity-10" 
        style={{ background: 'var(--color-main)', transform: 'translate(40%, -20%)' }}
      />
      <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full opacity-8" 
        style={{ background: 'linear-gradient(135deg, var(--bg-hero) 0%, #F4E5C2 100%)', transform: 'translate(-40%, 20%)' }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 pt-20">
          <div className="inline-block mb-4">
            <span className="text-5xl">📅</span>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--brand-title)' }}>
            Prenota la tua Consulenza
          </h1>
          <p className="text-xl mb-4" style={{ color: 'var(--color-main)' }}>
            Scegli il giorno e l'orario più comodo per te
          </p>
          <div className="rounded-lg p-4 max-w-2xl mx-auto" style={{ background: 'var(--bg-section-warm)', color: 'var(--brand-title)', border: '1px solid var(--color-main)' }}>
            <p className="text-sm">
              ℹ️ <strong>Nota:</strong> Tutte le prenotazioni sono soggette a conferma.
              Riceverai una risposta entro 24 ore per confermare l'appuntamento.
              Anche i weekend sono disponibili per le consulenze online.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-[var(--color-main)] text-[var(--brand-title)]' : 'bg-[var(--background)] text-[var(--foreground)]'}`}>
              1
            </div>
            <div className={`h-1 w-16 ${currentStep > 1 ? 'bg-[var(--color-main)]' : 'bg-[var(--background)]'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-[var(--color-main)] text-[var(--brand-title)]' : 'bg-[var(--background)] text-[var(--foreground)]'}`}>
              2
            </div>
            <div className={`h-1 w-16 ${currentStep > 2 ? 'bg-[var(--color-main)]' : 'bg-[var(--background)]'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-[var(--color-main)] text-[var(--brand-title)]' : 'bg-[var(--background)] text-[var(--foreground)]'}`}>
              3
            </div>
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-3 gap-16 text-center">
            <span className={`text-sm ${currentStep >= 1 ? 'text-[var(--color-main)] font-medium' : 'text-[var(--foreground)]'}`}>
              Tipo Consulenza
            </span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-[var(--color-main)] font-medium' : 'text-[var(--foreground)]'}`}>
              Data e Orario
            </span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-[var(--color-main)] font-medium' : 'text-[var(--foreground)]'}`}>
              Dati Personali
            </span>
          </div>
        </div>

        {/* Step 1: Consultation Type Selection */}
        {currentStep === 1 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-title)' }}>Scegli il Tipo di Consulenza</h2>
            <p className="mb-8" style={{ color: 'var(--color-main)' }}>
              Seleziona il tipo di consulenza che preferisci. Questo ci aiuterà a mostrarti la disponibilità corretta.
            </p>
            <div className="space-y-4">
              {[
                {
                  value: 'consulenza-breve',
                  title: 'Consulenza Breve',
                  duration: '30 minuti',
                  price: '40-45€',
                  description: 'Check rapido per valori del sangue, supplementazione o analisi acidi grassi.',
                  icon: '🔍',
                },
                {
                  value: 'consulenza-standard',
                  title: 'Consulenza Standard',
                  duration: '60 minuti',
                  price: '85€',
                  description: 'Sessione completa con analisi nutrizionale dettagliata, feedback via E-Mail e PDF riassuntivo.',
                  icon: '📊',
                },
                {
                  value: 'pacchetto-doppio',
                  title: 'Pacchetto Doppio',
                  duration: '2 x 60 minuti',
                  price: '149€',
                  description: 'Due sessioni complete con analisi nutrizionale, supporto integrazione e analisi valori personalizzata.',
                  icon: '💻',
                },
                {
                  value: 'percorso-completo',
                  title: 'Percorso Completo 3 Mesi',
                  duration: '6 consulenze + supporto',
                  price: '499€',
                  description: 'Accompagnamento completo con 6 consulenze, supporto WhatsApp per 3 mesi, piani alimentari e materiali esclusivi. Risparmia il 40%!',
                  icon: '🌟',
                },
              ].map(consultation => (
                <button
                  key={consultation.value}
                  onClick={() => {
                    setBookingData(prev => ({ ...prev, consultationType: consultation.value }));
                  }}
                  className={`w-full p-6 rounded-lg border-2 transition-all duration-200 text-left cursor-pointer hover:shadow-lg ${
                    bookingData.consultationType === consultation.value
                      ? 'border-[var(--brand-title)] shadow-md scale-[1.02]'
                      : 'border-transparent hover:border-[var(--color-main)]'
                  }`}
                  style={{
                    background: consultation.value === 'consulenza-standard' 
                      ? 'var(--bg-section-warm)' 
                      : 'var(--brand-title)',
                    color: consultation.value === 'consulenza-standard' 
                      ? 'var(--brand-title)' 
                      : 'white'
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{consultation.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold" style={{ 
                          color: consultation.value === 'consulenza-standard' 
                            ? 'var(--brand-title)' 
                            : 'white' 
                        }}>
                          {consultation.title}
                        </h3>
                        <div className="text-right">
                          <div className="text-xl font-bold" style={{ 
                            color: consultation.value === 'consulenza-standard' 
                              ? 'var(--brand-title)' 
                              : 'var(--bg-hero)' 
                          }}>
                            {consultation.price}
                          </div>
                          <div className="text-sm" style={{ 
                            color: consultation.value === 'consulenza-standard' 
                              ? 'var(--color-main)' 
                              : 'rgba(255,255,255,0.8)' 
                          }}>
                            {consultation.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm" style={{ 
                        color: consultation.value === 'consulenza-standard' 
                          ? 'var(--text-darker)' 
                          : 'rgba(255,255,255,0.9)' 
                      }}>
                        {consultation.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {bookingData.consultationType && (
              <div className="mt-8 text-center">
                <p className="text-lg mb-4" style={{ color: 'var(--brand-title)' }}>
                  Tipo selezionato: <strong>
                    {bookingData.consultationType === 'consulenza-breve' ? 'Consulenza Breve (30 min) - 40-45€' :
                      bookingData.consultationType === 'consulenza-standard' ? 'Consulenza Standard (60 min) - 85€' :
                      bookingData.consultationType === 'pacchetto-doppio' ? 'Pacchetto Doppio (2x60 min) - 149€' :
                        'Percorso Completo 3 Mesi (6 consulenze) - 499€'}
                  </strong>
                </p>
                <Button
                  onClick={() => goToStep(2)}
                  variant="primary"
                  size="lg"
                  className="hover:opacity-90 cursor-pointer"
                >
                  Continua
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Step 2: Date Selection */}
        {currentStep === 2 && !showTimeSelection && (
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--brand-title)' }}>Seleziona la Data</h2>
              <button
                onClick={() => goToStep(1)}
                style={{ color: 'var(--color-main)' }}
                className="cursor-pointer"
              >
                ← Cambia tipo consulenza
              </button>
            </div>
            <div className="rounded-lg p-4 mb-8" style={{ background: 'var(--bg-section-warm)', border: '1px solid var(--color-main)', color: 'var(--brand-title)' }}>
              <p>
                📋 <strong>Tipo selezionato:</strong> {
                  bookingData.consultationType === 'consulenza-breve' ? 'Consulenza Breve (30 min) - 40-45€' :
                    bookingData.consultationType === 'consulenza-standard' ? 'Consulenza Standard (60 min) - 85€' :
                      bookingData.consultationType === 'pacchetto-doppio' ? 'Pacchetto Doppio (2x60 min) - 149€' :
                        'Percorso Completo 3 Mesi (6 consulenze) - 499€'
                }
              </p>
            </div>
            {/* Month Selector with arrows */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--brand-title)' }}>
                Seleziona il mese
              </label>
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={() => {
                    const currentIndex = availableMonths.findIndex(m => m.key === selectedMonth);
                    if (currentIndex > 0) {
                      setSelectedMonth(availableMonths[currentIndex - 1].key);
                      setSelectedDate('');
                    }
                  }}
                  disabled={availableMonths.findIndex(m => m.key === selectedMonth) === 0}
                  className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg cursor-pointer"
                  style={{ background: 'var(--bg-section-warm)', border: '1px solid var(--color-main)', color: 'var(--brand-title)' }}
                >
                  ‹
                </button>
                <div className="text-xl font-semibold min-w-[250px] text-center" style={{ color: 'var(--brand-title)' }}>
                  {availableMonths.find(m => m.key === selectedMonth)?.label}
                </div>
                <button
                  onClick={() => {
                    const currentIndex = availableMonths.findIndex(m => m.key === selectedMonth);
                    if (currentIndex < availableMonths.length - 1) {
                      setSelectedMonth(availableMonths[currentIndex + 1].key);
                      setSelectedDate('');
                    }
                  }}
                  disabled={availableMonths.findIndex(m => m.key === selectedMonth) === availableMonths.length - 1}
                  className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg cursor-pointer"
                  style={{ background: 'var(--bg-section-warm)', border: '1px solid var(--color-main)', color: 'var(--brand-title)' }}
                >
                  ›
                </button>
              </div>
            </div>

            {/* Calendar days organized by weeks */}
            <div className="space-y-4">
              {/* Week day headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-4" style={{ color: 'var(--color-main)' }}>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mer</div>
                <div>Gio</div>
                <div>Ven</div>
                <div>Sab</div>
                <div>Dom</div>
              </div>
              {/* Weeks */}
              {weekGroups.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const targetDay = dayIndex + 1; // 1 = Monday, 7 = Sunday
                    const date = week.find(d => {
                      const dateObj = new Date(d);
                      let dayOfWeek = dateObj.getDay();
                      if (dayOfWeek === 0) dayOfWeek = 7;
                      return dayOfWeek === targetDay;
                    });
                    if (!date) {
                      return <div key={dayIndex} className="p-4"></div>;
                    }
                    const dateObj = new Date(date);
                    return (
                      <button
                        key={date}
                        onClick={() => {
                          handleDateSelect(date);
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors duration-200 flex items-center justify-center min-h-[60px] cursor-pointer hover:shadow-md ${selectedDate === date
                            ? 'border-[var(--brand-title)] bg-[var(--color-main-light)] text-[var(--brand-title)]'
                            : 'border-[var(--color-main-light)] hover:border-[var(--color-main)] text-[var(--foreground)]'
                          }`}
                      >
                        <div className="text-lg font-bold">
                          {dateObj.getDate()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            {filteredDates.length === 0 && (
              <div className="text-center py-8" style={{ color: 'var(--color-main)' }}>
                Nessuna data disponibile per questo mese
              </div>
            )}
            {selectedDate && (
              <div className="mt-8 text-center">
                <p className="text-lg mb-4" style={{ color: 'var(--brand-title)' }}>
                  Data selezionata: <strong>{formatDate(selectedDate)}</strong>
                </p>
                <Button
                  onClick={() => goToStep(2, true)} // Vai alla selezione orario (step 2, showTime true)
                  variant="primary"
                  size="lg"
                  className="hover:opacity-90 cursor-pointer"
                >
                  Continua
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Step 2b: Time Selection */}
        {currentStep === 2 && showTimeSelection && (
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--brand-title)' }}>Scegli l'Orario</h2>
              <button
                onClick={() => goToStep(2, false)} // Torna alla selezione data (step 2, showTime false)
                style={{ color: 'var(--color-main)' }}
                className="cursor-pointer"
              >
                ← Cambia data
              </button>
            </div>
            <div className="rounded-lg p-4 mb-8" style={{ background: 'var(--bg-section-warm)', border: '1px solid var(--color-main)', color: 'var(--brand-title)' }}>
              <p>
                📅 <strong>Data selezionata:</strong> {formatDate(selectedDate)}<br />
                📋 <strong>Consulenza:</strong> {
                  bookingData.consultationType === 'prima-visita' ? 'Prima Visita (60 min) - €80' :
                    bookingData.consultationType === 'controllo' ? 'Controllo (30 min) - €50' :
                      'Consulenza Online (45 min) - €60'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`p-4 rounded-lg border-2 transition-colors duration-200 hover:shadow-md ${!slot.available
                      ? 'border-[var(--color-main-light)] bg-[var(--background)]' // disabled: keep gray-400 for now for disabled text
                      : selectedTime === slot.time
                        ? 'border-[var(--brand-title)] bg-[var(--color-main-light)] text-[var(--brand-title)] cursor-pointer'
                        : 'border-[var(--color-main-light)] hover:border-[var(--color-main)] text-[var(--foreground)] cursor-pointer'
                    }`}
                >
                  <div className="font-medium">{slot.time}</div>
                  {!slot.available && (
                    <div className="text-xs text-red-500 mt-1">Occupato</div>
                  )}
                </button>
              ))}
            </div>

            {selectedTime && (
              <div className="text-center">
                <div className="rounded-lg p-4 mb-6" style={{ background: 'var(--bg-section-warm)', border: '1px solid var(--color-main)', color: 'var(--brand-title)' }}>
                  <p>
                    📅 <strong>Riepilogo:</strong> {formatDate(selectedDate)} alle {selectedTime}<br />
                    📋 <strong>Consulenza:</strong> {
                      bookingData.consultationType === 'prima-visita' ? 'Prima Visita (60 min) - €80' :
                        bookingData.consultationType === 'controllo' ? 'Controllo (30 min) - €50' :
                          'Consulenza Online (45 min) - €60'
                    }
                  </p>
                </div>
                <Button
                  onClick={() => goToStep(3)}
                  variant="primary"
                  size="lg"
                  className="hover:opacity-90 cursor-pointer"
                >
                  Continua
                </Button>
              </div>
            )}
          </Card>
        )}
        {currentStep === 3 && (
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--brand-title)' }}>I Tuoi Dati</h2>
              <button
                onClick={() => goToStep(2, true)} // Torna alla selezione orario (step 2, showTime true)
                style={{ color: 'var(--color-main)' }}
                className="cursor-pointer"
              >
                ← Cambia orario
              </button>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg mb-8" style={{ background: 'var(--bg-section-warm)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--brand-title)' }}>Riepilogo Appuntamento</h3>
              <p style={{ color: 'var(--color-main)' }}>
                📅 {formatDate(selectedDate)} alle {selectedTime}<br />
                📋 {
                  bookingData.consultationType === 'prima-visita' ? 'Prima Visita (60 min) - €80' :
                    bookingData.consultationType === 'controllo' ? 'Controllo (30 min) - €50' :
                      'Consulenza Online (45 min) - €60'
                }
              </p>
            </div>

            <div className="space-y-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-title)' }}>
                  Nome *
                </label>
                <input
                  type="text"
                  value={bookingData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 rounded-lg focus:ring-2"
                  style={{ border: '1px solid var(--color-main)', color: 'var(--foreground)' }}
                  placeholder="Il tuo nome"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-title)' }}>
                  Cognome *
                </label>
                <input
                  type="text"
                  value={bookingData.surname}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  className="w-full p-3 rounded-lg focus:ring-2"
                  style={{ border: '1px solid var(--color-main)', color: 'var(--foreground)' }}
                  placeholder="Il tuo cognome"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-title)' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 rounded-lg focus:ring-2"
                  style={{ border: '1px solid var(--color-main)', color: 'var(--foreground)' }}
                  placeholder="la-tua@email.com"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-title)' }}>
                  Telefono *
                </label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 rounded-lg focus:ring-2"
                  style={{ border: '1px solid var(--color-main)', color: 'var(--foreground)' }}
                  placeholder="+39 123 456 7890"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--brand-title)' }}>
                  Note aggiuntive
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-lg focus:ring-2"
                  style={{ border: '1px solid var(--color-main)', color: 'var(--foreground)' }}
                  placeholder="Allergie, obiettivi specifici, domande particolari..."
                />
              </div>

              {/* Submit */}
              <div className="text-center pt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={!bookingData.name || !bookingData.surname || !bookingData.email || !bookingData.phone || isSubmitting}
                  variant="sage"
                  size="lg"
                  className="text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Invio in corso...' : 'Conferma Prenotazione'}
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Riceverai una conferma via email entro 24 ore
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PrenotaPage;
