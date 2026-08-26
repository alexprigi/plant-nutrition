// Template email per cron job giornaliero

interface ReminderEmailData {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  isFree?: boolean;
  managementToken?: string;
  isTest?: boolean;
}

interface ExpiredBankTransferEmailData {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  isTest?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

const BASE_STYLE = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;`;

function testBanner(isTest?: boolean) {
  if (!isTest) return '';
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF08A; border-bottom: 2px solid #EAB308;">
    <tr>
      <td style="padding: 10px 20px; text-align: center; font-size: 13px; font-weight: bold; color: #854D0E;">
        ⚠️ EMAIL DI TEST — Non inviata in produzione
      </td>
    </tr>
  </table>`;
}

function logoHeader() {
  return `
  <tr>
    <td style="background-color: #ffffff; padding: 20px 30px; text-align: center; border-bottom: 1px solid #E5E7EB;">
      <img src="https://www.vivaplantnutrition.com/images/logo_icon.png" alt="" width="44" height="50" style="display: inline-block; vertical-align: middle;">
      <img src="https://www.vivaplantnutrition.com/images/logo_text.png" alt="Viva Plant Nutrition" width="94" height="50" style="display: inline-block; vertical-align: middle; margin-left: 6px;">
    </td>
  </tr>`;
}

function footer() {
  return `
  <tr>
    <td style="background-color: #F9FAFB; padding: 25px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
      <p style="margin: 0 0 5px; font-size: 12px; color: #9CA3AF;">Questa email è stata inviata da Viva Plant Nutrition</p>
      <p style="margin: 0; font-size: 12px; color: #9CA3AF;">© 2026 Viva Plant Nutrition. Tutti i diritti riservati.</p>
    </td>
  </tr>`;
}

// --- PROMEMORIA 24H ---

export function getReminderEmailHTML(data: ReminderEmailData): string {
  const appUrl = process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com';
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Promemoria Appuntamento</title>
</head>
<body style="margin: 0; padding: 0; ${BASE_STYLE} background-color: #F5F7F5;">
  ${testBanner(data.isTest)}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F7F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          ${logoHeader()}
          <tr>
            <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔔 Promemoria Appuntamento</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Ciao <strong>${data.clientName}</strong>,
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
                Ti ricordiamo che tra 3 giorni hai un appuntamento con Arianna.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 12px; margin: 0 0 30px; border: 2px solid #E5E7EB;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Servizio:</td>
                        <td style="color: #111827; font-size: 14px; text-align: right;"><strong>${data.serviceName}</strong></td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Data:</td>
                        <td style="color: #111827; font-size: 14px; text-align: right;"><strong>${formatDate(data.date)}</strong></td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">Orario:</td>
                        <td style="color: #111827; font-size: 14px; text-align: right;"><strong>${data.time}</strong></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${!data.isFree ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ECFDF5; border-radius: 12px; margin: 0 0 20px; border: 1px solid #A7F3D0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 12px; font-size: 15px; font-weight: bold; color: #065F46;">📋 Cosa portare</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                      <li>Eventuali esami del sangue o referti medici recenti</li>
                      <li>Diario alimentare degli ultimi giorni (se possibile)</li>
                      <li>Lista dei farmaci o integratori che stai assumendo</li>
                    </ul>
                  </td>
                </tr>
              </table>
              ` : `
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ECFDF5; border-radius: 12px; margin: 0 0 20px; border: 1px solid #A7F3D0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 12px; font-size: 15px; font-weight: bold; color: #065F46;">💡 Come prepararti</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                      <li>Prepara eventuali domande o obiettivi che vuoi discutere</li>
                      <li>Pensa a cosa ti ha spinto a cercare supporto nutrizionale</li>
                    </ul>
                  </td>
                </tr>
              </table>
              `}

              ${data.managementToken ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 12px; border: 1px solid #E5E7EB;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6B7280;">Non riesci a venire?</p>
                    <a href="${appUrl}/gestisci/${data.managementToken}" style="display: inline-block; background-color: #ffffff; color: #374151; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #D1D5DB;">
                      Sposta o cancella l'appuntamento
                    </a>
                    ${!data.isFree ? `<p style="margin: 12px 0 0; font-size: 11px; color: #9CA3AF;">Consulta la <a href="${appUrl}/cancellation-policy" style="color: #9CA3AF;">policy di cancellazione</a> per info su rimborsi.</p>` : ''}
                  </td>
                </tr>
              </table>
              ` : ''}
            </td>
          </tr>
          ${footer()}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getReminderEmailText(data: ReminderEmailData): string {
  const appUrl = process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com';
  return `
PROMEMORIA APPUNTAMENTO

Ciao ${data.clientName},

Ti ricordiamo che tra 3 giorni hai un appuntamento con Arianna.

Servizio: ${data.serviceName}
Data: ${formatDate(data.date)}
Orario: ${data.time}

${!data.isFree
  ? 'COSA PORTARE\n- Eventuali esami del sangue o referti medici recenti\n- Diario alimentare degli ultimi giorni (se possibile)\n- Lista dei farmaci o integratori che stai assumendo'
  : 'COME PREPARARTI\n- Prepara eventuali domande o obiettivi che vuoi discutere\n- Pensa a cosa ti ha spinto a cercare supporto nutrizionale'}

${data.managementToken ? `Non riesci a venire? Sposta o cancella: ${appUrl}/gestisci/${data.managementToken}\n` : ''}
---
Viva Plant Nutrition
`;
}

// --- SCADENZA BONIFICO ---

export function getExpiredBankTransferEmailHTML(data: ExpiredBankTransferEmailData): string {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prenotazione Annullata</title>
</head>
<body style="margin: 0; padding: 0; ${BASE_STYLE} background-color: #F5F7F5;">
  ${testBanner(data.isTest)}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F7F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          ${logoHeader()}
          <tr>
            <td style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">⚠️ Prenotazione Annullata</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Ciao <strong>${data.clientName}</strong>,
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
                Non abbiamo ricevuto il bonifico entro 72 ore dalla prenotazione, quindi l'appuntamento è stato annullato automaticamente.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF3C7; border-radius: 12px; margin: 0 0 30px; border-left: 4px solid #F59E0B;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-weight: 600; color: #92400E; font-size: 14px;">Servizio:</td>
                        <td style="color: #78350F; font-size: 14px; text-align: right;">${data.serviceName}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #92400E; font-size: 14px;">Data:</td>
                        <td style="color: #78350F; font-size: 14px; text-align: right;">${formatDate(data.date)}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #92400E; font-size: 14px;">Orario:</td>
                        <td style="color: #78350F; font-size: 14px; text-align: right;">${data.time}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #374151;">
                Se vuoi, puoi effettuare una nuova prenotazione dal sito.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com'}/booking" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                      Prenota di nuovo
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${footer()}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getExpiredBankTransferEmailText(data: ExpiredBankTransferEmailData): string {
  return `
PRENOTAZIONE ANNULLATA

Ciao ${data.clientName},

Non abbiamo ricevuto il bonifico entro 72 ore dalla prenotazione, quindi l'appuntamento è stato annullato automaticamente.

Servizio: ${data.serviceName}
Data: ${formatDate(data.date)}
Orario: ${data.time}

Se vuoi, puoi effettuare una nuova prenotazione: ${process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com'}/booking

---
Viva Plant Nutrition
`;
}
