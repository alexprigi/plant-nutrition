import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email';

interface ContactFormRequest {
  nome: string;
  email: string;
  telefono?: string;
  servizio: string;
  messaggio?: string;
}

const servizioLabels: Record<string, string> = {
  'consulenza-nutrizionale': 'Consulenza Nutrizionale',
  'transizione-graduale': 'Piano Transizione Graduale',
  'nutrizione-pediatrica': 'Nutrizione Pediatrica',
  'nutrizione-gravidanza': 'Nutrizione in Gravidanza',
  'nutrizione-sportiva': 'Nutrizione Sportiva',
  'corso-online': 'Corso Online',
  'workshop': 'Workshop',
  'altro': 'Altro',
};

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormRequest = await request.json();

    if (!data.nome || !data.email || !data.servizio || !data.messaggio) {
      return NextResponse.json({ success: false, error: 'Campi obbligatori mancanti' }, { status: 400 });
    }

    const servizioLabel = servizioLabels[data.servizio] ?? data.servizio;

    await resend.emails.send({
      from: 'Viva Plant Nutrition <info@vivaplantnutrition.com>',
      to: 'info@vivaplantnutrition.com',
      replyTo: data.email,
      subject: `📩 Nuovo Messaggio: ${servizioLabel} - ${data.nome}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #256943;">Nuovo messaggio dal form di contatto</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold;">Nome:</td><td style="padding: 8px;">${data.nome}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Telefono:</td><td style="padding: 8px;">${data.telefono || '—'}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold;">Servizio:</td><td style="padding: 8px;">${servizioLabel}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; vertical-align: top;">Messaggio:</td><td style="padding: 8px; white-space: pre-wrap;">${data.messaggio || '—'}</td></tr>
          </table>
        </div>
      `,
      text: `Nuovo messaggio dal form di contatto\n\nNome: ${data.nome}\nEmail: ${data.email}\nTelefono: ${data.telefono || '—'}\nServizio: ${servizioLabel}\nMessaggio: ${data.messaggio || '—'}`,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Contact email error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Errore invio email' }, { status: 500 });
  }
}
