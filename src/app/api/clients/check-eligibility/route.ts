import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email richiesta' }, { status: 400 })
    }

    const client = await prisma.client.findUnique({
      where: {
        email: email.toLowerCase(),
        isDeleted: false,
      },
    })

    if (client) {
      return NextResponse.json({ eligible: false, reason: 'already_customer' })
    }

    return NextResponse.json({ eligible: true })
  } catch (error) {
    console.error('Check eligibility error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
