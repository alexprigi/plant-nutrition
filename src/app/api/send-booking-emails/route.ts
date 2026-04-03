import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email';
import { 
  getClientConfirmationEmailHTML, 
  getClientConfirmationEmailText 
} from '@/lib/email-templates/client-confirmation';
import { 
  getAdminNotificationEmailHTML, 
  getAdminNotificationEmailText 
} from '@/lib/email-templates/admin-notification';

interface SendBookingEmailsRequest {
  // Client info
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  
  // Booking info
  serviceName: string;
  price: number;
  date: string;
  time: string;
  notes?: string;
  
  // Payment info
  paymentMethod: 'stripe' | 'paypal' | 'bank_transfer' | 'none';
  isPaid: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: SendBookingEmailsRequest = await request.json();

    const isFree = data.price === 0;
    const isBankTransfer = data.paymentMethod === 'bank_transfer';

    // Map payment method to friendly name
    const paymentMethodMap = {
      stripe: 'Carta di Credito',
      paypal: 'PayPal',
      bank_transfer: 'Bonifico Bancario',
      none: 'Nessuno (Gratuito)'
    };

    // Prepare email data for client
    const clientEmailData = {
      clientName: data.clientName,
      serviceName: data.serviceName,
      price: data.price,
      date: data.date,
      time: data.time,
      notes: data.notes,
      isFree,
      isBankTransfer
    };

    // Prepare email data for admin
    const adminEmailData = {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      serviceName: data.serviceName,
      price: data.price,
      date: data.date,
      time: data.time,
      notes: data.notes,
      paymentMethod: paymentMethodMap[data.paymentMethod],
      isPaid: data.isPaid
    };

    // Send email to client
    const clientEmailResult = await resend.emails.send({
      from: 'Viva Plant Nutrition <info@vivaplantnutrition.com>',
      to: data.clientEmail,
      subject: isBankTransfer 
        ? `Richiesta Prenotazione Ricevuta - ${data.serviceName}` 
        : `Conferma Prenotazione - ${data.serviceName}`,
      html: getClientConfirmationEmailHTML(clientEmailData),
      text: getClientConfirmationEmailText(clientEmailData),
    });

    // Send notification to admin
    const adminEmailResult = await resend.emails.send({
      from: 'Viva Plant Nutrition <info@vivaplantnutrition.com>',
      to: 'info@vivaplantnutrition.com',
      subject: `🔔 Nuova Prenotazione: ${data.serviceName} - ${data.clientName}`,
      html: getAdminNotificationEmailHTML(adminEmailData),
      text: getAdminNotificationEmailText(adminEmailData),
    });

    return NextResponse.json({
      success: true,
      clientEmailId: clientEmailResult.data?.id,
      adminEmailId: adminEmailResult.data?.id
    }, { status: 200 });

  } catch (error: any) {
    console.error('Email sending error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send emails'
    }, { status: 500 });
  }
}
