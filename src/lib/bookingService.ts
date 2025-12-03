// Servizio per gestire le prenotazioni e utenti con localStorage
// In produzione sostituire con chiamate API a database reale

export interface Booking {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  consultationType: string;
  selectedDate: string;
  selectedTime: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  timestamp: string;
}

export interface User {
  username: string;
  password: string;
  name: string;
  role: 'admin';
}

const BOOKINGS_KEY = 'plant-nutrition-bookings';
const USERS_KEY = 'plant-nutrition-users';

// Inizializza i dati se non esistono
const initializeData = () => {
  // Inizializza utenti
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers: User[] = [
      {
        username: 'arianna',
        password: 'arianna2025',
        name: 'Dr. Arianna Ciervo',
        role: 'admin'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }

  // Inizializza prenotazioni di esempio
  if (!localStorage.getItem(BOOKINGS_KEY)) {
    const defaultBookings: Booking[] = [
      {
        id: 'booking_1699123456789',
        name: 'Maria',
        surname: 'Rossi',
        email: 'maria.rossi@email.com',
        phone: '+39 333 123 4567',
        consultationType: 'prima-visita',
        selectedDate: '2025-11-15',
        selectedTime: '10:00',
        notes: 'Interessata alla dieta vegana per problemi digestivi',
        status: 'pending',
        timestamp: '2025-11-09T10:30:00Z'
      },
      {
        id: 'booking_1699123456790',
        name: 'Luca',
        surname: 'Bianchi',
        email: 'luca.bianchi@email.com',
        phone: '+39 334 567 8901',
        consultationType: 'controllo',
        selectedDate: '2025-11-16',
        selectedTime: '14:30',
        notes: '',
        status: 'confirmed',
        timestamp: '2025-11-09T11:15:00Z'
      }
    ];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(defaultBookings));
  }
};

// Gestione utenti
export const authenticateUser = (username: string, password: string): User | null => {
  initializeData();
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  return users.find(user => user.username === username && user.password === password) || null;
};

export const getUsers = (): User[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

export const createUser = (user: User): boolean => {
  try {
    const users = getUsers();
    if (users.find(u => u.username === user.username)) {
      return false; // Utente già esistente
    }
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Errore nella creazione utente:', error);
    return false;
  }
};

// Gestione prenotazioni
export const getBookings = (): Booking[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
};

export const createBooking = (booking: Omit<Booking, 'id' | 'timestamp'>): Booking => {
  const newBooking: Booking = {
    ...booking,
    id: `booking_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  
  const bookings = getBookings();
  bookings.push(newBooking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  
  return newBooking;
};

export const updateBookingStatus = (bookingId: string, status: Booking['status']): boolean => {
  try {
    const bookings = getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      return false;
    }
    
    bookings[bookingIndex].status = status;
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return true;
  } catch (error) {
    console.error('Errore nell\'aggiornamento prenotazione:', error);
    return false;
  }
};

export const deleteBooking = (bookingId: string): boolean => {
  try {
    const bookings = getBookings();
    const filteredBookings = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filteredBookings));
    return true;
  } catch (error) {
    console.error('Errore nell\'eliminazione prenotazione:', error);
    return false;
  }
};

export const getBookingById = (bookingId: string): Booking | null => {
  const bookings = getBookings();
  return bookings.find(b => b.id === bookingId) || null;
};