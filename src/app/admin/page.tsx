'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Icon from '@/components/icons/Icon';
import {
  getAdminAppointments,
  updateAppointmentStatus,
  markSubscriptionAsPaid,
  rescheduleAppointment,
  resendFollowUpLink,
  AdminAppointmentView
} from '@/lib/bookingService';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
];

type FilterTab = 'upcoming' | 'pending' | 'completed' | 'cancelled' | 'all' | 'bundles';

type BundleView = {
  clientEmail: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  subscriptionType: string;
  subscriptionId: string;
  totalSessions: number;
  usedSessions: number;
  sessionsRemaining: number;
  isPaid: boolean;
  paymentMethod: string;
  price: number;
  expiresAt: string | null;
  subscriptionCreatedAt: string;
  followUpToken: string | null;
  lastApptId: string;
  lastApptDate: string | null;
  nextApptDate: string | null;
  completedDates: string[];
  hasFollowUpPending: boolean;
  clientAddress: string;
  clientFiscalCode: string;
  clientCreatedAt: string;
};

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AdminAppointmentView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('upcoming');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showCompletedBundles, setShowCompletedBundles] = useState(false);
  const [sortOrder, setSortOrder] = useState<'date-asc' | 'date-desc' | 'name-asc' | 'expiry-asc' | 'next-asc'>('date-asc');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const toggleExpand = (id: string) => setExpandedCards(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  // Reschedule modal state
  const [rescheduleModal, setRescheduleModal] = useState<{ apptId: string; clientName: string } | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);

  const isBundle = (type: string) => type === 'BUNDLE_3_MONTHS' || type === 'BUNDLE_6_MONTHS';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      loadData();
    }
  }, [status, router]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, '0')}-${String(tomorrowDate.getDate()).padStart(2, '0')}`;

  const filtered = useMemo(() => {
    let list = [...appointments];

    // Ricerca per nome/email/telefono
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.clientName.toLowerCase().includes(q) ||
        a.clientEmail.toLowerCase().includes(q) ||
        a.clientPhone.toLowerCase().includes(q)
      );
    }

    // Filtro per giorno
    if (dateFilter) {
      list = list.filter(a => a.date === dateFilter);
    }

    switch (activeFilter) {
      case 'upcoming':
        list = list.filter(a => (a.status === 'confirmed' || a.status === 'pending') && a.date >= today);
        break;
      case 'pending':
        list = list.filter(a => a.status === 'pending');
        break;
      case 'completed':
        list = list.filter(a => a.status === 'completed');
        break;
      case 'cancelled':
        list = list.filter(a => a.status === 'cancelled');
        break;
    }

    // Sort globale
    const lastName = (name: string) => name.split(' ').slice(-1)[0];
    if (sortOrder === 'name-asc') {
      list.sort((a, b) => lastName(a.clientName).localeCompare(lastName(b.clientName)));
    } else if (sortOrder === 'date-desc') {
      list.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
    } else {
      // date-asc default
      list.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    }

    return list;
  }, [appointments, activeFilter, search, dateFilter, today, sortOrder]);

  // Vista percorsi raggruppata per cliente
  const bundles = useMemo<BundleView[]>(() => {
    const bundleAppts = appointments.filter(a => isBundle(a.subscriptionType) && a.isPaid && a.subscriptionStatus === 'active');
    const grouped = new Map<string, AdminAppointmentView[]>();
    bundleAppts.forEach(a => {
      const key = `${a.clientEmail}__${a.subscriptionId}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(a);
    });

    const result = Array.from(grouped.entries()).map(([, appts]) => {
      const sorted = [...appts].sort((a, b) => b.date.localeCompare(a.date));
      const first = sorted[0];
      const completed = appts.filter(a => a.status === 'completed');
      const upcoming = appts.filter(a => (a.status === 'confirmed' || a.status === 'pending') && a.date >= today);
      const lastAppt = completed.sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
      const nextAppt = upcoming.sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;
      const sessionsRemaining = first.totalSessions - first.usedSessions;
      const hasFollowUpPending = sessionsRemaining > 0 && !nextAppt;
      const completedDates = completed
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(a => a.date);

      return {
        clientEmail: first.clientEmail,
        clientName: first.clientName,
        clientPhone: first.clientPhone,
        serviceName: first.serviceName,
        subscriptionType: first.subscriptionType,
        subscriptionId: first.subscriptionId,
        totalSessions: first.totalSessions,
        usedSessions: first.usedSessions,
        sessionsRemaining,
        isPaid: first.isPaid,
        paymentMethod: first.paymentMethod,
        price: first.price,
        expiresAt: first.expiresAt,
        subscriptionCreatedAt: first.subscriptionCreatedAt,
        followUpToken: first.followUpToken,
        lastApptId: lastAppt?.id ?? first.id,
        lastApptDate: lastAppt?.date ?? null,
        nextApptDate: nextAppt?.date ?? null,
        completedDates,
        hasFollowUpPending,
        clientAddress: first.clientAddress,
        clientFiscalCode: first.clientFiscalCode,
        clientCreatedAt: first.clientCreatedAt,
      };
    });

    return result.sort((a, b) => {
      if (sortOrder === 'expiry-asc') {
        if (!a.expiresAt && !b.expiresAt) return 0;
        if (!a.expiresAt) return 1;
        if (!b.expiresAt) return -1;
        return a.expiresAt.localeCompare(b.expiresAt);
      }
      const lastName = (name: string) => name.split(' ').slice(-1)[0];
      if (sortOrder === 'name-asc') return lastName(a.clientName).localeCompare(lastName(b.clientName));
      if (sortOrder === 'next-asc') {
        if (!a.nextApptDate && !b.nextApptDate) return lastName(a.clientName).localeCompare(lastName(b.clientName));
        if (!a.nextApptDate) return 1;
        if (!b.nextApptDate) return -1;
        return a.nextApptDate.localeCompare(b.nextApptDate);
      }
      // default: follow-up pending prima, poi cognome
      if (a.hasFollowUpPending && !b.hasFollowUpPending) return -1;
      if (!a.hasFollowUpPending && b.hasFollowUpPending) return 1;
      return lastName(a.clientName).localeCompare(lastName(b.clientName));
    });
  }, [appointments, today, sortOrder]);


  const handleStatusChange = async (id: string, newStatus: any) => {
    if (!confirm(`Vuoi cambiare lo stato in: ${newStatus}?`)) return;
    const ok = await updateAppointmentStatus(id, newStatus);
    if (ok) loadData();
  };

  const handleReschedule = async () => {
    if (!rescheduleModal || !rescheduleDate || !rescheduleTime) return;
    setIsRescheduling(true);
    const ok = await rescheduleAppointment(rescheduleModal.apptId, rescheduleDate, rescheduleTime);
    setIsRescheduling(false);
    if (ok) {
      setRescheduleModal(null);
      setRescheduleDate('');
      setRescheduleTime('');
      loadData();
    } else {
      alert('Errore durante lo spostamento.');
    }
  };

  const handleCancelBundle = async (subscriptionId: string, clientName: string) => {
    if (!confirm(`Annullare l'intero percorso di ${clientName}? Tutti gli appuntamenti futuri verranno cancellati.`)) return;
    const res = await fetch(`/api/admin/subscriptions/${subscriptionId}/cancel`, { method: 'POST' });
    if (res.ok) {
      alert('Percorso annullato.');
      loadData();
    } else {
      alert('Errore durante l\'annullamento.');
    }
  };

  const handleResendFollowUp = async (id: string, clientName: string) => {
    if (!confirm(`Rimandare il link follow-up a ${clientName}?`)) return;
    const ok = await resendFollowUpLink(id);
    if (ok) alert('Link inviato!');
    else alert('Errore durante l\'invio.');
  };

  const handleMarkAsPaid = async (id: string) => {
    if (!confirm('Confermi che il bonifico/pagamento è stato ricevuto?')) return;
    const ok = await markSubscriptionAsPaid(id);
    if (ok) {
      alert('Pagamento registrato e appuntamento confermato!');
      loadData();
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">CONFERMATO</span>;
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-md">IN ATTESA</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">CANCELLATO</span>;
      case 'completed': return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">SVOLTO</span>;
      default: return status;
    }
  };

  const applyFilters = (list: typeof appointments) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.clientName.toLowerCase().includes(q) ||
        a.clientEmail.toLowerCase().includes(q) ||
        a.clientPhone.toLowerCase().includes(q)
      );
    }
    if (dateFilter) list = list.filter(a => a.date === dateFilter);
    return list;
  };

  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: 'upcoming', label: 'Prossimi', count: applyFilters(appointments.filter(a => (a.status === 'confirmed' || a.status === 'pending') && a.date >= today)).length || undefined },
    { id: 'pending', label: 'Da confermare', count: applyFilters(appointments.filter(a => a.status === 'pending')).length || undefined },
    { id: 'bundles', label: 'Percorsi', count: bundles.filter(b =>
      (showCompletedBundles || b.sessionsRemaining > 0) &&
      (!search.trim() || b.clientName.toLowerCase().includes(search.toLowerCase()) || b.clientEmail.toLowerCase().includes(search.toLowerCase()))
    ).length || undefined },
    { id: 'completed', label: 'Svolti', count: applyFilters(appointments.filter(a => a.status === 'completed')).length || undefined },
    { id: 'cancelled', label: 'Cancellati', count: applyFilters(appointments.filter(a => a.status === 'cancelled')).length || undefined },
    { id: 'all', label: 'Tutti', count: applyFilters(appointments).length || undefined },
  ];

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[var(--brand-title)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agenda Appuntamenti</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Ciao, {session?.user?.name}</span>
            <Link
              href="/admin/disponibilita"
              className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Disponibilità"
            >
              <Icon name="calendar" size={18} className="text-gray-600" />
            </Link>
            <Link
              href="/admin/settings"
              className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Impostazioni"
            >
              <Icon name="settings" size={18} className="text-gray-600" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="text-sm text-red-500 font-medium hover:underline"
            >
              Esci
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs font-bold uppercase mb-1">Prossimi</div>
            <div className="text-3xl font-bold text-gray-900">
              {appointments.filter(a => (a.status === 'confirmed' || a.status === 'pending') && a.date >= today).length}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-yellow-600 text-xs font-bold uppercase mb-1">Da Confermare</div>
            <div className="text-3xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-red-500 text-xs font-bold uppercase mb-1">Non Pagati</div>
            <div className="text-3xl font-bold text-red-500">
              {appointments.filter(a => !a.isPaid && a.price > 0 && a.status !== 'cancelled').length}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs font-bold uppercase mb-1">Totale</div>
            <div className="text-3xl font-bold text-gray-900">{appointments.length}</div>
          </div>
        </div>

        {/* Tabs filtro */}
        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id);
                if (tab.id === 'bundles' && (sortOrder === 'date-asc' || sortOrder === 'date-desc')) setSortOrder('name-asc');
                if (tab.id !== 'bundles' && (sortOrder === 'expiry-asc' || sortOrder === 'next-asc')) setSortOrder('date-asc');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-[var(--brand-title)] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeFilter === tab.id ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
          <Button onClick={loadData} variant="outline" size="sm" className="text-xs ml-auto">Aggiorna</Button>
        </div>

        {/* Ricerca + filtro data */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cerca per nome, email o telefono..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[var(--brand-title)] text-gray-900"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setDateFilter(dateFilter === today ? '' : today)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${dateFilter === today ? 'bg-[var(--brand-title)] text-white border-[var(--brand-title)]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              Oggi
            </button>
            <button
              onClick={() => setDateFilter(dateFilter === tomorrow ? '' : tomorrow)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${dateFilter === tomorrow ? 'bg-[var(--brand-title)] text-white border-[var(--brand-title)]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              Domani
            </button>
          </div>
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="py-2.5 px-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[var(--brand-title)] text-gray-900"
            />
            {dateFilter && (
              <button onClick={() => setDateFilter('')} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-400 hover:bg-gray-600 text-white rounded-full text-xs flex items-center justify-center leading-none">✕</button>
            )}
          </div>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as typeof sortOrder)}
            className="py-2.5 px-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[var(--brand-title)] text-gray-900"
          >
            {activeFilter !== 'bundles' && <option value="date-asc">Data ↑</option>}
            {activeFilter !== 'bundles' && <option value="date-desc">Data ↓</option>}
            <option value="name-asc">Cognome A→Z</option>
            {activeFilter === 'bundles' && <option value="next-asc">Prossima visita ↑</option>}
            {activeFilter === 'bundles' && <option value="expiry-asc">Scadenza ↑</option>}
          </select>
        </div>

        {/* Vista Percorsi */}
        {activeFilter === 'bundles' && (
          <div className="space-y-4">
            {/* Toggle completati */}
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <p className="text-sm text-gray-500 mr-auto">
                {bundles.filter(b => b.sessionsRemaining > 0).length} percorsi attivi
                {bundles.filter(b => b.sessionsRemaining === 0).length > 0 && ` · ${bundles.filter(b => b.sessionsRemaining === 0).length} completati`}
              </p>
              {bundles.some(b => b.sessionsRemaining === 0) && (
                <button
                  onClick={() => setShowCompletedBundles(v => !v)}
                  className="text-xs text-gray-500 hover:text-gray-800 underline"
                >
                  {showCompletedBundles ? 'Nascondi completati' : 'Mostra completati'}
                </button>
              )}
            </div>
            {isLoading ? (
              <div className="text-center py-10 text-gray-500">Caricamento in corso...</div>
            ) : bundles.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl text-center text-gray-400">Nessun percorso trovato.</div>
            ) : (
              bundles.filter(b =>
                (showCompletedBundles || b.sessionsRemaining > 0) &&
                (!search.trim() ||
                b.clientName.toLowerCase().includes(search.toLowerCase()) ||
                b.clientEmail.toLowerCase().includes(search.toLowerCase()))
              ).map(b => {
                const daysToExpiry = b.expiresAt
                  ? Math.ceil((new Date(b.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : null;
                const expiryWarning = daysToExpiry !== null && daysToExpiry <= 30 && b.sessionsRemaining > 0;

                const bundleKey = `${b.clientEmail}__${b.subscriptionId}`;
                const isExpanded = expandedCards.has(bundleKey);
                return (
                  <div key={bundleKey} className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${b.hasFollowUpPending ? 'border-l-orange-400' : 'border-l-blue-400'}`}>
                    <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">

                      {/* Info cliente */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{b.clientName}</h3>
                          {b.hasFollowUpPending && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-md">FOLLOW-UP ATTESO</span>
                          )}
                          {expiryWarning && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-md">SCADE TRA {daysToExpiry}GG</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <p className="text-sm text-[var(--brand-title)] font-medium">{b.serviceName}</p>
                          <span className="text-xs text-gray-500">{b.price}€</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${b.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {b.isPaid ? 'PAGATO' : 'DA PAGARE'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {b.paymentMethod === 'bank_transfer' ? 'Bonifico' : b.paymentMethod === 'stripe' ? 'Carta' : b.paymentMethod === 'paypal' ? 'PayPal' : b.paymentMethod === 'none' ? 'Gratuito' : b.paymentMethod}
                          </span>
                        </div>

                        {/* Barra sessioni */}
                        <div className="mb-3">
                          <div className="flex gap-1 mb-1">
                            {Array.from({ length: b.totalSessions }).map((_, i) => (
                              <div key={i} className={`h-2.5 flex-1 rounded-full ${i < b.usedSessions ? 'bg-blue-500' : 'bg-blue-100'}`} />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">
                            {b.usedSessions} di {b.totalSessions} sessioni svolte — <strong>{b.sessionsRemaining} rimast{b.sessionsRemaining === 1 ? 'a' : 'e'}</strong>
                          </p>
                        </div>

                        {/* Info sempre visibili */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          {b.nextApptDate && <span>Prossima: <strong className="text-green-700">{formatDate(b.nextApptDate)}</strong></span>}
                          {!b.nextApptDate && b.sessionsRemaining > 0 && <span className="text-orange-600 font-medium">Nessuna visita schedulata</span>}
                          {b.lastApptDate && <span>Ultima: <strong className="text-gray-700">{formatDate(b.lastApptDate)}</strong></span>}
                          <span>Scade: <strong className={expiryWarning ? 'text-red-600' : 'text-gray-700'}>{b.expiresAt ? formatDate(b.expiresAt) : 'Non impostata'}</strong></span>
                        </div>

                        {/* Dettagli espandibili */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                              <div>Acquistato il: <strong className="text-gray-700">{formatDate(b.subscriptionCreatedAt)}</strong></div>
                              <div>Prima prenotazione: <strong className="text-gray-700">{formatDate(b.clientCreatedAt)}</strong></div>
                              <div>Indirizzo: <strong className="text-gray-700">{b.clientAddress}</strong></div>
                              <div>Cod. Fiscale: <strong className="text-gray-700">{b.clientFiscalCode}</strong></div>
                            </div>
                            {b.completedDates.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Sessioni svolte:</p>
                                <div className="flex flex-wrap gap-1">
                                  {b.completedDates.map((d, i) => (
                                    <span key={d} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">#{i + 1} {formatDate(d)}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => toggleExpand(bundleKey)}
                          className="mt-3 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                        >
                          {isExpanded ? '▲ Nascondi dettagli' : '▼ Mostra dettagli'}
                        </button>
                      </div>

                      {/* Azioni */}
                      <div className="flex flex-col gap-2 justify-center min-w-[160px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                        {b.hasFollowUpPending && b.followUpToken && (
                          <Button size="sm" onClick={() => handleResendFollowUp(b.lastApptId, b.clientName)} className="w-full text-xs bg-[var(--brand-title)] text-white">
                            Invia link follow-up
                          </Button>
                        )}
                        <a href={`/admin/clienti/${appointments.find(a => a.clientEmail === b.clientEmail)?.clientId}`} className="w-full text-center text-xs px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                          Scheda completa
                        </a>
                        {b.sessionsRemaining > 0 && (
                          <button onClick={() => handleCancelBundle(b.subscriptionId, b.clientName)} className="w-full text-center text-xs px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                            Annulla percorso
                          </button>
                        )}
                        <div className="flex gap-2 justify-center mt-1">
                          <a href={`tel:${b.clientPhone}`} className="flex-1 text-center py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600 text-xs transition-colors">📞</a>
                          <a href={`mailto:${b.clientEmail}`} className="flex-1 text-center py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600 text-xs transition-colors">✉️</a>
                        </div>
                      </div>

                    </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Lista appuntamenti */}
        {activeFilter !== 'bundles' && <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Caricamento in corso...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl text-center text-gray-400">Nessun appuntamento trovato.</div>
          ) : (
            filtered.map(appt => {
              const isExpanded = expandedCards.has(appt.id);
              return (
              <div key={appt.id} className={`bg-white text-gray-900 rounded-xl shadow-sm transition-all hover:shadow-md border border-gray-100 border-l-4 ${
                appt.status === 'pending' ? 'border-l-yellow-400' :
                appt.status === 'cancelled' ? 'border-l-red-300' :
                appt.status === 'completed' ? 'border-l-gray-300' :
                'border-l-[var(--brand-title)]'
              }`}>
                <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">

                  {/* Data e ora */}
                  <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl min-w-[110px]">
                    <span className="text-2xl font-bold text-gray-900">{appt.time}</span>
                    <span className="text-xs text-gray-500 text-center mt-1">{formatDate(appt.date)}</span>
                  </div>

                  {/* Info cliente */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900">{appt.clientName}</h3>
                      {getStatusBadge(appt.status)}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[var(--brand-title)] text-sm">{appt.serviceName}</span>
                      {appt.price > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${appt.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {appt.isPaid ? `PAGATO (${appt.price}€)` : `DA PAGARE (${appt.price}€)`}
                        </span>
                      )}
                      {appt.price > 0 && (
                        <span className="text-xs text-gray-400">
                          {appt.paymentMethod === 'bank_transfer' ? 'Bonifico' : appt.paymentMethod === 'stripe' ? 'Carta' : appt.paymentMethod === 'paypal' ? 'PayPal' : appt.paymentMethod === 'none' ? 'Gratuito' : ''}
                        </span>
                      )}
                      {/* Info sessioni per percorsi */}
                      {isBundle(appt.subscriptionType) && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                          Sessione {appt.usedSessions} di {appt.totalSessions} — {appt.totalSessions - appt.usedSessions} rimast{appt.totalSessions - appt.usedSessions === 1 ? 'a' : 'e'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-4 mt-1">
                      <div className="flex items-center gap-1"><Icon name="mail" size={14} /> {appt.clientEmail}</div>
                      <div className="flex items-center gap-1"><Icon name="phone" size={14} /> {appt.clientPhone}</div>
                    </div>
                    {appt.status === 'pending' && appt.paymentMethod === 'bank_transfer' && (() => {
                      const msLeft = Math.max(0, 72 * 60 * 60 * 1000 - (Date.now() - new Date(appt.createdAt).getTime()));
                      const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
                      const minutesLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
                      const isUrgent = hoursLeft <= 12;
                      const label = msLeft > 0
                        ? `Bonifico atteso — scade tra ${hoursLeft}h ${minutesLeft}m`
                        : 'Scaduto — verrà cancellato al prossimo cron';
                      return (
                        <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 ${isUrgent ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                          <Icon name="clock" size={12} />
                          {label}
                        </div>
                      );
                    })()}
                    {appt.notes && (
                      <div className="bg-yellow-50 p-2 rounded-lg text-sm text-yellow-800 mt-2">
                        <strong>Note:</strong> {appt.notes}
                      </div>
                    )}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                        <div>Indirizzo: <strong className="text-gray-700">{appt.clientAddress}</strong></div>
                        <div>Cod. Fiscale: <strong className="text-gray-700">{appt.clientFiscalCode}</strong></div>
                        <div>Prima prenotazione: <strong className="text-gray-700">{formatDate(appt.clientCreatedAt)}</strong></div>
                      </div>
                    )}
                    <button
                      onClick={() => toggleExpand(appt.id)}
                      className="mt-2 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                    >
                      {isExpanded ? '▲ Nascondi dettagli' : '▼ Mostra dettagli'}
                    </button>
                  </div>

                  {/* Azioni */}
                  <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[160px]">
                    {!appt.isPaid && appt.price > 0 && appt.status !== 'cancelled' && (
                      <Button size="sm" className="bg-green-600 text-white w-full text-xs" onClick={() => handleMarkAsPaid(appt.id)}>
                        Segna Pagato
                      </Button>
                    )}
                    {appt.status === 'pending' && appt.isPaid && (
                      <Button size="sm" onClick={() => handleStatusChange(appt.id, 'confirmed')} className="w-full text-xs bg-[var(--brand-title)] text-white">
                        Conferma Ora
                      </Button>
                    )}
                    {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                      <Button size="sm" onClick={() => setRescheduleModal({ apptId: appt.id, clientName: appt.clientName })} className="w-full text-xs bg-blue-500 text-white">
                        Sposta
                      </Button>
                    )}
                    {appt.status === 'confirmed' && (
                      <Button size="sm" onClick={() => handleStatusChange(appt.id, 'completed')} className="w-full text-xs bg-gray-600 text-white">
                        Segna Svolto
                      </Button>
                    )}
                    {appt.status === 'completed' && appt.followUpToken && (appt.totalSessions - appt.usedSessions) > 0 && (
                      <Button size="sm" onClick={() => handleResendFollowUp(appt.id, appt.clientName)} className="w-full text-xs bg-[var(--brand-title)] text-white">
                        Rimanda follow-up
                      </Button>
                    )}
                    {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                      <button onClick={() => handleStatusChange(appt.id, 'cancelled')} className="w-full text-center text-xs px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors mt-1">
                        Annulla
                      </button>
                    )}
                    <a href={`/admin/clienti/${appt.clientId}`} className="w-full text-center text-xs px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors mt-1">
                      Scheda completa
                    </a>
                    <div className="flex gap-2 mt-1">
                      <a href={`tel:${appt.clientPhone}`} className="flex-1 text-center py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600 text-xs transition-colors">📞</a>
                      <a href={`mailto:${appt.clientEmail}`} className="flex-1 text-center py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600 text-xs transition-colors">✉️</a>
                    </div>
                  </div>

                </div>
                </div>
              </div>
              );
            })
          )}
        </div>}
      </div>
    </div>

    {/* Modal spostamento appuntamento */}
    {rescheduleModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Sposta Appuntamento</h2>
          <p className="text-sm text-gray-500 mb-6">{rescheduleModal.clientName}</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nuova Data</label>
              <input
                type="date"
                value={rescheduleDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setRescheduleDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-[var(--brand-title)] text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nuovo Orario</label>
              <select
                value={rescheduleTime}
                onChange={e => setRescheduleTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-[var(--brand-title)] text-gray-900 appearance-none"
              >
                <option value="">Seleziona orario</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { setRescheduleModal(null); setRescheduleDate(''); setRescheduleTime(''); }}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <Button
              onClick={handleReschedule}
              disabled={!rescheduleDate || !rescheduleTime || isRescheduling}
              className={`flex-1 rounded-xl font-bold text-white ${!rescheduleDate || !rescheduleTime || isRescheduling ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isRescheduling ? 'Spostando...' : 'Conferma'}
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default dynamic(() => Promise.resolve(AdminPage), { ssr: false });
