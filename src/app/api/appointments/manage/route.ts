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
  const canReschedule = hoursUntil > 24
  const isPending = appointment.status === 'PENDING'
  const isPaid = appointment.subscription.isPaid

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
    canReschedule,
    canCancel: isPending || !isPaid,
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

    if (!isPending && isPaid) {
      return NextResponse.json({ error: 'Non puoi cancellare un appuntamento già pagato' }, { status: 403 })
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'CANCELLED' },
    })

    // Notifica ad Arianna via email (fire and forget)
    fetch(`${process.env.AUTH_URL}/api/send-booking-emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'cancellation',
        clientName: `${appointment.client.name} ${appointment.client.surname}`,
        clientEmail: appointment.client.email,
        date: appointment.date,
        time: appointment.time,
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

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { date, time },
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
