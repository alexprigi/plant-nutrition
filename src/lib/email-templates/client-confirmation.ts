// Template email per conferma prenotazione cliente

interface EmailClientData {
  clientName: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  notes?: string;
  isFree: boolean;
  isBankTransfer: boolean;
  managementToken?: string;
  isTest?: boolean;
}

export function getClientConfirmationEmailHTML(data: EmailClientData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conferma Prenotazione</title>
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
            <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ${data.isBankTransfer ? '📋 Richiesta Ricevuta' : '✅ Prenotazione Confermata!'}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Ciao <strong>${data.clientName}</strong>,
              </p>
              
              ${data.isBankTransfer ? `
                <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                  Abbiamo ricevuto la tua richiesta di prenotazione. L'appuntamento sarà confermato dopo aver ricevuto il bonifico bancario.
                </p>
              ` : `
                <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                  ${data.isFree ? 'Il tuo colloquio gratuito è confermato!' : 'Il tuo appuntamento è stato confermato con successo!'}
                </p>
              `}

              <!-- Booking Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 12px; margin: 30px 0; border: 2px solid #E5E7EB;">
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
                      ${!data.isFree ? `
                        <tr>
                          <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Importo:</td>
                          <td style="color: #059669; font-size: 16px; text-align: right; font-weight: bold;">${data.price}€</td>
                        </tr>
                      ` : ''}
                      ${data.notes ? `
                        <tr>
                          <td colspan="2" style="padding-top: 15px; border-top: 1px solid #E5E7EB; margin-top: 10px;">
                            <p style="margin: 5px 0 0; font-size: 14px; color: #6B7280;">
                              <strong>Note:</strong><br/>
                              ${data.notes}
                            </p>
                          </td>
                        </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              ${data.isBankTransfer ? `
                <!-- Bank Transfer Instructions -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF3C7; border-radius: 12px; margin: 20px 0; border-left: 4px solid #F59E0B;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="margin: 0 0 15px; font-size: 16px; font-weight: bold; color: #92400E;">
                        💳 Istruzioni per il Bonifico
                      </h3>
                      <p style="margin: 0 0 10px; font-size: 14px; color: #78350F;">
                        Per confermare la prenotazione, effettua il bonifico ai seguenti dati:
                      </p>
                      <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 14px;">
                        <tr>
                          <td style="color: #92400E; font-weight: 600;">Beneficiario:</td>
                          <td style="color: #78350F;">Arianna Nutrizionista</td>
                        </tr>
                        <tr>
                          <td style="color: #92400E; font-weight: 600;">IBAN:</td>
                          <td style="color: #78350F; font-family: monospace;">IT00 X000 0000 0000 0000 0000 000</td>
                        </tr>
                        <tr>
                          <td style="color: #92400E; font-weight: 600;">Importo:</td>
                          <td style="color: #78350F; font-weight: bold;">${data.price}€</td>
                        </tr>
                        <tr>
                          <td style="color: #92400E; font-weight: 600;">Causale:</td>
                          <td style="color: #78350F;">Prenotazione ${data.serviceName} - ${data.clientName}</td>
                        </tr>
                      </table>
                      <p style="margin: 15px 0 0; font-size: 13px; color: #92400E; font-style: italic;">
                        ⏱️ L'appuntamento sarà confermato entro 24 ore dalla ricezione del bonifico.
                      </p>
                    </td>
                  </tr>
                </table>
              ` : ''}

              <!-- Next Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 15px; font-size: 18px; font-weight: bold; color: #111827;">
                      Prossimi Passi
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                      ${data.isFree ? `
                        <li>Prepara eventuali domande o obiettivi da discutere</li>
                      ` : `
                        <li>Porta con te eventuali referti medici o esami</li>
                        <li>Prepara un diario alimentare degli ultimi giorni (se possibile)</li>
                      `}
                      <li>In caso di necessità, contattami per modificare o cancellare l'appuntamento</li>
                    </ul>
                  </td>
                </tr>
              </table>

              ${data.managementToken ? `
                <!-- Manage Appointment -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 12px; margin: 25px 0; border: 1px solid #E5E7EB;">
                  <tr>
                    <td style="padding: 20px; text-align: center;">
                      <p style="margin: 0 0 12px; font-size: 14px; color: #6B7280;">
                        Hai bisogno di modificare l'appuntamento?
                      </p>
                      <a href="https://www.vivaplantnutrition.com/gestisci/${data.managementToken}" style="display: inline-block; background-color: #ffffff; color: #374151; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #D1D5DB;">
                        Gestisci appuntamento
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ''}

              <!-- Contact Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 25px; border-top: 1px solid #E5E7EB;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #6B7280;">
                      Hai domande? Contattami:
                    </p>
                    <p style="margin: 0; font-size: 14px;">
                      <a href="mailto:info@vivaplantnutrition.com" style="color: #059669; text-decoration: none; font-weight: 600;">info@vivaplantnutrition.com</a>
                      <span style="color: #D1D5DB; margin: 0 8px;">|</span>
                      <a href="tel:+393331234567" style="color: #059669; text-decoration: none; font-weight: 600;">+39 333 123 4567</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 25px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 5px; font-size: 12px; color: #9CA3AF;">
                Questa email è stata inviata da Viva Plant Nutrition
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

export function getClientConfirmationEmailText(data: EmailClientData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
${data.isBankTransfer ? 'RICHIESTA RICEVUTA' : 'PRENOTAZIONE CONFERMATA'}

Ciao ${data.clientName},

${data.isBankTransfer 
  ? 'Abbiamo ricevuto la tua richiesta di prenotazione. L\'appuntamento sarà confermato dopo aver ricevuto il bonifico bancario.'
  : data.isFree 
    ? 'Il tuo colloquio gratuito è confermato!' 
    : 'Il tuo appuntamento è stato confermato con successo!'
}

DETTAGLI APPUNTAMENTO
---------------------
Servizio: ${data.serviceName}
Data: ${formattedDate}
Orario: ${data.time}
${!data.isFree ? `Importo: ${data.price}€` : ''}
${data.notes ? `\nNote: ${data.notes}` : ''}

${data.isBankTransfer ? `
ISTRUZIONI PER IL BONIFICO
---------------------------
Per confermare la prenotazione, effettua il bonifico ai seguenti dati:

Beneficiario: Arianna Ciervo
IBAN: IT00 X000 0000 0000 0000 0000 000
Importo: ${data.price}€
Causale: Prenotazione ${data.serviceName} - ${data.clientName}

L'appuntamento sarà confermato entro 24 ore dalla ricezione del bonifico.
` : ''}

PROSSIMI PASSI
--------------
${data.isFree ? '- Prepara eventuali domande o obiettivi da discutere' : '- Porta con te eventuali referti medici o esami\n- Prepara un diario alimentare degli ultimi giorni (se possibile)'}
- In caso di necessità, contattami per modificare o cancellare l'appuntamento

${data.managementToken ? `GESTISCI APPUNTAMENTO
---------------------
Sposta o cancella: https://www.vivaplantnutrition.com/gestisci/${data.managementToken}

` : ''}CONTATTI
--------
Email: info@vivaplantnutrition.com
Telefono: +39 333 123 4567

---
Questa email è stata inviata da Viva Plant Nutrition
© 2026 Viva Plant Nutrition. Tutti i diritti riservati.
  `;
}
