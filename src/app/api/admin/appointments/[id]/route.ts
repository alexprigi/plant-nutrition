import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import type { AppointmentStatus } from '@prisma/client'
import { getSubscriptionLabel } from '@/lib/bookingService'
import type { SubscriptionType } from '@/lib/bookingService'

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
    })

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

  return NextResponse.json({ error: 'Nessuna modifica specificata' }, { status: 400 })
}
