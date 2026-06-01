'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Icon from '@/components/icons/Icon';
import Button from '@/components/ui/Button';
import { getAdminAppointments, AdminAppointmentView } from '@/lib/bookingService';

const isBundle = (type: string) => type === 'BUNDLE_3_MONTHS' || type === 'BUNDLE_6_MONTHS';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

const paymentLabel = (pm: string) => {
  switch (pm) {
    case 'bank_transfer': return 'Bonifico';
    case 'stripe': return 'Carta di credito';
    case 'paypal': return 'PayPal';
    case 'none': return 'Gratuito';
    default: return pm;
  }
};

function getStatusBadge(status: string) {
  switch (status) {
    case 'confirmed': return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-md">CONFERMATO</span>;
    case 'pending': return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-md">IN ATTESA</span>;
    case 'cancelled': return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-md">CANCELLATO</span>;
    case 'completed': return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">SVOLTO</span>;
    default: return null;
  }
}

function ClientePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useSession();
  const [appointments, setAppointments] = useState<AdminAppointmentView[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    getAdminAppointments()
      .then(data => setAppointments(data.filter(a => a.clientId === id)))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[var(--brand-title)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Cliente non trovato.</p>
          <Button onClick={() => router.push('/admin')} className="bg-[var(--brand-title)] text-white">Torna al dashboard</Button>
        </div>
      </div>
    );
  }

  const client = appointments[0];
  const today = new Date().toISOString().split('T')[0];

  // Raggruppa per subscription
  const subscriptionMap = new Map<string, AdminAppointmentView[]>();
  appointments.forEach(a => {
    if (!subscriptionMap.has(a.subscriptionId)) subscriptionMap.set(a.subscriptionId, []);
    subscriptionMap.get(a.subscriptionId)!.push(a);
  });

  const subscriptions = Array.from(subscriptionMap.entries()).map(([subId, appts]) => {
    const first = appts[0];
    const completed = appts.filter(a => a.status === 'completed').length;
    return {
      id: subId,
      serviceName: first.serviceName,
      subscriptionType: first.subscriptionType,
      price: first.price,
      isPaid: first.isPaid,
      paymentMethod: first.paymentMethod,
      totalSessions: first.totalSessions,
      usedSessions: first.usedSessions,
      subscriptionStatus: first.subscriptionStatus,
      expiresAt: first.expiresAt,
      subscriptionCreatedAt: first.subscriptionCreatedAt,
      completedCount: completed,
      appointments: appts.sort((a, b) => b.date.localeCompare(a.date)),
    };
  }).sort((a, b) => b.subscriptionCreatedAt.localeCompare(a.subscriptionCreatedAt));

  const upcoming = appointments.filter(a => (a.status === 'confirmed' || a.status === 'pending') && a.date >= today).length;
  const completedTotal = appointments.filter(a => a.status === 'completed').length;
  const cancelledTotal = appointments.filter(a => a.status === 'cancelled').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4 text-sm font-medium transition-colors"
          >
            <Icon name="chevronLeft" size={16} /> Torna al dashboard
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.clientName}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{client.clientEmail}</p>
              <p className="text-sm text-gray-500">{client.clientPhone}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`mailto:${client.clientEmail}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Icon name="mail" size={16} /> Scrivi email
              </a>
              <a
                href={`tel:${client.clientPhone}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Icon name="phone" size={16} /> Chiama
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{upcoming}</div>
            <div className="text-xs text-gray-500 mt-1">Prossimi</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{completedTotal}</div>
            <div className="text-xs text-gray-500 mt-1">Svolti</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{cancelledTotal}</div>
            <div className="text-xs text-gray-500 mt-1">Cancellati</div>
          </div>
        </div>

        {/* Dati anagrafici */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 uppercase mb-4">Dati Anagrafici</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Indirizzo:</span> <strong className="text-gray-800">{client.clientAddress}</strong></div>
            <div><span className="text-gray-500">Città:</span> <strong className="text-gray-800">{client.clientCity}</strong></div>
            <div><span className="text-gray-500">Cod. Fiscale:</span> <strong className="text-gray-800">{client.clientFiscalCode}</strong></div>
            <div><span className="text-gray-500">Prima prenotazione:</span> <strong className="text-gray-800">{formatDate(client.clientCreatedAt)}</strong></div>
          </div>
        </div>

        {/* Abbonamenti / Percorsi */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase">Abbonamenti e Percorsi</h2>
          {subscriptions.map(sub => {
            const isBundleSub = isBundle(sub.subscriptionType);
            const sessionsRemaining = sub.totalSessions - sub.usedSessions;
            const expiryDays = sub.expiresAt
              ? Math.ceil((new Date(sub.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div key={sub.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{sub.serviceName}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm text-gray-500">{sub.price}€</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${sub.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {sub.isPaid ? 'PAGATO' : 'DA PAGARE'}
                      </span>
                      <span className="text-xs text-gray-400">{paymentLabel(sub.paymentMethod)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        sub.subscriptionStatus === 'active' ? 'bg-blue-50 text-blue-700' :
                        sub.subscriptionStatus === 'exhausted' ? 'bg-gray-100 text-gray-500' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {sub.subscriptionStatus === 'active' ? 'Attivo' : sub.subscriptionStatus === 'exhausted' ? 'Completato' : 'Cancellato'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Acquistato {formatDate(sub.subscriptionCreatedAt)}</div>
                </div>

                {isBundleSub && (
                  <div className="mb-4">
                    <div className="flex gap-1 mb-1">
                      {Array.from({ length: sub.totalSessions }).map((_, i) => (
                        <div key={i} className={`h-2 flex-1 rounded-full ${i < sub.usedSessions ? 'bg-blue-500' : 'bg-blue-100'}`} />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{sub.usedSessions} di {sub.totalSessions} sessioni svolte — <strong>{sessionsRemaining} rimast{sessionsRemaining === 1 ? 'a' : 'e'}</strong></span>
                      {sub.expiresAt && (
                        <span className={expiryDays !== null && expiryDays <= 30 ? 'text-red-600 font-medium' : ''}>
                          Scade {formatDate(sub.expiresAt)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Appuntamenti del sotto-abbonamento */}
                <div className="space-y-2">
                  {sub.appointments.map(a => (
                    <div key={a.id} className="flex items-center justify-between py-2 border-t border-gray-50 first:border-0">
                      <div>
                        <span className="text-sm text-gray-800 font-medium">{formatDate(a.date)} — {a.time}</span>
                        {a.notes && <p className="text-xs text-gray-400 mt-0.5">{a.notes}</p>}
                      </div>
                      {getStatusBadge(a.status)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ClientePage), { ssr: false });
