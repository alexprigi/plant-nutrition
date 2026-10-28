import { getT, getEmailLocale, formatEmailDate } from './email-i18n'

interface EmailClientData {
  clientName: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  notes?: string;
  isFree: boolean;
  isFollowUp?: boolean;
  isBankTransfer: boolean;
  managementToken?: string;
  isTest?: boolean;
  locale?: string;
}

export function getClientConfirmationEmailHTML(data: EmailClientData): string {
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
  <title>${data.isBankTransfer ? t.bankTransferPending : t.confirmed}</title>
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
                ${data.isBankTransfer ? t.bankTransferPending : t.confirmed}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                ${t.greeting} <strong>${data.clientName}</strong>,
              </p>

              ${data.isBankTransfer ? `
                <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                  ${t.bodyBankTransfer}
                </p>
              ` : `
                <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                  ${data.isFollowUp ? t.bodyFollowUp : data.isFree ? t.bodyFree : t.bodyPaid}
                </p>
              `}

              <!-- Booking Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 12px; margin: 30px 0; border: 2px solid #E5E7EB;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: bold; color: #111827;">
                      ${t.detailsTitle}
                    </h2>

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
                      ${!data.isFree ? `
                        <tr>
                          <td style="font-weight: 600; color: #6B7280; font-size: 14px;">${t.amount}:</td>
                          <td style="color: #059669; font-size: 16px; text-align: right; font-weight: bold;">${data.price}€</td>
                        </tr>
                      ` : ''}
                      ${data.notes ? `
                        <tr>
                          <td colspan="2" style="padding-top: 15px; border-top: 1px solid #E5E7EB; margin-top: 10px;">
                            <p style="margin: 5px 0 0; font-size: 14px; color: #6B7280;">
                              <strong>${t.notes}:</strong><br/>
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
                        ${t.bankTitle}
                      </h3>
                      <p style="margin: 0 0 10px; font-size: 14px; color: #78350F;">
                        ${t.bankBody}
                      </p>
                      <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 14px;">
                        <tr>
                          <td style="color: #92400E; font-weight: 600;">${t.bankBeneficiary}:</td>
                          <td style="color: #78350F;">Arianna Ciervo</td>
                        </tr>
                        <tr>
                          <td style="color: #92400E; font-weight: 600;">IBAN:</td>
                          <td style="color: #78350F; font-family: monospace;">DE14 1001 1001 2175 0735 33</td>
                        </tr>
                        <tr>
                          <td style="color: #92400E; font-weight: 600;">${t.amount}:</td>
                          <td style="color: #78350F; font-weight: bold;">${data.price}€</td>
                        </tr>
                        <tr>
                          <td style="color: #92400E; font-weight: 600;">${t.bankReason}:</td>
                          <td style="color: #78350F;">${t.bankReasonValue(data.serviceName, data.clientName)}</td>
                        </tr>
                      </table>
                      <p style="margin: 15px 0 0; font-size: 13px; color: #92400E; font-style: italic;">
                        ${t.bankNote}
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
                      ${t.nextSteps}
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                      ${data.isFree ? `
                        <li>${t.stepFree}</li>
                      ` : data.isBankTransfer ? `
                        <li>${t.stepBankExpire}</li>
                        <li>${t.stepBankEmail}</li>
                      ` : `
                        <li>${t.stepPaid1}</li>
                        <li>${t.stepPaid2}</li>
                      `}
                      ${data.managementToken && !data.isBankTransfer ? `<li>${t.stepManage}</li>` : ''}
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
                        ${t.manageQuestion}
                      </p>
                      <a href="${appUrl}/gestisci/${data.managementToken}" style="display: inline-block; background-color: #ffffff; color: #374151; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #D1D5DB;">
                        ${t.manageCta}
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ''}

              <!-- Policy -->
              ${!data.isFree ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                      ${t.policyText(appUrl)}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Contact Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 25px; border-top: 1px solid #E5E7EB;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #6B7280;">
                      ${t.contact}
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
                ${t.footer1}
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                ${t.footer2}
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
  const locale = getEmailLocale(data.locale)
  const t = getT(locale)
  const formattedDate = formatEmailDate(data.date, locale)

  return `
${data.isBankTransfer ? t.bankTransferPending : t.confirmed}

${t.greeting} ${data.clientName},

${data.isBankTransfer
  ? t.bodyBankTransfer
  : data.isFollowUp
    ? t.bodyFollowUp
    : data.isFree
      ? t.bodyFree
      : t.bodyPaid
}

${t.detailsTitle}
---------------------
${t.service}: ${data.serviceName}
${t.date}: ${formattedDate}
${t.time}: ${data.time}
${!data.isFree ? `${t.amount}: ${data.price}€` : ''}
${data.notes ? `\n${t.notes}: ${data.notes}` : ''}

${data.isBankTransfer ? `
${t.bankTitle}
---------------------------
${t.bankBody}

${t.bankBeneficiary}: Arianna Ciervo
IBAN: DE14 1001 1001 2175 0735 33
${t.amount}: ${data.price}€
${t.bankReason}: ${t.bankReasonValue(data.serviceName, data.clientName)}

${t.bankNote}
` : ''}

${t.nextSteps}
--------------
${data.isFree
  ? `- ${t.stepFree}`
  : data.isBankTransfer
    ? `- ${t.stepBankExpire.replace(/<[^>]+>/g, '')}\n- ${t.stepBankEmail}`
    : `- ${t.stepPaid1}\n- ${t.stepPaid2}`}
${data.managementToken && !data.isBankTransfer ? `- ${t.stepManage}` : ''}

${data.managementToken ? `${t.manageCta}
---------------------
${process.env.AUTH_URL ?? 'https://www.vivaplantnutrition.com'}/gestisci/${data.managementToken}

` : ''}${t.contact}
--------
Email: info@vivaplantnutrition.com

---
${t.footer1}
${t.footer2}
  `;
}
