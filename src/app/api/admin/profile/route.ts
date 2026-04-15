import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true },
  })

  return NextResponse.json(user)
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { name } = await request.json()

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Nome non valido' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true },
  })

  return NextResponse.json(updated)
}
