'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getClientConfirmationEmailHTML } from '@/lib/email-templates/client-confirmation';
import { getAdminNotificationEmailHTML } from '@/lib/email-templates/admin-notification';

function withLocalImages(html: string) {
  return html.replaceAll('https://www.vivaplantnutrition.com', 'http://localhost:3000');
}

const clientConfirmed = withLocalImages(getClientConfirmationEmailHTML({
  clientName: 'Maria Rossi',
  serviceName: 'Consulenza Nutrizionale Completa',
  price: 120,
  date: '2026-06-15',
  time: '10:00',
  notes: 'Sono vegetariana da 2 anni e vorrei ottimizzare la mia alimentazione.',
  isFree: false,
  isBankTransfer: false,
}));

const clientBankTransfer = withLocalImages(getClientConfirmationEmailHTML({
  clientName: 'Luca Bianchi',
  serviceName: 'Piano Alimentare Personalizzato',
  price: 200,
  date: '2026-06-20',
  time: '14:30',
  isFree: false,
  isBankTransfer: true,
}));

const clientFree = withLocalImages(getClientConfirmationEmailHTML({
  clientName: 'Sara Verdi',
  serviceName: 'Colloquio Gratuito',
  price: 0,
  date: '2026-06-10',
  time: '11:00',
  isFree: true,
  isBankTransfer: false,
}));

const adminNotification = withLocalImages(getAdminNotificationEmailHTML({
  clientName: 'Maria Rossi',
  clientEmail: 'maria.rossi@example.com',
  clientPhone: '+39 333 123 4567',
  serviceName: 'Consulenza Nutrizionale Completa',
  price: 120,
  date: '2026-06-15',
  time: '10:00',
  notes: 'Sono vegetariana da 2 anni e vorrei ottimizzare la mia alimentazione.',
  paymentMethod: 'Carta di credito',
  isPaid: true,
}));

const tabs = [
  { id: 'client-confirmed', label: 'Cliente — Confermata', html: clientConfirmed },
  { id: 'client-bank', label: 'Cliente — Bonifico', html: clientBankTransfer },
  { id: 'client-free', label: 'Cliente — Gratuita', html: clientFree },
  { id: 'admin', label: 'Admin — Notifica', html: adminNotification },
];

export default function EmailPreviewPage() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      router.replace('/');
    }
  }, [router]);

  if (process.env.NODE_ENV !== 'development') return null;

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const current = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Anteprima Template Email</h1>
        <div className="flex gap-2 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        <iframe
          srcDoc={current.html}
          className="w-full rounded-lg shadow-lg bg-white"
          style={{ height: '80vh', border: 'none' }}
          title={current.label}
        />
      </div>
    </div>
  );
}
