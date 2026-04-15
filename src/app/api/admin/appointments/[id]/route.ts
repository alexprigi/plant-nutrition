import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import type { AppointmentStatus } from '@prisma/client'

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

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Nessuna modifica specificata' }, { status: 400 })
}
