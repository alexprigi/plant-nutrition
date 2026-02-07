'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Icon from '@/components/icons/Icon';
import {
  authenticateUser,
  User,
  getAdminAppointments,
  updateAppointmentStatus,
  markSubscriptionAsPaid,
  AdminAppointmentView
} from '@/lib/bookingService';

const AdminPage = () => {
  const [appointments, setAppointments] = useState<AdminAppointmentView[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check session on load (Optional enhancement)
    const savedUser = sessionStorage.getItem('admin_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      loadData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = () => {
    const user = authenticateUser(username, password);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      sessionStorage.setItem('admin_user', JSON.stringify(user));
      loadData();
    } else {
      alert('Credenziali non valide');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const loadData = () => {
    setIsLoading(true);
    // Piccolo timeout per simulare caricamento ed evitare flash
    setTimeout(() => {
      const data = getAdminAppointments();
      setAppointments(data);
      setIsLoading(false);
    }, 300);
  };

  // --- ACTIONS ---

  const handleStatusChange = (id: string, newStatus: any) => {
    if (!confirm(`Vuoi cambiare lo stato in: ${newStatus}?`)) return;
    const ok = updateAppointmentStatus(id, newStatus);
    if (ok) loadData();
  };

  const handleMarkAsPaid = (id: string) => {
    if (!confirm('Confermi che il bonifico/pagamento è stato ricevuto?')) return;
    const ok = markSubscriptionAsPaid(id);
    if (ok) {
      alert('Pagamento registrato e appuntamento confermato!');
      loadData();
    }
  };

  // --- UI HELPERS ---

  const formatDate = (d: string) => new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">CONFERMATO</span>;
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-md">IN ATTESA</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">CANCELLATO</span>;
      case 'completed': return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">SVOLTO</span>;
      default: return status;
    }
  };

  // --- LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Area Riservata</h1>
          <div className="space-y-4">
            <input
              type="text" placeholder="Username"
              value={username} onChange={e => setUsername(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />
            <input
              type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />
            <Button onClick={handleLogin} className="w-full bg-[var(--brand-title)] text-white">Accedi</Button>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agenda Appuntamenti</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Ciao, {currentUser?.name}</span>
            <button onClick={handleLogout} className="text-sm text-red-500 font-medium hover:underline">Esci</button>
          </div>
        </div>

        {/* STATS RAPIDE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-bold uppercase">Prossimi Appuntamenti</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-bold uppercase text-yellow-600">Da Confermare (Pending)</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">
              {appointments.filter(a => a.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-bold uppercase text-red-600">Non Pagati</div>
            <div className="text-3xl font-bold text-red-600 mt-2">
              {appointments.filter(a => !a.isPaid && a.price > 0 && a.status !== 'cancelled').length}
            </div>
          </div>
        </div>

        {/* LISTA APPUNTAMENTI */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Elenco Completo</h2>
            <Button onClick={loadData} variant="outline" size="sm" className="text-xs">Aggiorna Dati</Button>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Caricamento in corso...</div>
          ) : appointments.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl text-center text-gray-400">Nessun appuntamento trovato.</div>
          ) : (
            appointments.map(appt => (
              <Card key={appt.id} className="p-6 transition-all hover:shadow-md border-l-4 border-l-[var(--brand-title)]">
                <div className="flex flex-col md:flex-row justify-between gap-6">

                  {/* DATA E ORA */}
                  <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl min-w-[100px]">
                    <span className="text-sm font-bold text-gray-500 uppercase">{formatDate(appt.date).split(' ')[0]}</span>
                    <span className="text-2xl font-bold text-gray-900">{appt.time}</span>
                    <span className="text-xs text-gray-400">{formatDate(appt.date)}</span>
                  </div>

                  {/* INFO CLIENTE E SERVIZIO */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{appt.clientName}</h3>
                      {getStatusBadge(appt.status)}
                    </div>

                    <p className="text-gray-600 flex items-center gap-2">
                      <span className="font-medium text-[var(--brand-title)]">{appt.serviceName}</span>
                      {appt.price > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${appt.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {appt.isPaid ? 'PAGATO' : `DA PAGARE (${appt.price}€)`}
                        </span>
                      )}
                    </p>

                    <div className="text-sm text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-1"><Icon name="mail" size={14} /> {appt.clientEmail}</div>
                      <div className="flex items-center gap-1"><Icon name="phone" size={14} /> {appt.clientPhone}</div>
                    </div>

                    {appt.notes && (
                      <div className="bg-yellow-50 p-2 rounded-lg text-sm text-yellow-800 mt-2">
                        <strong>Note cliente:</strong> {appt.notes}
                      </div>
                    )}
                  </div>

                  {/* AZIONI */}
                  <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[160px]">

                    {/* Conferma Pagamento (Solo se pending e non pagato) */}
                    {!appt.isPaid && appt.price > 0 && appt.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        className="bg-green-600 text-white w-full text-xs"
                        onClick={() => handleMarkAsPaid(appt.id)}
                      >
                        Segna Pagato
                      </Button>
                    )}

                    {/* Azioni di stato */}
                    {appt.status === 'pending' && (
                      <Button size="sm" onClick={() => handleStatusChange(appt.id, 'confirmed')} className="w-full text-xs bg-[var(--brand-title)] text-white">Conferma Ora</Button>
                    )}

                    {appt.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(appt.id, 'cancelled')}
                        className="text-red-500 text-xs hover:underline mt-1"
                      >
                        Annulla Appuntamento
                      </button>
                    )}

                    <div className="flex gap-2 justify-center mt-2">
                      <a href={`tel:${appt.clientPhone}`} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"><Icon name="phone" size={16} /></a>
                      <a href={`mailto:${appt.clientEmail}`} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"><Icon name="mail" size={16} /></a>
                    </div>
                  </div>

                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(AdminPage), { ssr: false });