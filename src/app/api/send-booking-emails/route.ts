import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email';
import { getT } from '@/lib/email-templates/email-i18n';
import {
  getClientConfirmationEmailHTML,
  getClientConfirmationEmailText,
} from '@/lib/email-templates/client-confirmation';
import {
  getAdminNotificationEmailHTML,
  getAdminNotificationEmailText,
  getAdminCancellationEmailHTML,
  getAdminRescheduleEmailHTML,
  getClientCancellationEmailHTML,
  getClientCancellationEmailText,
} from '@/lib/email-templates/admin-notification';
import { generateICS, icsToBase64 } from '@/lib/ics';

interface SendBookingEmailsRequest {
  type?: 'booking' | 'cancellation' | 'cancellation-client' | 'reschedule';
  isRefundable?: boolean;
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
  // Sessione di un percorso già pagato (prezzo 0, ma non è un colloquio gratuito)
  isFollowUp?: boolean;
  managementToken?: string;
  durationMinutes?: number;
  // Reschedule
  oldDate?: string;
  oldTime?: string;
  newDate?: string;
  newTime?: string;
  // Locale for client-facing emails
  locale?: string;
}

const ADMIN_EMAIL = 'info@vivaplantnutrition.com';
const FROM = 'Viva Plant Nutrition <info@vivaplantnutrition.com>';
const IS_PROD = process.env.AUTH_URL === 'https://www.vivaplantnutrition.com';
const subjectPrefix = IS_PROD ? '' : '[TEST] ';

type SendParams = Parameters<typeof resend.emails.send>[0];

// Resend non lancia eccezioni: restituisce { error }. Lo trasformiamo in eccezione per non perdere i fallimenti.
async function sendEmail(params: SendParams) {
  const result = await resend.emails.send(params);
  if (result.error) {
    throw new Error(`Resend error (${params.subject}): ${result.error.message}`);
  }
  return result;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export async function POST(request: NextRequest) {
  try {
    const data: SendBookingEmailsRequest = await request.json();
    const type = data.type ?? 'booking';

    // --- CANCELLAZIONE (notifica Arianna) ---
    if (type === 'cancellation') {
      await sendEmail({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `${subjectPrefix}❌ Appuntamento cancellato - ${data.clientName}`,
        html: getAdminCancellationEmailHTML({
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          date: data.date ?? '',
          time: data.time ?? '',
          isRefundable: data.isRefundable,
          isTest: !IS_PROD,
        }),
        text: `Il cliente ${data.clientName} ha cancellato l'appuntamento del ${data.date ? formatDate(data.date) : ''} alle ${data.time}.${data.isRefundable ? ' Ha diritto al rimborso completo.' : ''}`,
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // --- CANCELLAZIONE (conferma al cliente) ---
    if (type === 'cancellation-client') {
      const cancellationData = {
        clientName: data.clientName,
        date: data.date ?? '',
        time: data.time ?? '',
        isRefundable: data.isRefundable,
        isTest: !IS_PROD,
        locale: data.locale,
      };
      await sendEmail({
        from: FROM,
        to: data.clientEmail,
        subject: `${subjectPrefix}${getT(data.locale).subjCancelConfirmed}`,
        html: getClientCancellationEmailHTML(cancellationData),
        text: getClientCancellationEmailText(cancellationData),
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // --- SPOSTAMENTO ---
    if (type === 'reschedule') {
      await sendEmail({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `${subjectPrefix}📅 Appuntamento spostato - ${data.clientName}`,
        html: getAdminRescheduleEmailHTML({
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          oldDate: data.oldDate ?? '',
          oldTime: data.oldTime ?? '',
          newDate: data.newDate ?? '',
          newTime: data.newTime ?? '',
          isTest: !IS_PROD,
        }),
        text: `Il cliente ${data.clientName} ha spostato l'appuntamento.\nDa: ${data.oldDate ? formatDate(data.oldDate) : ''} alle ${data.oldTime}\nA: ${data.newDate ? formatDate(data.newDate) : ''} alle ${data.newTime}`,
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
      isFollowUp: data.isFollowUp,
      isBankTransfer,
      managementToken: data.managementToken,
      isTest: !IS_PROD,
      locale: data.locale,
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

    const clientEmailResult = await sendEmail({
      from: FROM,
      to: data.clientEmail,
      subject: isBankTransfer
        ? `${subjectPrefix}${getT(data.locale).subjBankRequest(data.serviceName ?? '')}`
        : `${subjectPrefix}${getT(data.locale).subjConfirm(data.serviceName ?? '')}`,
      html: getClientConfirmationEmailHTML(clientEmailData),
      text: getClientConfirmationEmailText(clientEmailData),
      attachments,
    });

    const adminEmailResult = await sendEmail({
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
