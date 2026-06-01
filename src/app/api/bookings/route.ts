import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  AppointmentStatus,
  AppointmentType,
  PaymentMethod,
  SubscriptionStatus,
  SubscriptionType,
} from '@prisma/client'
import type { CreateBookingDTO } from '@/lib/bookingService'

// Mappa tipi frontend → Prisma enums
function mapCommercialType(commercialType: CreateBookingDTO['commercialType']): {
  subType: SubscriptionType
  apptType: AppointmentType
  totalSessions: number
  price: number
} {
  switch (commercialType) {
    case 'free-consultation':
      return { subType: 'FREE_CONSULTATION', apptType: 'FREE_CONSULTATION', totalSessions: 1, price: 0 }
    case 'follow-up':
      return { subType: 'SINGLE_SESSION', apptType: 'FOLLOW_UP', totalSessions: 1, price: 50 }
    case 'first-visit':
      return { subType: 'SINGLE_SESSION', apptType: 'FIRST_VISIT', totalSessions: 1, price: 85 }
    case 'plan-3-months':
      return { subType: 'BUNDLE_3_MONTHS', apptType: 'FIRST_VISIT', totalSessions: 3, price: 237 }
    case 'plan-6-months':
      return { subType: 'BUNDLE_6_MONTHS', apptType: 'FIRST_VISIT', totalSessions: 6, price: 450 }
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

function mapStatus(status: CreateBookingDTO['status']): AppointmentStatus {
  const map: Record<string, AppointmentStatus> = {
    pending: 'PENDING',
    confirmed: 'CONFIRMED',
    cancelled: 'CANCELLED',
    completed: 'COMPLETED',
  }
  return map[status] ?? 'PENDING'
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateBookingDTO = await request.json()

    const { subType, apptType, totalSessions, price } = mapCommercialType(data.commercialType)

    const result = await prisma.$transaction(async (tx) => {
      // 1. Crea o aggiorna il cliente
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

      let subscription

      if (data.existingSubscriptionId) {
        // Follow-up: usa la subscription esistente senza incrementare usedSessions
        // (viene incrementato solo quando Arianna segna la sessione come svolta)
        subscription = await tx.subscription.findUnique({
          where: { id: data.existingSubscriptionId },
        })
        if (!subscription) throw new Error('Subscription not found')
      } else {
        // Nuova prenotazione: crea subscription
        const expiresAt = subType === 'BUNDLE_3_MONTHS'
          ? new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
          : subType === 'BUNDLE_6_MONTHS'
          ? new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000)
          : null

        subscription = await tx.subscription.create({
          data: {
            clientId: client.id,
            type: subType,
            price,
            isPaid: data.isPaid,
            paymentMethod: mapPaymentMethod(data.paymentMethod),
            totalSessions,
            usedSessions: 0,
            status: 'ACTIVE' as SubscriptionStatus,
            ...(expiresAt && { expiresAt }),
          },
        })
      }

      // 3. Crea appointment
      const appointment = await tx.appointment.create({
        data: {
          subscriptionId: subscription.id,
          clientId: client.id,
          type: apptType,
          date: data.selectedDate,
          time: data.selectedTime,
          status: mapStatus(data.status),
          notes: data.notes ?? '',
        },
      })

      return { client, subscription, appointment }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'Data richiesta' }, { status: 400 })
  }

  const allSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
  ]

  // Recupera slot già prenotati e blocchi di disponibilità in parallelo
  const [bookedAppointments, availabilityBlocks] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        date,
        isDeleted: false,
        status: { notIn: ['CANCELLED'] },
      },
      select: { time: true },
    }),
    prisma.availabilityBlock.findMany({
      where: { date },
    }),
  ])

  const bookedTimes = new Set(bookedAppointments.map((a) => a.time))

  // Weekend: aperto solo se almeno un blocco OPEN lo copre
  const dayOfWeek = new Date(date).getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const openBlocks = availabilityBlocks.filter(b => b.type === 'OPEN')
  const blockBlocks = availabilityBlocks.filter(b => b.type === 'BLOCK')

  if (isWeekend && openBlocks.length === 0) {
    return NextResponse.json({
      date,
      slots: allSlots.map(time => ({ time, available: false })),
    })
  }

  if (isWeekend) {
    // Uno slot è disponibile se coperto da almeno un OPEN e non coperto da BLOCK
    const isSlotOpen = (time: string) =>
      openBlocks.some(b =>
        !b.startTime || !b.endTime || (time >= b.startTime && time < b.endTime)
      )
    const isSlotBlockedByBlock = (time: string) =>
      blockBlocks.some(b =>
        !b.startTime || !b.endTime || (time >= b.startTime && time < b.endTime)
      )

    return NextResponse.json({
      date,
      slots: allSlots.map(time => ({
        time,
        available: isSlotOpen(time) && !isSlotBlockedByBlock(time) && !bookedTimes.has(time),
      })),
    })
  }

  const blocks = blockBlocks

  const isSlotBlocked = (time: string): boolean => {
    for (const block of blocks) {
      if (!block.startTime || !block.endTime) return true
      if (time >= block.startTime && time < block.endTime) return true
    }
    return false
  }

  return NextResponse.json({
    date,
    slots: allSlots.map((time) => ({
      time,
      available: !bookedTimes.has(time) && !isSlotBlocked(time),
    })),
  })
}
