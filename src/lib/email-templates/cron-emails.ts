import { getT, getEmailLocale, formatEmailDate } from './email-i18n'

interface ReminderEmailData {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  isFree?: boolean;
  managementToken?: string;
  isTest?: boolean;
  locale?: string;
}

interface ExpiredBankTransferEmailData {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  isTest?: boolean;
  locale?: string;
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

function footer(locale?: string) {
  const t = getT(locale)
  return `
  <tr>
    <td style="background-color: #F9FAFB; padding: 25px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
      <p style="margin: 0 0 5px; font-size: 12px; color: #9CA3AF;">${t.footer1}</p>
      <p style="margin: 0; font-size: 12px; color: #9CA3AF;">${t.footer2}</p>
    </td>
  </tr>`;
}

// --- PROMEMORIA 3 GIORNI ---

export function getReminderEmailHTML(data: ReminderEmailData): string {
  const locale = getEmailLocale(data.locale)
  const t = getT(locale)
  const appUrl = process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com';
  const formattedDate = formatEmailDate(data.date, locale)

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.reminderTitle}</title>
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
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${t.reminderTitle}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                ${t.greeting} <strong>${data.clientName}</strong>,
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
                ${t.reminderBody}
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 12px; margin: 0 0 30px; border: 2px solid #E5E7EB;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">${t.service}:</td>
                        <td style="color: #111827; font-size: 14px; text-align: right;"><strong>${data.serviceName}</strong></td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">${t.date}:</td>
                        <td style="color: #111827; font-size: 14px; text-align: right;"><strong>${formattedDate}</strong></td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #6B7280; font-size: 14px;">${t.time}:</td>
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
                    <h3 style="margin: 0 0 12px; font-size: 15px; font-weight: bold; color: #065F46;">${t.reminderBringTitle}</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                      ${t.reminderBring.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </td>
                </tr>
              </table>
              ` : `
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ECFDF5; border-radius: 12px; margin: 0 0 20px; border: 1px solid #A7F3D0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 12px; font-size: 15px; font-weight: bold; color: #065F46;">${t.reminderPrepTitle}</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                      ${t.reminderPrep.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </td>
                </tr>
              </table>
              `}

              ${data.managementToken ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 12px; border: 1px solid #E5E7EB;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6B7280;">${t.cantCome}</p>
                    <a href="${appUrl}/gestisci/${data.managementToken}" style="display: inline-block; background-color: #ffffff; color: #374151; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #D1D5DB;">
                      ${t.rescheduleCancel}
                    </a>
                    ${!data.isFree ? `<p style="margin: 12px 0 0; font-size: 11px; color: #9CA3AF;">${t.policyReminder(appUrl)}</p>` : ''}
                  </td>
                </tr>
              </table>
              ` : ''}
            </td>
          </tr>
          ${footer(data.locale)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getReminderEmailText(data: ReminderEmailData): string {
  const locale = getEmailLocale(data.locale)
  const t = getT(locale)
  const appUrl = process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com';
  const formattedDate = formatEmailDate(data.date, locale)

  return `
${t.reminderTitle}

${t.greeting} ${data.clientName},

${t.reminderBody}

${t.service}: ${data.serviceName}
${t.date}: ${formattedDate}
${t.time}: ${data.time}

${!data.isFree
  ? `${t.reminderBringTitle}\n${t.reminderBring.map(i => `- ${i}`).join('\n')}`
  : `${t.reminderPrepTitle}\n${t.reminderPrep.map(i => `- ${i}`).join('\n')}`}

${data.managementToken ? `${t.cantCome} ${appUrl}/gestisci/${data.managementToken}\n` : ''}
---
Viva Plant Nutrition
`;
}

// --- SCADENZA BONIFICO ---

export function getExpiredBankTransferEmailHTML(data: ExpiredBankTransferEmailData): string {
  const locale = getEmailLocale(data.locale)
  const t = getT(locale)
  const formattedDate = formatEmailDate(data.date, locale)
  const appUrl = process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com'

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.expiredTitle}</title>
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
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${t.expiredTitle}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                ${t.greeting} <strong>${data.clientName}</strong>,
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
                ${t.expiredBody}
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FEF3C7; border-radius: 12px; margin: 0 0 30px; border-left: 4px solid #F59E0B;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-weight: 600; color: #92400E; font-size: 14px;">${t.service}:</td>
                        <td style="color: #78350F; font-size: 14px; text-align: right;">${data.serviceName}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #92400E; font-size: 14px;">${t.date}:</td>
                        <td style="color: #78350F; font-size: 14px; text-align: right;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #92400E; font-size: 14px;">${t.time}:</td>
                        <td style="color: #78350F; font-size: 14px; text-align: right;">${data.time}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #374151;">
                ${t.expiredBookAgain}
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/de/prenota" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                      ${t.expiredCta}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${footer(data.locale)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getExpiredBankTransferEmailText(data: ExpiredBankTransferEmailData): string {
  const locale = getEmailLocale(data.locale)
  const t = getT(locale)
  const formattedDate = formatEmailDate(data.date, locale)
  const appUrl = process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com'

  return `
${t.expiredTitle}

${t.greeting} ${data.clientName},

${t.expiredBody}

${t.service}: ${data.serviceName}
${t.date}: ${formattedDate}
${t.time}: ${data.time}

${t.expiredBookAgain} ${appUrl}/de/prenota

---
Viva Plant Nutrition
`;
}
