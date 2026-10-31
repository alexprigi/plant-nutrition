import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { postBookingEmail } from '@/lib/booking-emails'

// GET /api/appointments/manage?token=xxx
// Restituisce i dati dell'appuntamento per la pagina di gestione
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token mancante', code: 'missingToken' }, { status: 400 })
  }

  const appointment = await prisma.appointment.findUnique({
    where: { managementToken: token, isDeleted: false },
    include: {
      client: { select: { name: true, surname: true, email: true } },
      subscription: { select: { paymentMethod: true, isPaid: true, price: true, type: true } },
    },
  })

  if (!appointment) {
    return NextResponse.json({ error: 'Appuntamento non trovato', code: 'notFound' }, { status: 404 })
  }

  if (appointment.status === 'CANCELLED') {
    return NextResponse.json({ error: 'Appuntamento già cancellato', code: 'alreadyCancelled' }, { status: 410 })
  }

  if (appointment.status === 'COMPLETED') {
    return NextResponse.json({ error: 'Appuntamento già completato', code: 'alreadyCompleted' }, { status: 410 })
  }

  const apptDate = new Date(appointment.date)
  const now = new Date()
  const hoursUntil = (apptDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  const daysUntil = hoursUntil / 24
  const isPending = appointment.status === 'PENDING'
  const isPaid = appointment.subscription.isPaid
  const isFree = appointment.subscription.price === 0

  // Logica per fascia temporale
  const inRestrictedZone = daysUntil <= 7 && daysUntil > 1
  const maxReschedulesReached = appointment.rescheduleCount >= 3
  const rescheduleBlocked = maxReschedulesReached || (inRestrictedZone && appointment.rescheduleCountRestricted >= 1)
  const canReschedule = hoursUntil > 24 && !isPending && !rescheduleBlocked
  const canCancel = isPending || isFree || daysUntil > 7
  const contactRequired = !isPending && !isFree && (hoursUntil <= 24 || rescheduleBlocked)

  return NextResponse.json({
    id: appointment.id,
    date: appointment.date,
    time: appointment.time,
    status: appointment.status,
    clientName: `${appointment.client.name} ${appointment.client.surname}`,
    serviceName: appointment.type,
    locale: appointment.locale,
    price: appointment.subscription.price,
    isPaid,
    isPending,
    isFree,
    daysUntil: Math.ceil(daysUntil),
    rescheduleCount: appointment.rescheduleCount,
    canReschedule,
    canCancel,
    contactRequired,
  })
}

// POST /api/appointments/manage
// body: { token, action: 'cancel' | 'reschedule', date?, time? }
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { token, action, date, time } = body

  if (!token || !action) {
    return NextResponse.json({ error: 'Parametri mancanti', code: 'missingParams' }, { status: 400 })
  }

  const appointment = await prisma.appointment.findUnique({
    where: { managementToken: token, isDeleted: false },
    include: {
      client: { select: { name: true, surname: true, email: true } },
      subscription: { select: { paymentMethod: true, isPaid: true, price: true } },
    },
  })

  if (!appointment) {
    return NextResponse.json({ error: 'Appuntamento non trovato', code: 'notFound' }, { status: 404 })
  }

  if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
    return NextResponse.json({ error: 'Operazione non consentita su questo appuntamento', code: 'notAllowed' }, { status: 409 })
  }

  const apptDate = new Date(appointment.date)
  const now = new Date()
  const hoursUntil = (apptDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (action === 'cancel') {
    const isPaid = appointment.subscription.isPaid
    const isPending = appointment.status === 'PENDING'
    const isFree = appointment.subscription.price === 0
    const daysUntil = hoursUntil / 24

    // Blocca cancellazione solo se pagato E meno di 7 giorni all'appuntamento (non gratuito, non pending)
    if (!isPending && !isFree && isPaid && daysUntil <= 7) {
      return NextResponse.json({ error: 'Non puoi cancellare un appuntamento già pagato con meno di 7 giorni di anticipo', code: 'cancelTooLate' }, { status: 403 })
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'CANCELLED' },
    })

    const isRefundable = !isPending && !isFree && isPaid && daysUntil > 7

    // Notifica ad Arianna
    await postBookingEmail({
      type: 'cancellation',
      clientName: `${appointment.client.name} ${appointment.client.surname}`,
      clientEmail: appointment.client.email,
      date: appointment.date,
      time: appointment.time,
      isRefundable,
    })

    // Conferma cancellazione al cliente
    await postBookingEmail({
      type: 'cancellation-client',
      clientName: `${appointment.client.name} ${appointment.client.surname}`,
      clientEmail: appointment.client.email,
      date: appointment.date,
      time: appointment.time,
      isRefundable,
      locale: appointment.locale,
    })

    return NextResponse.json({ success: true, action: 'cancelled' })
  }

  if (action === 'reschedule') {
    if (!date || !time) {
      return NextResponse.json({ error: 'Data e orario obbligatori per lo spostamento', code: 'dateTimeRequired' }, { status: 400 })
    }

    if (hoursUntil <= 24) {
      return NextResponse.json({ error: 'Non puoi spostare un appuntamento entro 24 ore', code: 'rescheduleTooLate' }, { status: 403 })
    }

    const currentDaysUntil = hoursUntil / 24
    const isRestricted = currentDaysUntil <= 7 && currentDaysUntil > 1

    if (appointment.rescheduleCount >= 3) {
      return NextResponse.json({ error: 'Hai raggiunto il limite massimo di spostamenti. Contatta Arianna.', code: 'rescheduleLimit' }, { status: 403 })
    }

    if (isRestricted && appointment.rescheduleCountRestricted >= 1) {
      return NextResponse.json({ error: 'Hai già spostato l\'appuntamento una volta in questa fascia. Contatta Arianna.', code: 'rescheduleRestrictedLimit' }, { status: 403 })
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        date,
        time,
        rescheduleCount: { increment: 1 },
        ...(isRestricted && { rescheduleCountRestricted: { increment: 1 } }),
      },
    })

    // Notifica ad Arianna via email
    await postBookingEmail({
      type: 'reschedule',
      clientName: `${appointment.client.name} ${appointment.client.surname}`,
      clientEmail: appointment.client.email,
      oldDate: appointment.date,
      oldTime: appointment.time,
      newDate: date,
      newTime: time,
    })

    return NextResponse.json({ success: true, action: 'rescheduled', date, time })
  }

  return NextResponse.json({ error: 'Azione non valida', code: 'invalidAction' }, { status: 400 })
}
