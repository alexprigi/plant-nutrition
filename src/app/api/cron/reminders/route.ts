import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/email'
import { getSubscriptionLabel } from '@/lib/bookingService'
import type { SubscriptionType } from '@/lib/bookingService'
import {
  getReminderEmailHTML,
  getReminderEmailText,
  getExpiredBankTransferEmailHTML,
  getExpiredBankTransferEmailText,
} from '@/lib/email-templates/cron-emails'

const FROM = 'Viva Plant Nutrition <info@vivaplantnutrition.com>'
const ADMIN_EMAIL = 'info@vivaplantnutrition.com'
const IS_PROD = process.env.AUTH_URL === 'https://www.vivaplantnutrition.com'
const subjectPrefix = IS_PROD ? '' : '[TEST] '

const SUB_TYPE_MAP: Record<string, SubscriptionType> = {
  FREE_CONSULTATION: 'free-consultation',
  SINGLE_SESSION: 'single-session',
  BUNDLE_3_MONTHS: 'bundle-3-months',
  BUNDLE_6_MONTHS: 'bundle-6-months',
}

export async function GET(request: NextRequest) {
  // Verifica CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const results = { reminders: 0, expired: 0, errors: 0 }

  // --- 1. PROMEMORIA 3 GIORNI PRIMA ---
  const inThreeDays = new Date()
  inThreeDays.setDate(inThreeDays.getDate() + 3)
  const pad = (n: number) => String(n).padStart(2, '0')
  const inThreeDaysStr = `${inThreeDays.getFullYear()}-${pad(inThreeDays.getMonth() + 1)}-${pad(inThreeDays.getDate())}`

  const appointmentsTomorrow = await prisma.appointment.findMany({
    where: {
      date: inThreeDaysStr,
      status: 'CONFIRMED',
      isDeleted: false,
    },
    include: {
      client: true,
      subscription: true,
    },
  })

  for (const appt of appointmentsTomorrow) {
    try {
      const serviceName = getSubscriptionLabel(SUB_TYPE_MAP[appt.subscription.type] ?? 'single-session')
      const isFree = appt.subscription.type === 'FREE_CONSULTATION'
      const clientName = `${appt.client.name} ${appt.client.surname}`
      await resend.emails.send({
        from: FROM,
        to: appt.client.email,
        subject: `${subjectPrefix}🔔 Promemoria: appuntamento tra 3 giorni alle ${appt.time}`,
        html: getReminderEmailHTML({
          clientName,
          serviceName,
          date: appt.date,
          time: appt.time,
          isFree,
          managementToken: appt.managementToken,
          isTest: !IS_PROD,
        }),
        text: getReminderEmailText({
          clientName,
          serviceName,
          date: appt.date,
          time: appt.time,
          isFree,
          managementToken: appt.managementToken,
          isTest: !IS_PROD,
        }),
      })
      results.reminders++
    } catch {
      results.errors++
    }
  }

  // --- 2. SCADENZA BONIFICI (PENDING > 72H) ---
  const expiredThreshold = new Date()
  expiredThreshold.setHours(expiredThreshold.getHours() - 72)

  const expiredAppointments = await prisma.appointment.findMany({
    where: {
      status: 'PENDING',
      createdAt: { lt: expiredThreshold },
      isDeleted: false,
    },
    include: {
      client: true,
      subscription: true,
    },
  })

  for (const appt of expiredAppointments) {
    try {
      // Cancella appuntamento
      await prisma.appointment.update({
        where: { id: appt.id },
        data: { status: 'CANCELLED' },
      })

      const serviceName = getSubscriptionLabel(SUB_TYPE_MAP[appt.subscription.type] ?? 'single-session')
      const clientName = `${appt.client.name} ${appt.client.surname}`

      // Email al cliente
      await resend.emails.send({
        from: FROM,
        to: appt.client.email,
        subject: `${subjectPrefix}Prenotazione annullata — ${serviceName}`,
        html: getExpiredBankTransferEmailHTML({
          clientName,
          serviceName,
          date: appt.date,
          time: appt.time,
          isTest: !IS_PROD,
        }),
        text: getExpiredBankTransferEmailText({
          clientName,
          serviceName,
          date: appt.date,
          time: appt.time,
          isTest: !IS_PROD,
        }),
      })

      // Notifica ad Arianna
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `${subjectPrefix}⚠️ Prenotazione scaduta — ${clientName}`,
        html: `<p>La prenotazione di <strong>${clientName}</strong> per <strong>${serviceName}</strong> del <strong>${appt.date} alle ${appt.time}</strong> è stata annullata automaticamente per mancato pagamento del bonifico.</p>`,
        text: `La prenotazione di ${clientName} per ${serviceName} del ${appt.date} alle ${appt.time} è stata annullata automaticamente per mancato pagamento del bonifico.`,
      })

      results.expired++
    } catch {
      results.errors++
    }
  }

  // --- 3. SCADENZA PERCORSI ---
  await prisma.subscription.updateMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { lt: new Date() },
    },
    data: { status: 'EXHAUSTED' },
  })

  return NextResponse.json({ success: true, ...results })
}
