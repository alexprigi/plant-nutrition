// Template email per notifica admin

const BASE_STYLE = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;`;

function adminLayout(content: string, headerColor: string, headerText: string, isTest?: boolean): string {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; ${BASE_STYLE} background-color: #F5F7F5;">
  ${isTest ? `
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF08A; border-bottom: 2px solid #EAB308;">
    <tr><td style="padding: 10px 20px; text-align: center; font-size: 13px; font-weight: bold; color: #854D0E;">⚠️ EMAIL DI TEST — Non inviata in produzione</td></tr>
  </table>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F7F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          <tr>
            <td style="background-color: #ffffff; padding: 20px 30px; text-align: center; border-bottom: 1px solid #E5E7EB;">
              <img src="https://www.vivaplantnutrition.com/images/logo_icon.png" alt="" width="44" height="50" style="display: inline-block; vertical-align: middle;">
              <img src="https://www.vivaplantnutrition.com/images/logo_text.png" alt="Viva Plant Nutrition" width="94" height="50" style="display: inline-block; vertical-align: middle; margin-left: 6px;">
            </td>
          </tr>
          <tr>
            <td style="background: ${headerColor}; padding: 32px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">${headerText}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://www.vivaplantnutrition.com/admin" style="display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                      Vai al Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F9FAFB; padding: 20px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #9CA3AF;">Notifica automatica da Viva Plant Nutrition</p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">© 2026 Viva Plant Nutrition. Tutti i diritti riservati.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function clientRow(label: string, value: string, link?: string): string {
  return `<tr>
    <td style="font-weight: 600; color: #6B7280; font-size: 14px; padding: 8px;">${label}:</td>
    <td style="color: #111827; font-size: 14px; text-align: right; padding: 8px;">${link ? `<a href="${link}" style="color: #2563EB; text-decoration: none;">${value}</a>` : `<strong>${value}</strong>`}</td>
  </tr>`;
}

export interface EmailAdminCancellationData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  date: string;
  time: string;
  isRefundable?: boolean;
  isTest?: boolean;
}

