import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email richiesta' }, { status: 400 })
    }

    // Già cliente solo chi ha un abbonamento non annullato: chi ha abbandonato un pagamento
    // (abbonamento annullato) o disdetto il colloquio gratuito resta idoneo
    const subscription = await prisma.subscription.findFirst({
      where: {
        status: { not: 'CANCELLED' },
        client: { email: email.toLowerCase(), isDeleted: false },
      },
      select: { id: true },
    })

    if (subscription) {
      return NextResponse.json({ eligible: false, reason: 'already_customer' })
    }

    return NextResponse.json({ eligible: true })
  } catch (error) {
    console.error('Check eligibility error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
