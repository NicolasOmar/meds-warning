'use server'
import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@prisma/index'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const data = await prisma.medicinePresentation.findMany()
  console.log(data)

  return NextResponse.json({ success: true }, { status: 200 })
}
