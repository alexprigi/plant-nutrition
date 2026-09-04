import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    const { subscriptionId, appointmentId, clientEmail, serviceName, date, time, durationMinutes, clientName, clientPhone, notes } = session.metadata ?? {}

    if (!subscriptionId || !appointmentId) {
      console.error('Missing metadata in session:', session.id)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    // Conferma prenotazione nel DB
    await prisma.$transaction([
      prisma.subscription.update({
        where: { id: subscriptionId },
        data: { isPaid: true },
      }),
      prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED' },
      }),
    ])

    // Invia email di conferma
    const appUrl = (process.env.AUTH_URL || 'http://localhost:3000').replace(/\/$/, '')
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { managementToken: true },
    })

    console.log('[webhook] Sending emails to:', clientEmail, 'appUrl:', appUrl)
    const emailRes = await fetch(`${appUrl}/api/send-booking-emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName,
        clientEmail,
        clientPhone,
        serviceName,
        price: (session.amount_total ?? 0) / 100,
        date,
        time,
        notes,
        paymentMethod: 'stripe',
        isPaid: true,
        managementToken: appointment?.managementToken,
        durationMinutes: parseInt(durationMinutes ?? '60', 10),
      }),
    })
    const emailJson = await emailRes.json().catch(() => null)
    console.log('[webhook] Email API response:', emailRes.status, emailJson)
  }

  return NextResponse.json({ received: true })
}
