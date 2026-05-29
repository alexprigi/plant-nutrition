import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email';
import {
  getClientConfirmationEmailHTML,
  getClientConfirmationEmailText,
} from '@/lib/email-templates/client-confirmation';
import {
  getAdminNotificationEmailHTML,
  getAdminNotificationEmailText,
} from '@/lib/email-templates/admin-notification';
import { generateICS, icsToBase64 } from '@/lib/ics';

interface SendBookingEmailsRequest {
  type?: 'booking' | 'cancellation' | 'reschedule';
  // Client info
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  // Booking info
  serviceName?: string;
  price?: number;
  date?: string;
  time?: string;
  notes?: string;
  // Payment info
  paymentMethod?: 'stripe' | 'paypal' | 'bank_transfer' | 'none';
  isPaid?: boolean;
  managementToken?: string;
  durationMinutes?: number;
  // Reschedule
  oldDate?: string;
  oldTime?: string;
  newDate?: string;
  newTime?: string;
}

const ADMIN_EMAIL = 'info@vivaplantnutrition.com';
const FROM = 'Viva Plant Nutrition <info@vivaplantnutrition.com>';
const IS_PROD = process.env.AUTH_URL === 'https://www.vivaplantnutrition.com';
const subjectPrefix = IS_PROD ? '' : '[TEST] ';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export async function POST(request: NextRequest) {
  try {
    const data: SendBookingEmailsRequest = await request.json();
    const type = data.type ?? 'booking';

    // --- CANCELLAZIONE ---
    if (type === 'cancellation') {
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `${subjectPrefix}❌ Appuntamento cancellato - ${data.clientName}`,
        html: `<p>Il cliente <strong>${data.clientName}</strong> (${data.clientEmail}) ha cancellato l'appuntamento del <strong>${data.date ? formatDate(data.date) : ''} alle ${data.time}</strong>.</p>`,
        text: `Il cliente ${data.clientName} (${data.clientEmail}) ha cancellato l'appuntamento del ${data.date ? formatDate(data.date) : ''} alle ${data.time}.`,
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // --- SPOSTAMENTO ---
    if (type === 'reschedule') {
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `${subjectPrefix}📅 Appuntamento spostato - ${data.clientName}`,
        html: `<p>Il cliente <strong>${data.clientName}</strong> (${data.clientEmail}) ha spostato l'appuntamento:</p><ul><li><strong>Da:</strong> ${data.oldDate ? formatDate(data.oldDate) : ''} alle ${data.oldTime}</li><li><strong>A:</strong> ${data.newDate ? formatDate(data.newDate) : ''} alle ${data.newTime}</li></ul>`,
        text: `Il cliente ${data.clientName} (${data.clientEmail}) ha spostato l'appuntamento.\nDa: ${data.oldDate ? formatDate(data.oldDate) : ''} alle ${data.oldTime}\nA: ${data.newDate ? formatDate(data.newDate) : ''} alle ${data.newTime}`,
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // --- NUOVA PRENOTAZIONE ---
    const isFree = (data.price ?? 0) === 0;
    const isBankTransfer = data.paymentMethod === 'bank_transfer' && !data.isPaid;

    const paymentMethodMap: Record<string, string> = {
      stripe: 'Carta di Credito',
      paypal: 'PayPal',
      bank_transfer: 'Bonifico Bancario',
      none: 'Nessuno (Gratuito)',
    };

    const clientEmailData = {
      clientName: data.clientName,
      serviceName: data.serviceName ?? '',
      price: data.price ?? 0,
      date: data.date ?? '',
      time: data.time ?? '',
      notes: data.notes,
      isFree,
      isBankTransfer,
      managementToken: data.managementToken,
      isTest: !IS_PROD,
    };

    const adminEmailData = {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone ?? '',
      serviceName: data.serviceName ?? '',
      price: data.price ?? 0,
      date: data.date ?? '',
      time: data.time ?? '',
      notes: data.notes,
      paymentMethod: paymentMethodMap[data.paymentMethod ?? 'none'],
      isPaid: data.isPaid ?? false,
      isTest: !IS_PROD,
    };

    // Allega ICS solo per prenotazioni confermate (non bonifico in attesa)
    const attachments = !isBankTransfer && data.date && data.time ? [
      {
        filename: 'appuntamento.ics',
        content: icsToBase64(generateICS({
          title: `Consulenza Nutrizionale - ${data.serviceName}`,
          date: data.date,
          time: data.time,
          durationMinutes: data.durationMinutes ?? 60,
          description: data.notes,
        })),
        content_type: 'text/calendar',
      },
    ] : [];

    const clientEmailResult = await resend.emails.send({
      from: FROM,
      to: data.clientEmail,
      subject: isBankTransfer
        ? `${subjectPrefix}Richiesta Prenotazione Ricevuta - ${data.serviceName}`
        : `${subjectPrefix}Conferma Prenotazione - ${data.serviceName}`,
      html: getClientConfirmationEmailHTML(clientEmailData),
      text: getClientConfirmationEmailText(clientEmailData),
      attachments,
    });

    const adminEmailResult = await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `${subjectPrefix}🔔 Nuova Prenotazione: ${data.serviceName} - ${data.clientName}`,
      html: getAdminNotificationEmailHTML(adminEmailData),
      text: getAdminNotificationEmailText(adminEmailData),
    });

    return NextResponse.json({
      success: true,
      clientEmailId: clientEmailResult.data?.id,
      adminEmailId: adminEmailResult.data?.id,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Email sending error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send emails'
    }, { status: 500 });
  }
}
