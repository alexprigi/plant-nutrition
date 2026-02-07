'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Button from '@/components/ui/Button';
import { createFullBooking, checkEligibility, AppointmentStatus } from '@/lib/bookingService';
import { COUNTRIES, COUNTRY_PREFIXES } from '@/lib/constants';
import Icon from '@/components/icons/Icon';

// --- CONSTANTS ---

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];

const CONSULTATION_TYPES = [
  {
    value: 'free-consultation',
    title: 'Colloquio Gratuito',
    price: 0,
    labelPrice: 'Gratuito',
    duration: '15 minuti',
    description: 'Conosciamoci! Ti ascolto, capisco i tuoi obiettivi e ti spiego come posso aiutarti.',
    iconName: 'gift',
    iconColor: '#EA580C', iconBg: '#FFF7ED',
    badge: 'SENZA IMPEGNO', badgeColor: 'var(--brand-title)',
    bgStyle: { background: 'linear-gradient(to bottom right, #FEF3C7 0%, #FFFBEB 100%)', borderColor: '#FCD34D' }
  },
  {
    value: 'follow-up',
    title: 'Visita di Controllo',
    price: 50,
    labelPrice: '50€',
    duration: '30 minuti',
    description: 'Monitoraggio progressi, analisi esami o integrazione.',
    iconName: 'refreshCcw',
    iconColor: '#059669', iconBg: '#ECFDF5',
    bgStyle: { background: 'white', borderColor: '#E5E7EB' }
  },
  {
    value: 'first-visit',
    title: 'Prima Visita Completa',
    price: 85,
    labelPrice: '85€',
    duration: '60 min',
    description: 'Anamnesi approfondita, piano nutrizionale su misura, protocollo integratori.',
    iconName: 'star',
    iconColor: '#CA8A04', iconBg: '#FEF9C3',
    badge: 'PER INIZIARE', badgeColor: 'var(--brand-title)',
    bgStyle: { background: 'linear-gradient(to bottom right, #D1FAE5 0%, #ECFDF5 100%)', borderColor: '#34D399' }
  },
  {
    value: 'plan-3-months',
    title: 'Percorso 3 Mesi',
    price: 237,
    labelPrice: '237€',
    duration: '3 visite',
    description: '3 consulenze (1 al mese), analisi diario alimentare, supporto email.',
    iconName: 'route',
    iconColor: '#EA580C', iconBg: '#FFF7ED',
    bgStyle: { background: 'white', borderColor: '#E5E7EB' }
  },
  {
    value: 'plan-6-months',
    title: 'Percorso 6 Mesi VIP',
    price: 450,
    labelPrice: '450€',
    duration: '6 visite + chat',
    description: '6 consulenze, chat WhatsApp diretta, libreria PDF, analisi etichette.',
    iconName: 'sparkles',
    iconColor: '#D97706', iconBg: '#FFFBEB',
    badge: 'RISPARMIA 60€', badgeColor: '#059669',
    bgStyle: { background: 'linear-gradient(to bottom right, #FFF7ED 0%, #FFFBEB 100%)', borderColor: '#FDBA74' }
  },
];

const STEPS = [
  { num: 1, label: 'Servizio' },
  { num: 2, label: 'Dati' },
  { num: 3, label: 'Pagamento' },
  { num: 4, label: 'Calendario' }
];

const PrenotaPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- NAVIGATION STATE ---
  const stepParam = searchParams.get('step');
  const currentStep = stepParam ? parseInt(stepParam) : 1;

  const setStep = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', step.toString());
    router.push(`?${params.toString()}`);
  };

  // --- FORM DATA ---
  const [formData, setFormData] = useState({
    name: '', surname: '', email: '', phone: '', notes: '',
    address: '', civicNumber: '', city: '', zipCode: '', country: 'Italia', fiscalCode: ''
  });
  const [phonePrefix, setPhonePrefix] = useState('+39');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'bank_transfer'>('stripe');

  useEffect(() => {
    setFormData(prev => ({ ...prev, phone: `${phonePrefix} ${phoneNumber}` }));
  }, [phonePrefix, phoneNumber]);

  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [eligibilityError, setEligibilityError] = useState<string>('');

  const activeService = useMemo(() =>
    CONSULTATION_TYPES.find(t => t.value === selectedService),
    [selectedService]);

  // Memoize available time slots based on selected date
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return TIME_SLOTS;
    
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    if (!isToday) return TIME_SLOTS;
    
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    
    return TIME_SLOTS.map(slot => {
      const [hours, minutes] = slot.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      return {
        time: slot,
        available: slotTime >= fourHoursFromNow
      };
    });
  }, [selectedDate]);

  // --- DEV HELPER ---
  const fillRandomData = () => {
    const randomNames = ['Mario', 'Luca', 'Giuseppe', 'Francesco', 'Alessandro', 'Marco', 'Andrea', 'Paolo'];
    const randomSurnames = ['Rossi', 'Bianchi', 'Ferrari', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco'];
    const randomStreets = ['Via Roma', 'Via Milano', 'Corso Italia', 'Via Garibaldi', 'Piazza Duomo', 'Via Venezia'];
    const randomCities = ['Milano', 'Roma', 'Torino', 'Firenze', 'Bologna', 'Napoli', 'Verona'];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomSurname = randomSurnames[Math.floor(Math.random() * randomSurnames.length)];
    
    setFormData({
      name: randomName,
      surname: randomSurname,
      email: `${randomName.toLowerCase()}.${randomSurname.toLowerCase()}@test.com`,
      phone: `+39 ${Math.floor(300 + Math.random() * 90)}${Math.floor(1000000 + Math.random() * 9000000)}`,
      address: randomStreets[Math.floor(Math.random() * randomStreets.length)],
      civicNumber: `${Math.floor(1 + Math.random() * 200)}`,
      city: randomCities[Math.floor(Math.random() * randomCities.length)],
      zipCode: `${Math.floor(10000 + Math.random() * 90000)}`,
      country: 'Italia',
      fiscalCode: `${randomSurname.substring(0, 3).toUpperCase()}${randomName.substring(0, 3).toUpperCase()}${Math.floor(10 + Math.random() * 90)}A01H501Z`,
      notes: formData.notes
    });
    setPhoneNumber(`${Math.floor(300 + Math.random() * 90)}${Math.floor(1000000 + Math.random() * 9000000)}`);
  };

  // --- LOGIC ---
  const nextStep = async () => {
    // 1 -> 2
    if (currentStep === 1) {
      if (selectedService) setStep(2);
    }
    // 2 -> 3
    else if (currentStep === 2) {
      setIsProcessing(true);
      
      // Check eligibility for free consultation BEFORE validation
      if (selectedService === 'free-consultation' && formData.email) {
        const check = checkEligibility(formData.email);
        if (!check.eligible) {
          setEligibilityError('Risulta che hai già usufruito del colloquio gratuito. Per proseguire il tuo percorso, ti invitiamo a prenotare una Visita di Controllo.');
          setIsProcessing(false);
          setStep(1); // Torna allo Step 1 per mostrare l'errore
          return;
        }
      }
      
      try {
        // Call backend validation API
        const response = await fetch('/api/validate-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!result.valid) {
          setErrors(result.errors || {});
          setIsProcessing(false);
          return;
        }

        // Update form data with sanitized values from backend
        if (result.sanitized) {
          setFormData(prev => ({ ...prev, ...result.sanitized }));
        }

        setErrors({});
        setIsProcessing(false);
        setStep(3);
      } catch (error) {
        console.error('Validation error:', error);
        setErrors({ general: 'Errore durante la validazione. Riprova.' });
        setIsProcessing(false);
      }
    }
    // 3 -> 4
    else if (currentStep === 3) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(4);
      }, 500);
    }
  };

  const handleFinalBooking = () => {
    if (!selectedDate || !selectedTime) return;
    setIsProcessing(true);

    // Sanitize notes (trim whitespace, remove HTML tags)
    const sanitizedNotes = formData.notes
      .trim()
      .replace(/<[^>]*>/g, '')
      .substring(0, 500);

    // Status Logic
    let finalStatus: AppointmentStatus = 'pending';
    let finalIsPaid: boolean = false;

    if (activeService?.price === 0) {
      finalStatus = 'confirmed';
      finalIsPaid = true;
    } else if (paymentMethod === 'bank_transfer') {
      finalStatus = 'pending';
      finalIsPaid = false;
    } else {
      finalStatus = 'confirmed';
      finalIsPaid = true;
    }

    createFullBooking({
      name: formData.name, surname: formData.surname, email: formData.email, phone: formData.phone,
      address: formData.address, civicNumber: formData.civicNumber, city: formData.city,
      zipCode: formData.zipCode, country: formData.country, fiscalCode: formData.fiscalCode,

      commercialType: selectedService as any,
      paymentMethod: activeService?.price! > 0 ? paymentMethod : 'none',

      selectedDate, selectedTime, notes: sanitizedNotes,

      status: finalStatus,
      isPaid: finalIsPaid
    });

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    }, 1000);
  };

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

  // Helper to check if date has available time slots
  const hasAvailableSlots = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (date !== today) return true;
    
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    
    return TIME_SLOTS.some(slot => {
      const [hours, minutes] = slot.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      return slotTime >= fourHoursFromNow;
    });
  };

  // --- SUCCESS VIEW ---
  if (isSuccess) {
    const isPaid = activeService?.price && activeService.price > 0 && paymentMethod !== 'bank_transfer';
    const isBankTransfer = activeService?.price! > 0 && paymentMethod === 'bank_transfer';

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F5] px-4 animate-fade-in">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-t-4 border-[var(--brand-title)]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name={isBankTransfer ? "clock" : "check"} size={40} style={{ color: 'var(--brand-title)' }} />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            {isBankTransfer ? 'Richiesta Ricevuta' : 'Tutto Confermato!'}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Grazie <strong>{formData.name}</strong>.<br />
            {isBankTransfer
              ? 'Riceverai una mail con l\'IBAN per il bonifico. L\'appuntamento sarà confermato dopo la ricezione.'
              : isPaid
                ? 'Pagamento ricevuto con successo.'
                : 'Il tuo appuntamento è fissato.'
            }
            <br /><br />
            Data: <span className="font-bold text-gray-800">{new Date(selectedDate).toLocaleDateString('it-IT')}</span><br />
            Ora: <span className="font-bold text-gray-800">{selectedTime}</span>
          </p>
          <Button href="/" className="w-full bg-[var(--brand-title)] text-white">Torna alla Home</Button>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-[#F5F7F5] py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* STEPPER */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              const showLine = index < STEPS.length - 1;

              return (
                <div key={step.num} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 relative z-10
                    ${isActive || isPast
                      ? 'bg-[var(--brand-title)] text-white border-[var(--brand-title)] shadow-lg scale-110'
                      : 'bg-white text-gray-400 border-gray-200'
                    }
                  `}>
                    {step.num}
                  </div>
                  {showLine && (
                    <div className={`w-12 sm:w-20 h-1 -mx-2 rounded transition-colors duration-300 ${isPast ? 'bg-[var(--brand-title)]' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- STEP 1: SERVICE --- */}
        {currentStep === 1 && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Come posso aiutarti?</h1>
            <p className="text-center text-gray-500 mb-8">Scegli il percorso più adatto alle tue esigenze.</p>

            {eligibilityError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Icon name="alert" size={20} className="text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-800 mb-1">Colloquio già utilizzato</h4>
                    <p className="text-sm text-red-700">{eligibilityError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONSULTATION_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => {
                    setSelectedService(type.value);
                    setEligibilityError('');
                  }}
                  className={`
                    p-6 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col group
                    ${type.value === 'first-visit' ? 'md:col-span-2' : ''}
                    ${selectedService === type.value ? 'ring-2 ring-[var(--brand-title)] shadow-lg scale-[1.01]' : 'hover:shadow-md border-transparent hover:-translate-y-1'}
                  `}
                  style={{ background: type.bgStyle.background }}
                >
                  {type.badge && (
                    <span className="absolute top-0 right-0 px-3 py-1.5 bg-[var(--brand-title)] text-white text-[10px] font-bold rounded-bl-xl uppercase tracking-wider">{type.badge}</span>
                  )}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="p-3 bg-white/50 rounded-xl" style={{ color: type.iconColor }}>
                      <Icon name={type.iconName as any} size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-black">{type.title}</h3>
                      <p className="text-sm text-gray-600 leading-snug">{type.description}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between items-end w-full pt-3 border-t border-black/5">
                    <span className="text-xs font-bold text-gray-500 bg-white/50 px-2 py-1 rounded flex items-center gap-1">
                      <Icon name="clock" size={12} /> {type.duration}
                    </span>
                    <span className="text-xl font-bold text-gray-900">{type.labelPrice}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 text-center pb-20">
              <Button onClick={nextStep} disabled={!selectedService || !!eligibilityError} className={`rounded-full px-12 py-3 ${!selectedService || !!eligibilityError ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-[var(--brand-title)] hover:shadow-xl'} text-white`}>
                Continua
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP 2: USER DATA (NO NOTES) --- */}
        {currentStep === 2 && (
          <div className="animate-fade-in max-w-xl mx-auto w-full pb-20">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">I tuoi dati</h2>

              {/* DEV ONLY: Auto-fill button */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-yellow-800">🛠️ DEV MODE</span>
                  <button
                    onClick={fillRandomData}
                    className="px-4 py-2 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Compila Dati Random
                  </button>
                </div>
              )}

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Nome*</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Il tuo nome" />
                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Cognome*</label>
                    <input type="text" value={formData.surname} onChange={e => setFormData({ ...formData, surname: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.surname ? 'border-red-500' : 'border-gray-300'}`} placeholder="Il tuo cognome" />
                    {errors.surname && <p className="text-red-500 text-xs mt-1 ml-1">{errors.surname}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Email*</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="La tua email" />
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Telefono*</label>
                  <div className="flex gap-2">
                    <div className="relative w-32">
                      <select value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)} className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-xl outline-none appearance-none cursor-pointer text-sm pr-8">
                        {COUNTRY_PREFIXES.map(country => (
                          <option key={country.name} value={country.code}>{country.flag} {country.code}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500"><Icon name="chevronRight" size={14} style={{ transform: 'rotate(90deg)' }} /></div>
                    </div>
                    <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className={`flex-1 p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="Numero di telefono" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">Indirizzo e Fatturazione</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Indirizzo*</label>
                        <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.address ? 'border-red-500' : 'border-gray-300'}`} placeholder="Via o Piazza" />
                        {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">N. Civico*</label>
                        <input type="text" value={formData.civicNumber} onChange={e => setFormData({ ...formData, civicNumber: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.civicNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder="Numero" />
                        {errors.civicNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.civicNumber}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">CAP*</label>
                        <input type="text" value={formData.zipCode} onChange={e => setFormData({ ...formData, zipCode: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`} placeholder="Codice postale" />
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.zipCode}</p>}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Città*</label>
                        <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.city ? 'border-red-500' : 'border-gray-300'}`} placeholder="La tua città" />
                        {errors.city && <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Nazione*</label>
                        <select value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-xl outline-none focus:border-[var(--brand-title)] appearance-none">
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Cod. Fiscale*</label>
                        <input type="text" value={formData.fiscalCode} onChange={e => setFormData({ ...formData, fiscalCode: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.fiscalCode ? 'border-red-500' : 'border-gray-300'}`} placeholder="Codice fiscale" />
                        {errors.fiscalCode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fiscalCode}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black text-sm font-medium transition-colors">Indietro</button>
                <Button
                  onClick={nextStep}
                  disabled={isProcessing}
                  className={`rounded-full px-8 transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-[var(--brand-title)] text-white hover:shadow-lg hover:-translate-y-0.5'}`}
                >
                  {isProcessing ? 'Validazione...' : 'Continua'}
                </Button>
              </div>

              {errors.general && (
                <p className="text-red-500 text-sm text-center mt-4">{errors.general}</p>
              )}
            </div>
          </div>
        )}

        {/* --- STEP 3: CONFIRMATION / PAYMENT (NO NOTES) --- */}
        {currentStep === 3 && (
          <div className="animate-fade-in max-w-xl mx-auto w-full pb-20 relative">
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[var(--brand-title)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="font-bold text-gray-700">Elaborazione in corso...</p>
                </div>
              </div>
            )}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">

              {activeService?.price! > 0 ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Checkout Sicuro</h2>
                  <p className="text-center text-gray-500 mb-8">
                    Scegli come preferisci pagare il servizio <strong>{activeService?.title}</strong>.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Riepilogo Prenotazione</h2>
                  <p className="text-center text-gray-500 mb-8">
                    Stai richiedendo il servizio <strong>{activeService?.title}</strong>.
                  </p>
                </>
              )}

              {/* PAYMENT LOGIC (Only if price > 0) */}
              {activeService?.price! > 0 ? (
                <div className="space-y-4 mb-8">
                  {/* Stripe */}
                  <div
                    onClick={() => setPaymentMethod('stripe')}
                    className={`flex items-center justify-between p-5 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-[var(--brand-title)] bg-green-50 ring-1 ring-[var(--brand-title)]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-[var(--brand-title)]' : 'border-gray-300'}`}>
                        {paymentMethod === 'stripe' && <div className="w-3 h-3 rounded-full bg-[var(--brand-title)]" />}
                      </div>
                      <span className="font-bold text-gray-800">Carta di Credito / Debito</span>
                    </div>
                    <div className="flex gap-2 opacity-80">
                      <div className="w-8 h-5 bg-[#1a1f71] rounded flex items-center justify-center text-[5px] text-white">VISA</div>
                      <div className="w-8 h-5 bg-[#eb001b] rounded flex items-center justify-center text-[5px] text-white">MC</div>
                    </div>
                  </div>

                  {/* PayPal */}
                  <div
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex items-center justify-between p-5 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-[#0070ba] bg-blue-50 ring-1 ring-[#0070ba]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-[#0070ba]' : 'border-gray-300'}`}>
                        {paymentMethod === 'paypal' && <div className="w-3 h-3 rounded-full bg-[#0070ba]" />}
                      </div>
                      <span className="font-bold text-gray-800">PayPal</span>
                    </div>
                    <span className="text-xs font-bold text-[#0070ba] tracking-wider">PAYPAL</span>
                  </div>

                  {/* Bonifico */}
                  <div
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`flex items-center justify-between p-5 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-gray-600 bg-gray-50 ring-1 ring-gray-600' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'bank_transfer' ? 'border-gray-600' : 'border-gray-300'}`}>
                        {paymentMethod === 'bank_transfer' && <div className="w-3 h-3 rounded-full bg-gray-600" />}
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">Bonifico Bancario</span>
                        <span className="text-xs text-gray-500">L'ordine sarà confermato dopo la verifica</span>
                      </div>
                    </div>
                    <Icon name="clock" size={20} className="text-gray-400" />
                  </div>
                </div>
              ) : (
                <div className="bg-[var(--brand-title)]/10 p-6 rounded-2xl border border-[var(--brand-title)]/30 text-center mb-8">
                  <Icon name="gift" size={32} className="mx-auto mb-3 text-[var(--brand-title)]" />
                  <h3 className="font-bold text-gray-800 text-lg mb-1">Nessun costo richiesto</h3>
                  <p className="text-sm text-gray-600">
                    Cliccando "Conferma e Scegli Data", accederai al calendario per bloccare il tuo slot gratuito di 15 minuti.
                  </p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-gray-500 hover:text-black text-sm font-medium transition-colors">Indietro</button>
                <Button
                  onClick={nextStep}
                  disabled={isProcessing}
                  className="bg-black text-white rounded-xl px-8 py-3 shadow-lg hover:scale-[1.02] transition-transform font-bold"
                >
                  {isProcessing ? 'Elaborazione...' : (activeService?.price! > 0 ? 'Paga e Prenota' : 'Conferma e Scegli Data')}
                </Button>
              </div>

              {activeService?.price! > 0 && (
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <Icon name="shield" size={12} /> Pagamenti crittografati SSL
                </p>
              )}
            </div>
          </div>
        )}

        {/* --- STEP 4: CALENDAR (NOTES HERE) --- */}
        {currentStep === 4 && (
          <div className="animate-fade-in max-w-4xl mx-auto pb-20">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
              {activeService?.price! > 0 ? 'Scegli la data della Prima Visita' : 'Scegli la data'}
            </h2>

            {(selectedService === 'plan-3-months' || selectedService === 'plan-6-months') ? (
              <p className="text-center text-blue-600 font-medium mb-8 max-w-lg mx-auto bg-blue-50 p-3 rounded-lg border border-blue-100">
                📅 Seleziona ora la data per il <strong>primo incontro</strong>. <br />
                Le visite successive le pianificheremo comodamente insieme.
              </p>
            ) : (
              <p className="text-center text-gray-500 mb-8 max-w-lg mx-auto">
                Scegli il momento migliore per la nostra chiacchierata.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* CALENDAR UI */}
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
                <div className="flex justify-between mb-6 items-center">
                  <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.setMonth(currentMonthDate.getMonth() - 1)))} className="hover:bg-gray-100 p-2 rounded-full text-gray-600 transition-colors"><Icon name="chevronLeft" /></button>
                  <span className="font-bold capitalize text-lg text-gray-900">{currentMonthDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.setMonth(currentMonthDate.getMonth() + 1)))} className="hover:bg-gray-100 p-2 rounded-full text-gray-600 transition-colors"><Icon name="chevronRight" /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, i) => <span key={i} className="text-xs font-bold text-gray-400">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((d, i) => {
                    if (!d) return <div key={i} />;
                    const isSel = d === selectedDate;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPast = new Date(d) < today;
                    const noSlots = !hasAvailableSlots(d);
                    const isDisabled = isPast || noSlots;
                    return (
                      <button 
                        key={d} 
                        onClick={() => !isDisabled && setSelectedDate(d)} 
                        disabled={isDisabled}
                        className={`
                            w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all font-medium
                            ${isDisabled
                          ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                          : isSel
                          ? 'bg-[var(--brand-title)] text-white font-bold shadow-md transform scale-110'
                          : 'text-gray-700 hover:bg-gray-100'}
                          `}>
                        {new Date(d).getDate()}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <button onClick={() => setStep(3)} className="text-gray-500 hover:text-black text-sm font-medium transition-colors">Indietro</button>
                </div>
              </div>

              {/* SLOTS UI */}
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-4 text-center">Orari disponibili</h3>
                <div className="grid grid-cols-3 gap-3 mb-auto max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {availableTimeSlots.map(slot => {
                    const isAvailable = typeof slot === 'string' ? true : slot.available;
                    const timeValue = typeof slot === 'string' ? slot : slot.time;
                    
                    return (
                      <button 
                        key={timeValue} 
                        onClick={() => isAvailable && setSelectedTime(timeValue)} 
                        disabled={!isAvailable}
                        className={`
                          py-2 rounded-lg text-sm border transition-all font-medium
                          ${!isAvailable
                            ? 'text-gray-300 border-gray-100 cursor-not-allowed bg-gray-50'
                            : selectedTime === timeValue
                            ? 'bg-[var(--brand-title)] text-white border-[var(--brand-title)] shadow-md'
                            : 'text-gray-600 border-gray-200 hover:border-[var(--brand-title)] hover:text-[var(--brand-title)]'}
                        `}>
                        {timeValue}
                      </button>
                    );
                  })}
                </div>

                {/* NOTE FIELD IN STEP 4 */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700">
                      Messaggio per Arianna (opzionale)
                    </label>
                    <span className={`text-xs ${formData.notes.length > 500 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                      {formData.notes.length}/500
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    maxLength={500}
                    className={`w-full p-3 bg-gray-50 border rounded-xl text-sm outline-none focus:border-[var(--brand-title)] resize-none ${formData.notes.length > 500 ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Intolleranze, ritardi, domande..."
                  />
                </div>

                <div className="mt-6 pt-2">
                  <Button
                    onClick={handleFinalBooking}
                    disabled={!selectedDate || !selectedTime || isProcessing}
                    className={`w-full rounded-xl py-3 text-white font-bold shadow-lg transition-all ${!selectedDate || !selectedTime
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[var(--brand-title)] hover:-translate-y-1 hover:shadow-xl'
                      }`}
                  >
                    {isProcessing ? 'Conferma in corso...' : 'Conferma Appuntamento'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PrenotaPage;