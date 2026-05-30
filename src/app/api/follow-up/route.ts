import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/follow-up?token=xxx
// Valida il token e restituisce il tipo di servizio per pre-compilare il form
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token mancante' }, { status: 400 })
  }

  const subscription = await prisma.subscription.findUnique({
    where: { followUpToken: token },
    include: { client: true },
  })

  if (!subscription) {
    return NextResponse.json({ error: 'Link non valido' }, { status: 404 })
  }

  if (subscription.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Questo percorso non è più attivo' }, { status: 410 })
  }

  if (subscription.expiresAt && subscription.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Le sessioni del tuo percorso sono scadute. Contatta Arianna per maggiori informazioni.' }, { status: 410 })
  }

  const sessionsRemaining = subscription.totalSessions - subscription.usedSessions

  if (sessionsRemaining <= 0) {
    return NextResponse.json({ error: 'Hai già utilizzato tutte le sessioni del tuo percorso' }, { status: 410 })
  }

  // Mappa tipo subscription → commercialType del form
  const serviceMap: Record<string, string> = {
    BUNDLE_3_MONTHS: 'follow-up',
    BUNDLE_6_MONTHS: 'follow-up',
    SINGLE_SESSION: 'follow-up',
    FREE_CONSULTATION: 'free-consultation',
  }

  return NextResponse.json({
    valid: true,
    serviceType: serviceMap[subscription.type] ?? 'follow-up',
    subscriptionId: subscription.id,
    sessionsRemaining,
    client: {
      name: subscription.client.name,
      surname: subscription.client.surname,
      email: subscription.client.email,
      phone: subscription.client.phone,
      address: subscription.client.address,
      civicNumber: subscription.client.civicNumber,
      city: subscription.client.city,
      zipCode: subscription.client.zipCode,
      country: subscription.client.country,
      fiscalCode: subscription.client.fiscalCode,
    },
  })
}
