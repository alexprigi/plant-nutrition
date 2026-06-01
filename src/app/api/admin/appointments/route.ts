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
    // Appointment
    id: appt.id,
    date: appt.date,
    time: appt.time,
    status: appt.status.toLowerCase(),
    notes: appt.notes,
    managementToken: appt.managementToken,
    rescheduleCount: appt.rescheduleCount,
    createdAt: appt.createdAt.toISOString(),
    updatedAt: appt.updatedAt.toISOString(),
    // Client
    clientId: appt.client.id,
    clientName: `${appt.client.name} ${appt.client.surname}`,
    clientEmail: appt.client.email,
    clientPhone: appt.client.phone,
    clientAddress: `${appt.client.address} ${appt.client.civicNumber}, ${appt.client.zipCode} ${appt.client.city}`,
    clientCity: appt.client.city,
    clientFiscalCode: appt.client.fiscalCode,
    clientCreatedAt: appt.client.createdAt.toISOString(),
    // Subscription
    subscriptionId: appt.subscription.id,
    serviceName: getSubscriptionLabel(mapSubType(appt.subscription.type)),
    subscriptionType: appt.subscription.type,
    subscriptionStatus: appt.subscription.status.toLowerCase(),
    price: appt.subscription.price,
    isPaid: appt.subscription.isPaid,
    paymentMethod: appt.subscription.paymentMethod.toLowerCase(),
    totalSessions: appt.subscription.totalSessions,
    usedSessions: appt.subscription.usedSessions,
    followUpToken: appt.subscription.followUpToken ?? null,
    expiresAt: appt.subscription.expiresAt?.toISOString() ?? null,
    subscriptionCreatedAt: appt.subscription.createdAt.toISOString(),
  }))

  return NextResponse.json(result)
}
