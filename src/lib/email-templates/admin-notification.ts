// Template email per notifica admin

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
                Notifica automatica da Plant Nutrition
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                © 2026 Plant Nutrition. Tutti i diritti riservati.
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
Notifica automatica da Plant Nutrition
© 2026 Plant Nutrition. Tutti i diritti riservati.
  `;
}
