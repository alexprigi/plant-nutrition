import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/appointments/manage?token=xxx
// Restituisce i dati dell'appuntamento per la pagina di gestione
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token mancante' }, { status: 400 })
  }

  const appointment = await prisma.appointment.findUnique({
    where: { managementToken: token, isDeleted: false },
    include: {
      client: { select: { name: true, surname: true, email: true } },
      subscription: { select: { paymentMethod: true, isPaid: true, price: true, type: true } },
    },
  })

  if (!appointment) {
    return NextResponse.json({ error: 'Appuntamento non trovato' }, { status: 404 })
  }

  if (appointment.status === 'CANCELLED') {
    return NextResponse.json({ error: 'Appuntamento già cancellato' }, { status: 410 })
  }

  if (appointment.status === 'COMPLETED') {
    return NextResponse.json({ error: 'Appuntamento già completato' }, { status: 410 })
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
  const rescheduleBlocked = inRestrictedZone && appointment.rescheduleCountRestricted >= 1
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
    return NextResponse.json({ error: 'Parametri mancanti' }, { status: 400 })
  }

  const appointment = await prisma.appointment.findUnique({
    where: { managementToken: token, isDeleted: false },
    include: {
      client: { select: { name: true, surname: true, email: true } },
      subscription: { select: { paymentMethod: true, isPaid: true, price: true } },
    },
  })

  if (!appointment) {
    return NextResponse.json({ error: 'Appuntamento non trovato' }, { status: 404 })
  }

  if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
    return NextResponse.json({ error: 'Operazione non consentita su questo appuntamento' }, { status: 409 })
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
      return NextResponse.json({ error: 'Non puoi cancellare un appuntamento già pagato con meno di 7 giorni di anticipo' }, { status: 403 })
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'CANCELLED' },
    })

    const isRefundable = !isPending && !isFree && isPaid && daysUntil > 7

    // Notifica ad Arianna
    fetch(`${process.env.AUTH_URL}/api/send-booking-emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'cancellation',
        clientName: `${appointment.client.name} ${appointment.client.surname}`,
        clientEmail: appointment.client.email,
        date: appointment.date,
        time: appointment.time,
        isRefundable,
      }),
    }).catch(() => {})

    // Conferma cancellazione al cliente
    fetch(`${process.env.AUTH_URL}/api/send-booking-emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'cancellation-client',
        clientName: `${appointment.client.name} ${appointment.client.surname}`,
        clientEmail: appointment.client.email,
        date: appointment.date,
        time: appointment.time,
        isRefundable,
      }),
    }).catch(() => {})

    return NextResponse.json({ success: true, action: 'cancelled' })
  }

  if (action === 'reschedule') {
    if (!date || !time) {
      return NextResponse.json({ error: 'Data e orario obbligatori per lo spostamento' }, { status: 400 })
    }

    if (hoursUntil <= 24) {
      return NextResponse.json({ error: 'Non puoi spostare un appuntamento entro 24 ore' }, { status: 403 })
    }

    const currentDaysUntil = hoursUntil / 24
    const isRestricted = currentDaysUntil <= 7 && currentDaysUntil > 1

    if (isRestricted && appointment.rescheduleCountRestricted >= 1) {
      return NextResponse.json({ error: 'Hai già spostato l\'appuntamento una volta in questa fascia. Contatta Arianna.' }, { status: 403 })
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

    // Notifica ad Arianna via email (fire and forget)
    fetch(`${process.env.AUTH_URL}/api/send-booking-emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'reschedule',
        clientName: `${appointment.client.name} ${appointment.client.surname}`,
        clientEmail: appointment.client.email,
        oldDate: appointment.date,
        oldTime: appointment.time,
        newDate: date,
        newTime: time,
      }),
    }).catch(() => {})

    return NextResponse.json({ success: true, action: 'rescheduled', date, time })
  }

  return NextResponse.json({ error: 'Azione non valida' }, { status: 400 })
}
