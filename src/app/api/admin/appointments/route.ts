import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { getSubscriptionLabel } from '@/lib/bookingService'
import type { SubscriptionType } from '@/lib/bookingService'

// Mappa enum Prisma → tipo frontend
function mapSubType(prismaType: string): SubscriptionType {
  const map: Record<string, SubscriptionType> = {
    FREE_CONSULTATION: 'free-consultation',
    SINGLE_SESSION: 'single-session',
    BUNDLE_3_MONTHS: 'bundle-3-months',
    BUNDLE_6_MONTHS: 'bundle-6-months',
  }
  return map[prismaType] ?? 'single-session'
}

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const appointments = await prisma.appointment.findMany({
    where: { isDeleted: false },
    include: {
      client: true,
      subscription: true,
    },
    orderBy: { date: 'desc' },
  })

  const result = appointments.map((appt) => ({
    id: appt.id,
    date: appt.date,
    time: appt.time,
    status: appt.status.toLowerCase(),
    notes: appt.notes,
    clientName: `${appt.client.name} ${appt.client.surname}`,
    clientEmail: appt.client.email,
    clientPhone: appt.client.phone,
    serviceName: getSubscriptionLabel(mapSubType(appt.subscription.type)),
    price: appt.subscription.price,
    isPaid: appt.subscription.isPaid,
    paymentMethod: appt.subscription.paymentMethod.toLowerCase(),
  }))

  return NextResponse.json(result)
}
