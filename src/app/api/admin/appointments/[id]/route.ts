import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { resend } from '@/lib/email'
import type { AppointmentStatus } from '@prisma/client'
import { getSubscriptionLabel } from '@/lib/bookingService'
import type { SubscriptionType } from '@/lib/bookingService'
import { getFollowUpEmailHTML, getFollowUpEmailText } from '@/lib/email-templates/follow-up'

const FROM = 'Viva Plant Nutrition <info@vivaplantnutrition.com>'
const IS_PROD = process.env.AUTH_URL === 'https://www.vivaplantnutrition.com'
const subjectPrefix = IS_PROD ? '' : '[TEST] '

const SUB_TYPE_MAP: Record<string, SubscriptionType> = {
  FREE_CONSULTATION: 'free-consultation',
  SINGLE_SESSION: 'single-session',
  BUNDLE_3_MONTHS: 'bundle-3-months',
  BUNDLE_6_MONTHS: 'bundle-6-months',
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  // Aggiorna stato appuntamento
  if (body.status) {
    const statusMap: Record<string, AppointmentStatus> = {
      pending: 'PENDING',
      confirmed: 'CONFIRMED',
      cancelled: 'CANCELLED',
      completed: 'COMPLETED',
    }

    const prismaStatus = statusMap[body.status]
    if (!prismaStatus) {
      return NextResponse.json({ error: 'Stato non valido' }, { status: 400 })
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: prismaStatus },
      include: { client: true, subscription: true },
    })

    // Se segnato come completato, incrementa usedSessions e manda email follow-up se ci sono sessioni rimaste
    if (prismaStatus === 'COMPLETED') {
      const sub = appointment.subscription
      const newUsedSessions = sub.usedSessions + 1
      const sessionsRemaining = sub.totalSessions - newUsedSessions
      const isBundleType = sub.type === 'BUNDLE_3_MONTHS' || sub.type === 'BUNDLE_6_MONTHS'

      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          usedSessions: newUsedSessions,
          status: sessionsRemaining <= 0 ? 'EXHAUSTED' : 'ACTIVE',
        },
      })

      if (isBundleType && sessionsRemaining > 0 && sub.followUpToken) {
        const serviceName = getSubscriptionLabel(SUB_TYPE_MAP[sub.type] ?? 'single-session')
        resend.emails.send({
          from: FROM,
          to: appointment.client.email,
          subject: `${subjectPrefix}📅 Prenota il prossimo appuntamento — ${sessionsRemaining} ${sessionsRemaining === 1 ? 'sessione rimasta' : 'sessioni rimaste'}`,
          html: getFollowUpEmailHTML({
            clientName: `${appointment.client.name} ${appointment.client.surname}`,
            serviceName,
            sessionsRemaining,
            followUpToken: sub.followUpToken,
            isTest: !IS_PROD,
          }),
          text: getFollowUpEmailText({
            clientName: `${appointment.client.name} ${appointment.client.surname}`,
            serviceName,
            sessionsRemaining,
            followUpToken: sub.followUpToken,
            isTest: !IS_PROD,
          }),
        }).catch(() => {})
      }
    }

    return NextResponse.json(appointment)
  }

  // Segna come pagato
  if (body.isPaid === true) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        subscription: true,
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appuntamento non trovato' }, { status: 404 })
    }

    await prisma.subscription.update({
      where: { id: appointment.subscriptionId },
      data: { isPaid: true },
    })

    // Se era pending, passa a confirmed
    if (appointment.status === 'PENDING') {
      await prisma.appointment.update({
        where: { id },
        data: { status: 'CONFIRMED' },
      })
    }

    // Manda email di conferma al cliente
    const subTypeMap: Record<string, SubscriptionType> = {
      FREE_CONSULTATION: 'free-consultation',
      SINGLE_SESSION: 'single-session',
      BUNDLE_3_MONTHS: 'bundle-3-months',
      BUNDLE_6_MONTHS: 'bundle-6-months',
    }
    fetch(`${process.env.AUTH_URL}/api/send-booking-emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: `${appointment.client.name} ${appointment.client.surname}`,
        clientEmail: appointment.client.email,
        clientPhone: appointment.client.phone,
        serviceName: getSubscriptionLabel(subTypeMap[appointment.subscription.type] ?? 'single-session'),
        price: appointment.subscription.price,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes,
        paymentMethod: appointment.subscription.paymentMethod.toLowerCase(),
        isPaid: true,
        managementToken: appointment.managementToken,
      }),
    }).catch(() => {})

    return NextResponse.json({ success: true })
  }

  // Sposta appuntamento (admin, senza limiti)
  if (body.reschedule === true) {
    const { date, time } = body
    if (!date || !time) {
      return NextResponse.json({ error: 'Data e orario obbligatori' }, { status: 400 })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { client: true, subscription: true },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appuntamento non trovato' }, { status: 404 })
    }

    await prisma.appointment.update({
      where: { id },
      data: { date, time },
    })

    // Email al cliente con nuovi dettagli
    const serviceName = getSubscriptionLabel(SUB_TYPE_MAP[appointment.subscription.type] ?? 'single-session')
    resend.emails.send({
      from: FROM,
      to: appointment.client.email,
      subject: `${subjectPrefix}📅 Il tuo appuntamento è stato spostato`,
      html: `<p>Ciao <strong>${appointment.client.name}</strong>,<br>Il tuo appuntamento per <strong>${serviceName}</strong> è stato spostato a:<br><strong>${date}</strong> alle <strong>${time}</strong>.</p><p>Se hai domande scrivi a <a href="mailto:info@vivaplantnutrition.com">info@vivaplantnutrition.com</a>.</p>`,
      text: `Ciao ${appointment.client.name},\nIl tuo appuntamento per ${serviceName} è stato spostato a:\n${date} alle ${time}.\n\nPer domande: info@vivaplantnutrition.com`,
    }).catch(() => {})

    return NextResponse.json({ success: true })
  }

  // Rimanda link follow-up
  if (body.resendFollowUp === true) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { client: true, subscription: true },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appuntamento non trovato' }, { status: 404 })
    }

    const sub = appointment.subscription
    const sessionsRemaining = sub.totalSessions - sub.usedSessions

    if (sessionsRemaining <= 0 || !sub.followUpToken) {
      return NextResponse.json({ error: 'Nessuna sessione rimanente o token mancante' }, { status: 400 })
    }

    const serviceName = getSubscriptionLabel(SUB_TYPE_MAP[sub.type] ?? 'single-session')
    await resend.emails.send({
      from: FROM,
      to: appointment.client.email,
      subject: `${subjectPrefix}📅 Prenota il prossimo appuntamento — ${sessionsRemaining} ${sessionsRemaining === 1 ? 'sessione rimasta' : 'sessioni rimaste'}`,
      html: getFollowUpEmailHTML({
        clientName: `${appointment.client.name} ${appointment.client.surname}`,
        serviceName,
        sessionsRemaining,
        followUpToken: sub.followUpToken,
        isTest: !IS_PROD,
      }),
      text: getFollowUpEmailText({
        clientName: `${appointment.client.name} ${appointment.client.surname}`,
        serviceName,
        sessionsRemaining,
        followUpToken: sub.followUpToken,
        isTest: !IS_PROD,
      }),
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Nessuna modifica specificata' }, { status: 400 })
}
