import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { id } = await params

  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: { appointments: true },
  })

  if (!subscription) {
    return NextResponse.json({ error: 'Percorso non trovato' }, { status: 404 })
  }

  // Cancella tutti gli appuntamenti futuri (non già completati)
  await prisma.appointment.updateMany({
    where: {
      subscriptionId: id,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    data: { status: 'CANCELLED' },
  })

  // Segna la subscription come cancellata
  await prisma.subscription.update({
    where: { id },
    data: { status: 'CANCELLED' },
  })

  return NextResponse.json({ success: true })
}
