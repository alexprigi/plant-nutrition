import { NextRequest, NextResponse } from 'next/server';

interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  consultationType: string;
  selectedDate: string;
  selectedTime: string;
  notes: string;
}

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingRequest = await request.json();
    
    // Validazione basic
    if (!bookingData.name || !bookingData.email || !bookingData.phone || 
        !bookingData.selectedDate || !bookingData.selectedTime) {
      return NextResponse.json(
        { error: 'Tutti i campi obbligatori devono essere compilati' },
        { status: 400 }
      );
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      );
    }

    // Formatta i dati per l'email
    const formattedDate = new Date(bookingData.selectedDate).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const consultationTypes = {
      'prima-visita': 'Prima Visita (60 min) - €80',
      'controllo': 'Controllo (30 min) - €50',
      'consulenza-online': 'Consulenza Online (45 min) - €60'
    };

    // Log della prenotazione (in produzione andrà in un database)
    console.log('NUOVA PRENOTAZIONE:', {
      ...bookingData,
      timestamp: new Date().toISOString()
    });

    // Qui andrà l'integrazione con il servizio email (Resend, SendGrid, etc.)
    // Per ora simula l'invio dell'email
    const emailContent = {
      to: ['arianna@puraessenzavegetale.it'], // Email della nutrizionista
      cc: [bookingData.email], // Copia al cliente
      subject: `Nuova Prenotazione - ${bookingData.name}`,
      html: `
        <h2>Nuova Richiesta di Prenotazione</h2>
        
        <h3>Dettagli Cliente:</h3>
        <ul>
          <li><strong>Nome:</strong> ${bookingData.name}</li>
          <li><strong>Email:</strong> ${bookingData.email}</li>
          <li><strong>Telefono:</strong> ${bookingData.phone}</li>
        </ul>
        
        <h3>Dettagli Appuntamento:</h3>
        <ul>
          <li><strong>Data:</strong> ${formattedDate}</li>
          <li><strong>Orario:</strong> ${bookingData.selectedTime}</li>
          <li><strong>Tipo Consulenza:</strong> ${consultationTypes[bookingData.consultationType as keyof typeof consultationTypes]}</li>
        </ul>
        
        ${bookingData.notes ? `
          <h3>Note aggiuntive:</h3>
          <p>${bookingData.notes}</p>
        ` : ''}
        
        <hr>
        <p><em>Ricordati di confermare l'appuntamento contattando il cliente entro 24 ore.</em></p>
      `
    };

    // Log email content (sostituire con invio email reale)
    console.log('EMAIL DA INVIARE:', emailContent);

    // Salva la prenotazione (in futuro: database)
    // Per ora utilizziamo un file locale per i test
    
    return NextResponse.json(
      { 
        message: 'Prenotazione ricevuta con successo!',
        booking: {
          id: `booking_${Date.now()}`,
          date: formattedDate,
          time: bookingData.selectedTime,
          status: 'pending'
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Errore nell\'elaborazione della prenotazione:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// Gestione richieste GET per ottenere gli slot disponibili
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  
  if (!date) {
    return NextResponse.json(
      { error: 'Data richiesta' },
      { status: 400 }
    );
  }

  // Qui andrà la logica per controllare gli slot già prenotati
  // Per ora restituisce tutti gli slot come disponibili
  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  return NextResponse.json({
    date,
    slots: availableSlots.map(time => ({
      time,
      available: true // In futuro: controllare dal database
    }))
  });
}