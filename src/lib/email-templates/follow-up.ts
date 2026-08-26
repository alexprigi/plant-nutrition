interface FollowUpEmailData {
  clientName: string;
  serviceName: string;
  sessionsRemaining: number;
  followUpToken: string;
  isTest?: boolean;
}

const BASE_STYLE = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;`;

export function getFollowUpEmailHTML(data: FollowUpEmailData): string {
  const appUrl = process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com';
  const bookingUrl = `${appUrl}/booking/follow-up/${data.followUpToken}`;

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prenota il prossimo appuntamento</title>
</head>
<body style="margin: 0; padding: 0; ${BASE_STYLE} background-color: #F5F7F5;">
  ${data.isTest ? `
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF08A; border-bottom: 2px solid #EAB308;">
    <tr>
      <td style="padding: 10px 20px; text-align: center; font-size: 13px; font-weight: bold; color: #854D0E;">
        ⚠️ EMAIL DI TEST — Non inviata in produzione
      </td>
    </tr>
  </table>` : ''}
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
                📅 Prenota il prossimo appuntamento
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Ciao <strong>${data.clientName}</strong>,
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
                Ottimo lavoro! La tua ultima visita è andata alla grande. Hai ancora <strong>${data.sessionsRemaining} ${data.sessionsRemaining === 1 ? 'sessione rimasta' : 'sessioni rimaste'}</strong> nel tuo <strong>${data.serviceName}</strong>.
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
                Clicca il bottone qui sotto per scegliere data e orario del prossimo appuntamento.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${bookingUrl}" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: bold; font-size: 16px;">
                      Scegli la data
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #9CA3AF; text-align: center;">
                Questo link è personale e valido solo per te.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 25px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 5px; font-size: 12px; color: #9CA3AF;">Questa email è stata inviata da Viva Plant Nutrition</p>
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

export function getFollowUpEmailText(data: FollowUpEmailData): string {
  const appUrl = process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com';
  return `
Ciao ${data.clientName},

Ottimo lavoro! Hai ancora ${data.sessionsRemaining} ${data.sessionsRemaining === 1 ? 'sessione rimasta' : 'sessioni rimaste'} nel tuo ${data.serviceName}.

Prenota il prossimo appuntamento: ${appUrl}/booking/follow-up/${data.followUpToken}

Questo link è personale e valido solo per te.

---
Viva Plant Nutrition
`;
}
