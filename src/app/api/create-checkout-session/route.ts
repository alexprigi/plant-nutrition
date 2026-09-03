import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type { CreateBookingDTO } from '@/lib/bookingService'
import {
  AppointmentStatus,
  AppointmentType,
  PaymentMethod,
  SubscriptionStatus,
  SubscriptionType,
} from '@prisma/client'

function mapCommercialType(commercialType: CreateBookingDTO['commercialType']): {
  subType: SubscriptionType
  apptType: AppointmentType
  totalSessions: number
  price: number
  label: string
} {
  switch (commercialType) {
    case 'free-consultation':
      return { subType: 'FREE_CONSULTATION', apptType: 'FREE_CONSULTATION', totalSessions: 1, price: 0, label: 'Colloquio Gratuito' }
    case 'follow-up':
      return { subType: 'SINGLE_SESSION', apptType: 'FOLLOW_UP', totalSessions: 1, price: 0.50, label: 'Consulenza Follow-up' }
    case 'first-visit':
      return { subType: 'SINGLE_SESSION', apptType: 'FIRST_VISIT', totalSessions: 1, price: 85, label: 'Prima Visita Nutrizionale' }
    case 'plan-3-months':
      return { subType: 'BUNDLE_3_MONTHS', apptType: 'FIRST_VISIT', totalSessions: 3, price: 237, label: 'Percorso Nutrizionale 3 Mesi' }
    case 'plan-6-months':
      return { subType: 'BUNDLE_6_MONTHS', apptType: 'FIRST_VISIT', totalSessions: 6, price: 450, label: 'Percorso Nutrizionale 6 Mesi VIP' }
  }
}

function mapPaymentMethod(pm: CreateBookingDTO['paymentMethod']): PaymentMethod {
  const map: Record<string, PaymentMethod> = {
    stripe: 'STRIPE',
    paypal: 'PAYPAL',
    bank_transfer: 'BANK_TRANSFER',
    none: 'NONE',
  }
  return map[pm] ?? 'NONE'
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateBookingDTO = await request.json()
    const { subType, apptType, totalSessions, price, label } = mapCommercialType(data.commercialType)

    const appUrl = (process.env.AUTH_URL || 'http://localhost:3000').replace(/\/$/, '')

    // 1. Crea booking nel DB con stato pending
    const result = await prisma.$transaction(async (tx) => {
      const client = await tx.client.upsert({
        where: { email: data.email.toLowerCase() },
        update: {
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          address: data.address,
          civicNumber: data.civicNumber,
          city: data.city,
          zipCode: data.zipCode,
          country: data.country,
          fiscalCode: data.fiscalCode,
          isDeleted: false,
        },
        create: {
          email: data.email.toLowerCase(),
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          address: data.address,
          civicNumber: data.civicNumber,
          city: data.city,
          zipCode: data.zipCode,
          country: data.country,
          fiscalCode: data.fiscalCode,
          role: 'GUEST',
        },
      })

      const expiresAt = subType === 'BUNDLE_3_MONTHS'
        ? new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
        : subType === 'BUNDLE_6_MONTHS'
        ? new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000)
        : null

      const subscription = await tx.subscription.create({
        data: {
          clientId: client.id,
          type: subType,
          price,
          isPaid: false,
          paymentMethod: mapPaymentMethod(data.paymentMethod),
          totalSessions,
          usedSessions: 0,
          status: 'ACTIVE' as SubscriptionStatus,
          ...(expiresAt && { expiresAt }),
        },
      })

      const appointment = await tx.appointment.create({
        data: {
          subscriptionId: subscription.id,
          clientId: client.id,
          type: apptType,
          date: data.selectedDate,
          time: data.selectedTime,
          status: 'PENDING' as AppointmentStatus,
          notes: data.notes ?? '',
        },
      })

      return { client, subscription, appointment }
    })

    // 2. Crea Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: data.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: price * 100,
            product_data: {
              name: label,
              description: `Consulenza con Arianna Ciervo — ${data.selectedDate} ore ${data.selectedTime}`,
            },
          },
        },
      ],
      metadata: {
        subscriptionId: result.subscription.id,
        appointmentId: result.appointment.id,
        clientEmail: data.email,
        serviceName: label,
        date: data.selectedDate,
        time: data.selectedTime,
        durationMinutes: String(data.durationMinutes ?? 60),
        clientName: `${data.name} ${data.surname}`,
        clientPhone: data.phone,
        notes: data.notes?.substring(0, 500) ?? '',
      },
      success_url: `${appUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/booking?cancelled=true`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minuti
    })

    // 3. Salva stripeSessionId sulla subscription
    await prisma.subscription.update({
      where: { id: result.subscription.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url }, { status: 201 })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
