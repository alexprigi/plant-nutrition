'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';

import Button from '@/components/ui/Button';
import { createFullBooking, checkEligibility, AppointmentStatus } from '@/lib/bookingService';
import { COUNTRIES, COUNTRY_FLAGS, COUNTRY_PREFIXES } from '@/lib/constants';
import Icon from '@/components/icons/Icon';

// --- CONSTANTS ---

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];

const PrenotaPageContent = () => {
  const t = useTranslations('prenota');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const CONSULTATION_TYPES = useMemo(() => [
    {
      value: 'free-consultation',
      title: t('servizi.colloquio-gratuito-titolo'),
      price: 0,
      labelPrice: t('servizi.colloquio-gratuito-prezzo'),
      durationMinutes: 15,
      duration: t('servizi.colloquio-gratuito-durata'),
      description: t('servizi.colloquio-gratuito-desc'),
      iconName: 'gift',
      iconColor: '#EA580C', iconBg: '#FFF7ED',
      badge: t('servizi.colloquio-gratuito-badge'), badgeColor: 'var(--brand-title)',
      bgStyle: { background: 'linear-gradient(to bottom right, #FEF3C7 0%, #FFFBEB 100%)', borderColor: '#FCD34D' }
    },
    {
      value: 'follow-up',
      title: t('servizi.controllo-titolo'),
      price: 50,
      labelPrice: '50€',
      durationMinutes: 30,
      duration: t('servizi.controllo-durata'),
      description: t('servizi.controllo-desc'),
      iconName: 'refreshCcw',
      iconColor: '#059669', iconBg: '#ECFDF5',
      bgStyle: { background: 'white', borderColor: '#E5E7EB' }
    },
    {
      value: 'first-visit',
      title: t('servizi.prima-visita-titolo'),
      price: 85,
      labelPrice: '85€',
      durationMinutes: 60,
      duration: t('servizi.prima-visita-durata'),
      description: t('servizi.prima-visita-desc'),
      iconName: 'star',
      iconColor: '#CA8A04', iconBg: '#FEF9C3',
      badge: t('servizi.prima-visita-badge'), badgeColor: 'var(--brand-title)',
      bgStyle: { background: 'linear-gradient(to bottom right, #D1FAE5 0%, #ECFDF5 100%)', borderColor: '#34D399' }
    },
    {
      value: 'plan-3-months',
      title: t('servizi.tre-mesi-titolo'),
      price: 237,
      labelPrice: '237€',
      durationMinutes: 60,
      duration: t('servizi.tre-mesi-durata'),
      description: t('servizi.tre-mesi-desc'),
      iconName: 'route',
      iconColor: '#EA580C', iconBg: '#FFF7ED',
      bgStyle: { background: 'white', borderColor: '#E5E7EB' }
    },
    {
      value: 'plan-6-months',
      title: t('servizi.sei-mesi-titolo'),
      price: 450,
      labelPrice: '450€',
      durationMinutes: 60,
      duration: t('servizi.sei-mesi-durata'),
      description: t('servizi.sei-mesi-desc'),
      iconName: 'sparkles',
      iconColor: '#D97706', iconBg: '#FFFBEB',
      badge: t('servizi.sei-mesi-badge'), badgeColor: '#059669',
      bgStyle: { background: 'linear-gradient(to bottom right, #FFF7ED 0%, #FFFBEB 100%)', borderColor: '#FDBA74' }
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [locale]);

  const STEPS = [
    { num: 1, label: t('step1-label') },
    { num: 2, label: t('step2-label') },
    { num: 3, label: t('step3-label') },
    { num: 4, label: t('step4-label') },
  ];

  // Hide footer on mobile for this page
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'prenota-page-styles';
    style.textContent = '@media (max-width: 768px) { footer { display: none !important; } }';
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('prenota-page-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

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
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);

  useEffect(() => {
    setFormData(prev => ({ ...prev, phone: `${phonePrefix} ${phoneNumber}` }));
  }, [phonePrefix, phoneNumber]);

  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const hasRemainingDays = now.getDate() < daysInMonth;
    if (!hasRemainingDays) {
      return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    return now;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [eligibilityError, setEligibilityError] = useState<string>('');

  const activeService = useMemo(() =>
    CONSULTATION_TYPES.find(s => s.value === selectedService),
    [selectedService, CONSULTATION_TYPES]);

  const [openWeekendDates, setOpenWeekendDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const pad = (n: number) => String(n).padStart(2, '0');
    const from = `${year}-${pad(month + 1)}-01`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const to = `${year}-${pad(month + 1)}-${pad(daysInMonth)}`;
    fetch(`/api/admin/availability?from=${from}&to=${to}`)
      .then(r => r.json())
      .then((blocks: { date: string; type: string }[]) => {
        if (!Array.isArray(blocks)) return;
        setOpenWeekendDates(new Set(blocks.filter(b => b.type === 'OPEN').map(b => b.date)));
      })
      .catch(() => {});
  }, [currentMonthDate]);

  const isBankTransferAvailable = useMemo(() => {
    if (!selectedDate) return true;
    const apptDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((apptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 5;
  }, [selectedDate]);

  // Redirect protection: prevent direct access to steps without completing previous ones
  useEffect(() => {
    if (currentStep > 1 && !selectedService) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('step', '1');
      router.replace(`?${params.toString()}`);
    }
    if (currentStep > 3 && (!selectedDate || !selectedTime)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('step', '3');
      router.replace(`?${params.toString()}`);
    }
  }, [currentStep, selectedService, selectedDate, selectedTime, router, searchParams]);

  useEffect(() => {
    if (!isBankTransferAvailable && paymentMethod === 'bank_transfer') {
      setPaymentMethod('stripe');
    }
  }, [isBankTransferAvailable, paymentMethod]);

  const [slotAvailability, setSlotAvailability] = useState<Record<string, boolean>>({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;
    setIsLoadingSlots(true);
    const duration = activeService?.durationMinutes ?? 30;
    fetch(`/api/bookings?date=${selectedDate}&duration=${duration}`)
      .then(r => r.json())
      .then(data => {
        if (!data.slots) return;
        const map: Record<string, boolean> = {};
        data.slots.forEach((s: { time: string; available: boolean }) => {
          map[s.time] = s.available;
        });
        setSlotAvailability(map);
      })
      .catch(() => {})
      .finally(() => setIsLoadingSlots(false));
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
    setGdprAccepted(true);
    setPolicyAccepted(true);
  };

  // --- LOGIC ---
  const nextStep = async () => {
    if (currentStep === 1) {
      if (selectedService) setStep(2);
    } else if (currentStep === 2) {
      setIsProcessing(true);

      if (selectedService === 'free-consultation' && formData.email) {
        const check = await checkEligibility(formData.email);
        if (!check.eligible) {
          setEligibilityError(t('step1.colloquio-gia-usato-testo'));
          setIsProcessing(false);
          setStep(1);
          return;
        }
      }

      try {
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

        if (result.sanitized) {
          setFormData(prev => ({ ...prev, ...result.sanitized }));
        }

        setErrors({});
        setIsProcessing(false);
        setStep(3);
      } catch (error) {
        console.error('Validation error:', error);
        setErrors({ general: t('step2.errore-validazione') });
        setIsProcessing(false);
      }
    } else if (currentStep === 3) {
      if (selectedDate && selectedTime) setStep(4);
    }
  };

  const handleFinalBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsProcessing(true);

    const sanitizedNotes = formData.notes
      .trim()
      .replace(/<[^>]*>/g, '')
      .substring(0, 500);

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

    let managementToken: string | undefined;

    try {
      const result = await createFullBooking({
        name: formData.name, surname: formData.surname, email: formData.email, phone: formData.phone,
        address: formData.address, civicNumber: formData.civicNumber, city: formData.city,
        zipCode: formData.zipCode, country: formData.country, fiscalCode: formData.fiscalCode,

        commercialType: selectedService as any,
        paymentMethod: activeService?.price! > 0 ? paymentMethod : 'none',

        selectedDate, selectedTime, notes: sanitizedNotes,

        status: finalStatus,
        isPaid: finalIsPaid,
      });
      managementToken = result?.appointment?.managementToken;
    } catch (error) {
      console.error('Booking error:', error);
      setIsProcessing(false);
      return;
    }

    fetch('/api/send-booking-emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: `${formData.name} ${formData.surname}`,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        serviceName: activeService?.title || '',
        price: activeService?.price || 0,
        date: selectedDate,
        time: selectedTime,
        notes: sanitizedNotes,
        paymentMethod: activeService?.price! > 0 ? paymentMethod : 'none',
        isPaid: finalIsPaid,
        managementToken,
        durationMinutes: activeService?.durationMinutes ?? 60,
      })
    }).catch(error => {
      console.error('Failed to send emails:', error);
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
    for (let i = 1; i <= daysInMonth; i++) {
      const pad = (n: number) => String(n).padStart(2, '0');
      days.push(`${year}-${pad(month + 1)}-${pad(i)}`);
    }
    return days;
  }, [currentMonthDate]);

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

  const calendarDayLabels = t.raw('step3.giorni') as string[];

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
            {isBankTransfer ? t('successo.titolo-bonifico') : t('successo.titolo-confermato')}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t('successo.grazie', { nome: formData.name })}<br />
            {isBankTransfer
              ? t('successo.testo-bonifico')
              : isPaid
                ? t('successo.testo-pagato')
                : t('successo.testo-fissato')
            }
            <br /><br />
            {t('successo.data')} <span className="font-bold text-gray-800">{new Date(selectedDate).toLocaleDateString(locale)}</span><br />
            {t('successo.ora')} <span className="font-bold text-gray-800">{selectedTime}</span>
          </p>
          {isBankTransfer && (
            <div className="text-left bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm">
              <p className="font-semibold text-amber-800 mb-2">{t('successo.bonifico-titolo')}</p>
              <p className="text-amber-700">{t('successo.bonifico-beneficiario')} <strong>Arianna Ciervo</strong></p>
              <p className="text-amber-700">IBAN: <span className="font-mono font-semibold">DE14 1001 1001 2175 0735 33</span></p>
              <p className="text-amber-700">{t('successo.bonifico-importo')} <strong>{activeService?.price}€</strong></p>
              <p className="text-amber-700">{t('successo.bonifico-causale')} <strong>{activeService?.title} - {formData.name} {formData.surname}</strong></p>
              <p className="text-amber-700 mt-2 text-xs">{t('successo.bonifico-scadenza')}</p>
            </div>
          )}
          <Button href="/" className="w-full bg-[var(--brand-title)] text-white">{t('successo.torna-home')}</Button>
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
                    <div className={`w-16 sm:w-24 md:w-28 h-1 -mx-2 rounded transition-colors duration-300 ${isPast ? 'bg-[var(--brand-title)]' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- STEP 1: SERVICE --- */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">{t('step1.titolo')}</h1>
              <p className="text-center text-gray-500 mb-8">{t('step1.sottotitolo')}</p>

              {eligibilityError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Icon name="alert" size={20} className="text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-800 mb-1">{t('step1.colloquio-gia-usato-titolo')}</h4>
                      <p className="text-sm text-red-700">{eligibilityError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-28 md:mb-8">
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
            </div>

            {/* Sticky Bottom Bar - Mobile */}
            <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 z-50">
              <div className="max-w-4xl mx-auto text-center">
                <Button onClick={nextStep} disabled={!selectedService || !!eligibilityError} className={`w-full rounded-full px-12 py-4 text-base font-bold ${!selectedService || !!eligibilityError ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-[var(--brand-title)] hover:shadow-xl'} text-white transition-all`}>
                  {t('step1.continua')}
                </Button>
              </div>
            </div>

            {/* Desktop Button */}
            <div className="hidden md:block text-center mt-8">
              <Button onClick={nextStep} disabled={!selectedService || !!eligibilityError} className={`rounded-full px-12 py-3 ${!selectedService || !!eligibilityError ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-[var(--brand-title)] hover:shadow-xl'} text-white`}>
                {t('step1.continua')}
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP 2: USER DATA --- */}
        {currentStep === 2 && (
          <>
          <div className="max-w-xl mx-auto w-full">
            <div className="animate-fade-in pb-28 md:pb-20">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">{t('step2.titolo')}</h2>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">{t('step2.nome-label')}</label>
                    <input type="text" name="given-name" autoComplete="given-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('step2.nome-placeholder')} />
                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">{t('step2.cognome-label')}</label>
                    <input type="text" name="family-name" autoComplete="family-name" value={formData.surname} onChange={e => setFormData({ ...formData, surname: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.surname ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('step2.cognome-placeholder')} />
                    {errors.surname && <p className="text-red-500 text-xs mt-1 ml-1">{errors.surname}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">{t('step2.email-label')}</label>
                  <input type="email" name="email" autoComplete="email" inputMode="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('step2.email-placeholder')} />
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">{t('step2.telefono-label')}</label>
                  <div className="flex items-center gap-2">
                    <div className="relative shrink-0">
                      <select value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)} className={`h-[50px] px-3 pr-8 bg-white text-gray-900 border rounded-xl outline-none appearance-none cursor-pointer text-sm min-w-[5.5rem] w-auto ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}>
                        {COUNTRY_PREFIXES.map(country => (
                          <option key={country.name} value={country.code}>{country.flag} {country.code}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500"><Icon name="chevronRight" size={14} style={{ transform: 'rotate(90deg)' }} /></div>
                    </div>
                    <input type="tel" name="tel-national" autoComplete="tel-national" inputMode="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/[^0-9+\s\-().]/g, ''))} className={`flex-1 min-w-0 h-[50px] px-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('step2.telefono-placeholder')} />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">{t('step2.fatturazione-titolo')}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">{t('step2.indirizzo-label')}</label>
                        <input type="text" name="street-address" autoComplete="street-address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.address ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('step2.indirizzo-placeholder')} />
                        {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">{t('step2.civico-label')}</label>
                        <input type="text" name="address-line2" autoComplete="address-line2" inputMode="text" value={formData.civicNumber} onChange={e => setFormData({ ...formData, civicNumber: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.civicNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('step2.civico-placeholder')} />
                        {errors.civicNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.civicNumber}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">{t('step2.cap-label')}</label>
                        <input type="text" name="postal-code" autoComplete="postal-code" inputMode="numeric" value={formData.zipCode} onChange={e => setFormData({ ...formData, zipCode: e.target.value.replace(/\D/g, '') })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('step2.cap-placeholder')} />
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.zipCode}</p>}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">{t('step2.citta-label')}</label>
                        <input type="text" name="address-level2" autoComplete="address-level2" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.city ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('step2.citta-placeholder')} />
                        {errors.city && <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">{t('step2.nazione-label')}</label>
                        <div className="relative">
                          <select value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full p-3 pr-8 bg-white text-gray-900 border border-gray-300 rounded-xl outline-none focus:border-[var(--brand-title)] appearance-none cursor-pointer">
                            {COUNTRIES.map(c => <option key={c} value={c}>{COUNTRY_FLAGS[c] ? `${COUNTRY_FLAGS[c]} ${c}` : c}</option>)}
                          </select>
                          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500"><Icon name="chevronRight" size={14} style={{ transform: 'rotate(90deg)' }} /></div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">{t('step2.cf-label')}</label>
                        <input type="text" name="fiscal-code" autoComplete="off" autoCapitalize="characters" value={formData.fiscalCode} onChange={e => setFormData({ ...formData, fiscalCode: e.target.value.toUpperCase() })} className={`w-full p-3 bg-white text-gray-900 border rounded-xl outline-none focus:border-[var(--brand-title)] ${errors.fiscalCode ? 'border-red-500' : 'border-gray-300'}`} placeholder={t('step2.cf-placeholder')} />
                        {errors.fiscalCode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fiscalCode}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {errors.general && (
                  <p className="text-red-500 text-sm text-center mt-4">{errors.general}</p>
                )}

                {/* GDPR checkbox */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gdprAccepted}
                      onChange={e => setGdprAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-[var(--brand-title)] shrink-0 cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      {t('step2.gdpr-testo')}{' '}
                      <a href="/privacy-policy" target="_blank" className="underline font-medium" style={{ color: 'var(--brand-title)' }}>
                        {t('step2.gdpr-link')}
                      </a>
                      {t('step2.gdpr-consenso')}
                    </span>
                  </label>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex justify-between mt-6 pt-4 border-t border-gray-100">
                  <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black text-sm font-medium transition-colors">{t('step2.indietro')}</button>
                  <Button
                    onClick={nextStep}
                    disabled={isProcessing || !gdprAccepted}
                    className={`rounded-full px-8 py-3 transition-all ${isProcessing || !gdprAccepted ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-[var(--brand-title)] text-white hover:shadow-lg hover:-translate-y-0.5'}`}
                  >
                    {isProcessing ? t('step2.validazione') : t('step2.continua')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sticky Bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 z-50">
            <div className="max-w-xl mx-auto flex justify-between items-center gap-4">
              <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black text-sm font-medium transition-colors px-4 py-3">{t('step2.indietro')}</button>
              <Button
                onClick={nextStep}
                disabled={isProcessing || !gdprAccepted}
                className={`flex-1 rounded-full px-8 py-4 text-base font-bold transition-all ${isProcessing || !gdprAccepted ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'bg-[var(--brand-title)] text-white hover:shadow-lg hover:-translate-y-0.5'}`}
              >
                {isProcessing ? t('step2.validazione') : t('step2.continua')}
              </Button>
            </div>
          </div>
          </>
        )}

        {/* --- STEP 3: CALENDAR + NOTES --- */}
        {currentStep === 3 && (
          <>
          <div className="animate-fade-in max-w-4xl mx-auto pb-28 md:pb-20">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
              {activeService?.price! > 0 ? t('step3.titolo-pagamento') : t('step3.titolo-gratuito')}
            </h2>

            {(selectedService === 'plan-3-months' || selectedService === 'plan-6-months') ? (
              <p className="text-center text-blue-600 font-medium mb-8 max-w-lg mx-auto bg-blue-50 p-3 rounded-lg border border-blue-100">
                📅 {t('step3.nota-percorso')}
              </p>
            ) : (
              <p className="text-center text-gray-500 mb-8 max-w-lg mx-auto">
                {t('step3.nota-chiacchierata')}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* CALENDAR UI */}
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
                <div className="flex justify-between mb-6 items-center">
                  <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.setMonth(currentMonthDate.getMonth() - 1)))} className="hover:bg-gray-100 p-2 rounded-full text-gray-600 transition-colors"><Icon name="chevronLeft" /></button>
                  <span className="font-bold capitalize text-lg text-gray-900">{currentMonthDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.setMonth(currentMonthDate.getMonth() + 1)))} className="hover:bg-gray-100 p-2 rounded-full text-gray-600 transition-colors"><Icon name="chevronRight" /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {calendarDayLabels.map((d, i) => <span key={i} className="text-xs font-bold text-gray-400">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((d, i) => {
                    if (!d) return <div key={i} />;
                    const isSel = d === selectedDate;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPast = new Date(d) < today;
                    const isWeekend = (new Date(d).getDay() === 0 || new Date(d).getDay() === 6) && !openWeekendDates.has(d);
                    const noSlots = !hasAvailableSlots(d);
                    const isDisabled = isPast || noSlots || isWeekend;
                    return (
                      <button
                        key={d}
                        onClick={() => !isDisabled && setSelectedDate(d)}
                        disabled={isDisabled}
                        className={`
                            w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm transition-all font-medium
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
                  <button onClick={() => setStep(2)} className="hidden md:block text-gray-500 hover:text-black text-sm font-medium transition-colors">{t('step3.indietro')}</button>
                </div>
              </div>

              {/* SLOTS UI */}
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-4 text-center">{t('step3.orari-disponibili')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-auto max-h-80 overflow-y-auto pr-2 custom-scrollbar">
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

                {/* NOTE FIELD */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700">
                      {t('step3.messaggio-label')}
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
                    placeholder={t('step3.messaggio-placeholder')}
                  />
                </div>

                <div className="hidden md:block mt-6 pt-2">
                  <Button
                    onClick={nextStep}
                    disabled={!selectedDate || !selectedTime}
                    className={`w-full rounded-xl py-3 text-white font-bold shadow-lg transition-all ${!selectedDate || !selectedTime
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[var(--brand-title)] hover:-translate-y-1 hover:shadow-xl'
                      }`}
                  >
                    {activeService?.price! > 0 ? t('step3.continua-pagamento') : t('step3.conferma')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sticky Bar - step 3 */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 z-50">
            <div className="max-w-xl mx-auto flex justify-between items-center gap-4">
              <button onClick={() => setStep(2)} className="text-gray-500 hover:text-black text-sm font-medium transition-colors px-4 py-3">{t('step3.indietro')}</button>
              <Button
                onClick={nextStep}
                disabled={!selectedDate || !selectedTime}
                className={`flex-1 rounded-full px-6 py-3 text-sm font-bold transition-all ${!selectedDate || !selectedTime
                    ? 'opacity-50 cursor-not-allowed bg-gray-300'
                    : 'bg-[var(--brand-title)] text-white hover:shadow-lg hover:-translate-y-0.5'
                  }`}
              >
                {activeService?.price! > 0 ? t('step3.continua-pagamento') : t('step3.conferma')}
              </Button>
            </div>
          </div>
          </>
        )}

        {/* --- STEP 4: PAYMENT --- */}
        {currentStep === 4 && (
          <>
          <div className="max-w-xl mx-auto w-full">
            <div className="animate-fade-in pb-28 md:pb-20 relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--brand-title)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="font-bold text-gray-700">{t('elaborazione')}</p>
                  </div>
                </div>
              )}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">

              {activeService?.price! > 0 ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">{t('step4.titolo-pagamento')}</h2>
                  <p className="text-center text-gray-500 mb-8">
                    {t('step4.sottotitolo-pagamento', { servizio: activeService?.title })}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">{t('step4.titolo-gratuito')}</h2>
                  <p className="text-center text-gray-500 mb-8">
                    {t('step4.sottotitolo-gratuito', { servizio: activeService?.title })}
                  </p>
                </>
              )}

              {/* PAYMENT OPTIONS */}
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
                      <span className="font-bold text-gray-800">{t('step4.carta-label')}</span>
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
                      <span className="font-bold text-gray-800">{t('step4.paypal-label')}</span>
                    </div>
                    <span className="text-xs font-bold text-[#0070ba] tracking-wider">PAYPAL</span>
                  </div>

                  {/* Bonifico */}
                  <div
                    onClick={() => isBankTransferAvailable && setPaymentMethod('bank_transfer')}
                    className={`flex items-center justify-between p-5 border rounded-2xl transition-all ${
                      !isBankTransferAvailable
                        ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50'
                        : paymentMethod === 'bank_transfer'
                        ? 'border-gray-600 bg-gray-50 ring-1 ring-gray-600 cursor-pointer'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'bank_transfer' && isBankTransferAvailable ? 'border-gray-600' : 'border-gray-300'}`}>
                        {paymentMethod === 'bank_transfer' && isBankTransferAvailable && <div className="w-3 h-3 rounded-full bg-gray-600" />}
                      </div>
                      <div>
                        <span className={`font-bold block ${!isBankTransferAvailable ? 'text-gray-400' : 'text-gray-800'}`}>{t('step4.bonifico-label')}</span>
                        <span className="text-xs text-gray-500">
                          {isBankTransferAvailable
                            ? t('step4.bonifico-info')
                            : t('step4.bonifico-non-disponibile')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[var(--brand-title)]/10 p-6 rounded-2xl border border-[var(--brand-title)]/30 text-center mb-8">
                  <Icon name="gift" size={32} className="mx-auto mb-3 text-[var(--brand-title)]" />
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{t('step4.gratuito-titolo')}</h3>
                  <p className="text-sm text-gray-600">
                    {t('step4.gratuito-testo')}
                  </p>
                </div>
              )}

              {activeService?.price! > 0 && (
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <Icon name="shield" size={12} /> {t('step4.ssl-testo')}
                </p>
              )}

              {/* Policy checkbox */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policyAccepted}
                    onChange={e => setPolicyAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-[var(--brand-title)] shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    {activeService?.price! > 0 ? (
                      <>
                        {t('step4.policy-pagamento')}{' '}
                        <a href="/cancellation-policy" target="_blank" className="underline font-medium" style={{ color: 'var(--brand-title)' }}>
                          {t('step4.policy-link')}
                        </a>
                        {t('step4.policy-testo')}
                      </>
                    ) : (
                      <>
                        {t('step4.termini-testo')}{' '}
                        <a href="/cancellation-policy" target="_blank" className="underline font-medium" style={{ color: 'var(--brand-title)' }}>
                          {t('step4.termini-link')}
                        </a>
                        {t('step4.termini-nota')}
                      </>
                    )}
                  </span>
                </label>
              </div>

              {/* Desktop Buttons */}
              <div className="hidden md:flex justify-between mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => setStep(3)} className="text-gray-500 hover:text-black text-sm font-medium transition-colors">{t('step4.indietro')}</button>
                <Button
                  onClick={handleFinalBooking}
                  disabled={isProcessing || !policyAccepted}
                  className={`rounded-xl px-8 py-3 shadow-lg transition-transform font-bold text-sm ${isProcessing || !policyAccepted ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-[var(--brand-title)] text-white hover:scale-[1.02]'}`}
                >
                  {isProcessing
                    ? t('step4.elaborazione')
                    : activeService?.price! > 0
                      ? (paymentMethod === 'bank_transfer' ? t('step4.prenota-bonifico') : t('step4.paga-prenota'))
                      : t('step4.conferma')}
                </Button>
              </div>
            </div>
          </div>
          </div>

          {/* Mobile Sticky Bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 z-50">
            <div className="max-w-xl mx-auto flex justify-between items-center gap-4">
              <button onClick={() => setStep(3)} className="text-gray-500 hover:text-black text-sm font-medium transition-colors px-4 py-3">{t('step4.indietro')}</button>
              <Button
                onClick={handleFinalBooking}
                disabled={isProcessing || !policyAccepted}
                className={`flex-1 rounded-xl px-6 py-4 shadow-lg transition-transform font-bold text-base ${isProcessing || !policyAccepted ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-[var(--brand-title)] text-white hover:scale-[1.02]'}`}
              >
                {isProcessing
                  ? t('step4.elaborazione')
                  : activeService?.price! > 0
                    ? (paymentMethod === 'bank_transfer' ? t('step4.prenota-bonifico') : t('step4.paga-prenota'))
                    : t('step4.conferma')}
              </Button>
            </div>
          </div>
          </>
        )}

      </div>
    </div>
  );
};

const PrenotaPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F7F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--brand-title)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <PrenotaPageContent />
    </Suspense>
  );
};

export default PrenotaPage;
