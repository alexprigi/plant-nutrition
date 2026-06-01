import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/admin/availability?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where = from && to
    ? { date: { gte: from, lte: to } }
    : {}

  try {
    const blocks = await prisma.availabilityBlock.findMany({
      where,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })
    return NextResponse.json(blocks)
  } catch {
    return NextResponse.json([])
  }
}

// POST /api/admin/availability
// body: { date, startTime?, endTime?, note? } | { dates: string[], startTime?, endTime?, note? }
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const body = await request.json()

  try {
    // Bulk: più date
    if (Array.isArray(body.dates)) {
      const blocks = await prisma.availabilityBlock.createMany({
        data: body.dates.map((date: string) => ({
          date,
          type: body.type ?? 'BLOCK',
          startTime: body.startTime ?? null,
          endTime: body.endTime ?? null,
          note: body.note ?? '',
        })),
        skipDuplicates: false,
      })
      return NextResponse.json({ success: true, count: blocks.count })
    }

    // Singolo
    if (!body.date) return NextResponse.json({ error: 'Data obbligatoria' }, { status: 400 })

    const type = body.type ?? 'BLOCK'

    const block = await prisma.availabilityBlock.create({
      data: {
        date: body.date,
        type,
        startTime: body.startTime ?? null,
        endTime: body.endTime ?? null,
        note: body.note ?? '',
      },
    })

    return NextResponse.json(block)
  } catch (error: any) {
    console.error('Availability POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/availability?id=xxx
export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID obbligatorio' }, { status: 400 })

  await prisma.availabilityBlock.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