export function getAdminCancellationEmailHTML(data: EmailAdminCancellationData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">Ciao Arianna,</p>
    <p style="margin: 0 0 25px; font-size: 16px; color: #374151;">
      <strong>${data.clientName}</strong> ha cancellato il suo appuntamento.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF2F2; border-radius: 12px; margin: 0 0 20px; border: 2px solid #FECACA;">
      <tr><td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${clientRow('Cliente', data.clientName)}
          ${clientRow('Email', data.clientEmail, `mailto:${data.clientEmail}`)}
          ${data.clientPhone ? clientRow('Telefono', data.clientPhone, `tel:${data.clientPhone}`) : ''}
          ${clientRow('Data', formattedDate)}
          ${clientRow('Orario', data.time)}
        </table>
      </td></tr>
    </table>
    ${data.isRefundable ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF3C7; border-radius: 12px; border-left: 4px solid #F59E0B;">
      <tr><td style="padding: 16px;">
        <p style="margin: 0; font-size: 14px; color: #92400E;">⚠️ <strong>Il cliente ha diritto al rimborso completo.</strong> Ricordati di effettuare il rimborso.</p>
      </td></tr>
    </table>` : ''}`;
  return adminLayout(content, 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', '❌ Appuntamento Cancellato', data.isTest);
}

export interface EmailAdminRescheduleData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  oldDate: string;
  oldTime: string;
  newDate: string;
  newTime: string;
  isTest?: boolean;
}

export function getAdminRescheduleEmailHTML(data: EmailAdminRescheduleData): string {
  const fmt = (d: string) => new Date(d).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">Ciao Arianna,</p>
    <p style="margin: 0 0 25px; font-size: 16px; color: #374151;">
      <strong>${data.clientName}</strong> ha spostato il suo appuntamento.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #EFF6FF; border-radius: 12px; margin: 0 0 16px; border: 2px solid #BFDBFE;">
      <tr><td style="padding: 20px;">
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; color: #6B7280; text-transform: uppercase;">Cliente</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${clientRow('Nome', data.clientName)}
          ${clientRow('Email', data.clientEmail, `mailto:${data.clientEmail}`)}
          ${data.clientPhone ? clientRow('Telefono', data.clientPhone, `tel:${data.clientPhone}`) : ''}
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 12px; border: 2px solid #E5E7EB;">
      <tr><td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 8px; font-size: 14px; color: #6B7280; font-weight: 600;">Da:</td>
            <td style="padding: 8px; font-size: 14px; color: #374151; text-align: right; text-decoration: line-through;">${fmt(data.oldDate)} alle ${data.oldTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-size: 14px; color: #059669; font-weight: 600;">A:</td>
            <td style="padding: 8px; font-size: 14px; color: #059669; text-align: right; font-weight: bold;">${fmt(data.newDate)} alle ${data.newTime}</td>
          </tr>
        </table>
      </td></tr>
    </table>`;
  return adminLayout(content, 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', '📅 Appuntamento Spostato', data.isTest);
}

export interface EmailClientCancellationData {
  clientName: string;
  date: string;
  time: string;
  isRefundable?: boolean;
  isTest?: boolean;
}

export function getClientCancellationEmailHTML(data: EmailClientCancellationData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">Ciao <strong>${data.clientName}</strong>,</p>
    <p style="margin: 0 0 25px; font-size: 16px; color: #374151;">
      La cancellazione del tuo appuntamento è stata registrata.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 12px; margin: 0 0 20px; border: 2px solid #E5E7EB;">
      <tr><td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${clientRow('Data', formattedDate)}
          ${clientRow('Orario', data.time)}
        </table>
      </td></tr>
    </table>
    ${data.isRefundable ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ECFDF5; border-radius: 12px; border: 2px solid #A7F3D0; margin-bottom: 20px;">
      <tr><td style="padding: 16px;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #065F46; font-weight: bold;">Hai diritto al rimborso completo.</p>
        <p style="margin: 0; font-size: 14px; color: #065F46;">Contatta Arianna Ciervo a <a href="mailto:info@vivaplantnutrition.com" style="color: #059669;">info@vivaplantnutrition.com</a> per riceverlo.</p>
      </td></tr>
    </table>` : `
    <p style="margin: 0; font-size: 14px; color: #6B7280;">Se desideri prenotare un nuovo appuntamento, puoi farlo dal sito.</p>`}`;
  return adminLayout(content, 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)', '✅ Cancellazione Confermata', data.isTest);
}

export function getClientCancellationEmailText(data: EmailClientCancellationData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return `Ciao ${data.clientName},\n\nLa cancellazione del tuo appuntamento del ${formattedDate} alle ${data.time} è stata registrata.${data.isRefundable ? '\n\nHai diritto al rimborso completo. Contatta Arianna Ciervo a info@vivaplantnutrition.com per riceverlo.' : '\n\nSe desideri prenotare un nuovo appuntamento, puoi farlo dal sito.'}\n\n---\nViva Plant Nutrition`;
}

interface EmailAdminData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  notes?: string;
  paymentMethod: string;
  isPaid: boolean;
  isTest?: boolean;
}

export function getAdminNotificationEmailHTML(data: EmailAdminData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const paymentStatusColor = data.isPaid ? '#059669' : '#F59E0B';
  const paymentStatusText = data.isPaid ? '✅ Pagato' : '⏳ In attesa';

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuova Prenotazione</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F5F7F5;">
  ${data.isTest ? `
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF08A; border-bottom: 2px solid #EAB308;">
    <tr>
      <td style="padding: 10px 20px; text-align: center; font-size: 13px; font-weight: bold; color: #854D0E;">
        ⚠️ EMAIL DI TEST — Non inviata in produzione
      </td>
    </tr>
  </table>
  ` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F7F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Logo -->
          <tr>
            <td style="background-color: #ffffff; padding: 20px 30px; text-align: center; border-bottom: 1px solid #E5E7EB;">
              <img src="https://www.vivaplantnutrition.com/images/logo_icon.png" alt="" width="44" height="50" style="display: inline-block; vertical-align: middle;">
              <img src="https://www.vivaplantnutrition.com/images/logo_text.png" alt="Viva Plant Nutrition" width="94" height="50" style="display: inline-block; vertical-align: middle; margin-left: 6px;">
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🔔 Nuova Prenotazione Ricevuta
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Ciao Arianna,
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hai ricevuto una nuova prenotazione da <strong>${data.clientName}</strong>.
              </p>

              <!-- Client Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #EFF6FF; border-radius: 12px; margin: 20px 0; border: 2px solid #BFDBFE;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: bold; color: #1E40AF;">
                      👤 Dati Cliente
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Nome:</td>
                        <td style="color: #111827; font-size: 14px; text-align: right;"><strong>${data.clientName}</strong></td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Email:</td>
                        <td style="text-align: right;">
                          <a href="mailto:${data.clientEmail}" style="color: #2563EB; text-decoration: none; font-size: 14px;">${data.clientEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Telefono:</td>
                        <td style="text-align: right;">
                          <a href="tel:${data.clientPhone}" style="color: #2563EB; text-decoration: none; font-size: 14px;">${data.clientPhone}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Appointment Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 12px; margin: 20px 0; border: 2px solid #E5E7EB;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: bold; color: #111827;">
                      📅 Dettagli Appuntamento
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Servizio:</td>
                        <td style="color: #111827; font-size: 14px; text-align: right;"><strong>${data.serviceName}</strong></td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Data:</td>
                        <td style="color: #111827; font-size: 14px; text-align: right;"><strong>${formattedDate}</strong></td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Orario:</td>
                        <td style="color: #111827; font-size: 14px; text-align: right;"><strong>${data.time}</strong></td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Importo:</td>
                        <td style="color: #111827; font-size: 16px; text-align: right; font-weight: bold;">${data.price === 0 ? 'Gratuito' : `${data.price}€`}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Metodo Pagamento:</td>
                        <td style="color: #111827; font-size: 14px; text-align: right;">${data.paymentMethod}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Stato Pagamento:</td>
                        <td style="text-align: right;">
                          <span style="color: ${paymentStatusColor}; font-weight: bold; font-size: 14px;">${paymentStatusText}</span>
                        </td>
                      </tr>
                      ${data.notes ? `
                        <tr>
                          <td colspan="2" style="padding-top: 15px; border-top: 1px solid #E5E7EB; margin-top: 10px;">
                            <p style="margin: 5px 0 0; font-size: 14px; color: #6B7280;">
                              <strong>Note del cliente:</strong><br/>
                              <em>${data.notes}</em>
                            </p>
                          </td>
                        </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Quick Actions -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://www.vivaplantnutrition.com/admin" style="display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                      Visualizza nel Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              ${!data.isPaid && data.price > 0 ? `
                <!-- Payment Warning -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF3C7; border-radius: 12px; margin: 25px 0 0; border-left: 4px solid #F59E0B;">
                  <tr>
                    <td style="padding: 20px;">
                      <p style="margin: 0; font-size: 14px; color: #92400E;">
                        ⚠️ <strong>Attenzione:</strong> Il pagamento è ancora in sospeso. Ricordati di verificare quando ricevi il bonifico.
                      </p>
                    </td>
                  </tr>
                </table>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 25px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 5px; font-size: 12px; color: #9CA3AF;">
                Notifica automatica da Viva Plant Nutrition
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                © 2026 Viva Plant Nutrition. Tutti i diritti riservati.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export interface EmailAdminExpiredBankTransferData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceName: string;
  date: string;
  time: string;
  isTest?: boolean;
}

export function getAdminExpiredBankTransferEmailHTML(data: EmailAdminExpiredBankTransferData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const content = `
    <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">Ciao Arianna,</p>
    <p style="margin: 0 0 25px; font-size: 16px; color: #374151;">
      La prenotazione di <strong>${data.clientName}</strong> per <strong>${data.serviceName}</strong> è stata annullata automaticamente per mancato pagamento del bonifico entro 72 ore.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF3C7; border-radius: 12px; margin: 0 0 20px; border: 2px solid #FCD34D;">
      <tr><td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${clientRow('Cliente', data.clientName)}
          ${clientRow('Email', data.clientEmail, `mailto:${data.clientEmail}`)}
          ${data.clientPhone ? clientRow('Telefono', data.clientPhone, `tel:${data.clientPhone}`) : ''}
          ${clientRow('Servizio', data.serviceName)}
          ${clientRow('Data', formattedDate)}
          ${clientRow('Orario', data.time)}
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF2F2; border-radius: 12px; border-left: 4px solid #EF4444;">
      <tr><td style="padding: 16px;">
        <p style="margin: 0; font-size: 14px; color: #991B1B;">⚠️ Lo slot è stato liberato automaticamente. Il cliente ha ricevuto email di notifica.</p>
      </td></tr>
    </table>`;
  return adminLayout(content, 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', '⏰ Bonifico Scaduto — Prenotazione Annullata', data.isTest);
}

export function getAdminExpiredBankTransferEmailText(data: EmailAdminExpiredBankTransferData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return `BONIFICO SCADUTO — PRENOTAZIONE ANNULLATA\n\nCiao Arianna,\n\nLa prenotazione di ${data.clientName} per ${data.serviceName} del ${formattedDate} alle ${data.time} è stata annullata automaticamente per mancato pagamento del bonifico entro 72 ore.\n\nEmail cliente: ${data.clientEmail}${data.clientPhone ? `\nTelefono: ${data.clientPhone}` : ''}\n\nLo slot è stato liberato automaticamente. Il cliente ha ricevuto email di notifica.\n\nVisualizza nel dashboard: https://www.vivaplantnutrition.com/admin\n\n---\nNotifica automatica da Viva Plant Nutrition`;
}

export function getAdminNotificationEmailText(data: EmailAdminData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
NUOVA PRENOTAZIONE RICEVUTA

Ciao Arianna,

Hai ricevuto una nuova prenotazione da ${data.clientName}.

DATI CLIENTE
------------
Nome: ${data.clientName}
Email: ${data.clientEmail}
Telefono: ${data.clientPhone}

DETTAGLI APPUNTAMENTO
---------------------
Servizio: ${data.serviceName}
Data: ${formattedDate}
Orario: ${data.time}
Importo: ${data.price === 0 ? 'Gratuito' : `${data.price}€`}
Metodo Pagamento: ${data.paymentMethod}
Stato Pagamento: ${data.isPaid ? 'Pagato' : 'In attesa'}

${data.notes ? `Note del cliente:\n${data.notes}\n\n` : ''}

Visualizza nel dashboard: https://www.vivaplantnutrition.com/admin

${!data.isPaid && data.price > 0 ? '\nATTENZIONE: Il pagamento è ancora in sospeso. Ricordati di verificare quando ricevi il bonifico.\n' : ''}

---
Notifica automatica da Viva Plant Nutrition
© 2026 Viva Plant Nutrition. Tutti i diritti riservati.
  `;
}
