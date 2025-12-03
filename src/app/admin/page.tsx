'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Booking, 
  User, 
  authenticateUser, 
  getBookings, 
  updateBookingStatus 
} from '@/lib/bookingService';

const AdminPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Non renderizzare nulla fino a quando non siamo lato client
  if (!isClient) {
    return null;
  }

  const handleLogin = () => {
    const user = authenticateUser(username, password);
    if (user) {
      setIsAuthenticated(true);
      setAuthenticatedUser(user);
      loadBookings();
    } else {
      alert('Nome utente o password non corretti');
    }
  };

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const bookingsData = getBookings();
      setBookings(bookingsData);
    } catch (error) {
      console.error('Errore nel caricamento delle prenotazioni:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Formatta la data solo lato client per evitare hydration error
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('it-IT');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConsultationTypeLabel = (type: string) => {
    const types = {
      'prima-visita': 'Prima Visita (60 min) - €80',
      'controllo': 'Controllo (30 min) - €50',
      'consulenza-online': 'Consulenza Online (45 min) - €60'
    };
    return types[type as keyof typeof types] || type;
  };

  const handleConfirmBooking = async (bookingId: string) => {
    if (confirm('Sei sicura di voler confermare questa prenotazione?')) {
      const success = updateBookingStatus(bookingId, 'confirmed');
      if (success) {
        loadBookings(); // Ricarica la lista
        alert('Prenotazione confermata con successo!');
      } else {
        alert('Errore nella conferma della prenotazione');
      }
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Sei sicura di voler annullare questa prenotazione?')) {
      const success = updateBookingStatus(bookingId, 'cancelled');
      if (success) {
        loadBookings(); // Ricarica la lista
        alert('Prenotazione annullata');
      } else {
        alert('Errore nell\'annullamento della prenotazione');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Accesso Amministratore
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Pura Essenza Vegetale - Gestione Prenotazioni
            </p>
            <p className="mt-1 text-center text-xs text-gray-500">
              Demo: utente "arianna", password "arianna2025"
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nome Utente
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Inserisci il nome utente"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Inserisci la password"
              />
            </div>
            <div>
              <Button
                onClick={handleLogin}
                variant="sage"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white"
              >
                Accedi
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gestione Prenotazioni
          </h1>
          <p className="text-xl text-gray-600">
            Amministrazione Pura Essenza Vegetale
          </p>
          {authenticatedUser && (
            <p className="text-sm text-gray-500 mt-2">
              Benvenuta, {authenticatedUser.name}
            </p>
          )}
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setAuthenticatedUser(null);
              setUsername('');
              setPassword('');
            }}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Esci
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">In Attesa</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confermate</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {bookings.length}
            </div>
            <div className="text-sm text-gray-600">Totale</div>
          </Card>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">Caricamento prenotazioni...</div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">Nessuna prenotazione trovata</div>
            </div>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {booking.name} {booking.surname}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status === 'pending' ? 'In Attesa' :
                         booking.status === 'confirmed' ? 'Confermata' : 'Annullata'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Email:</strong> {booking.email}
                      </div>
                      <div>
                        <strong>Telefono:</strong> {booking.phone}
                      </div>
                      <div>
                        <strong>Data:</strong> {formatDate(booking.selectedDate)}
                      </div>
                      <div>
                        <strong>Orario:</strong> {booking.selectedTime}
                      </div>
                      <div className="md:col-span-2">
                        <strong>Tipo:</strong> {getConsultationTypeLabel(booking.consultationType)}
                      </div>
                      {booking.notes && (
                        <div className="md:col-span-2">
                          <strong>Note:</strong> {booking.notes}
                        </div>
                      )}
                      <div className="md:col-span-2 text-xs text-gray-500">
                        <strong>Richiesta:</strong> {formatDateTime(booking.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row lg:flex-col gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleConfirmBooking(booking.id)}
                        >
                          Conferma
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Rifiuta
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { window.open(`mailto:${booking.email}?subject=Re: Prenotazione del ${formatDate(booking.selectedDate)}`); }}
                    >
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { window.open(`tel:${booking.phone}`); }}
                    >
                      Chiama
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <Button
            onClick={loadBookings}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? 'Caricamento...' : 'Aggiorna'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Disabilita il Server-Side Rendering per questa pagina per evitare hydration errors
export default dynamic(() => Promise.resolve(AdminPage), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg text-gray-600">Caricamento...</div>
    </div>
  )
});