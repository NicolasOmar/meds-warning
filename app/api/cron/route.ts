'use server'
import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@prisma/index'
import FormData from 'form-data'
import Mailgun from 'mailgun.js'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const mailgun = new Mailgun(FormData)
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY!
  })

  try {
    const users = await prisma.user.findMany({
      include: { medicines: true }
    })

    const allMailPromises = users.flatMap(user =>
      user.medicines
        .filter(medicine => medicine.expirationDate !== null)
        .map(medicine => {
          const expirationDateInAdvance =
            medicine.expirationDate!.getTime() - user.daysToNotify * 24 * 60 * 60 * 1000
          const todayDateInAdvance = new Date().getTime() + user.daysToNotify * 24 * 60 * 60 * 1000

          return expirationDateInAdvance === todayDateInAdvance
            ? mg.messages.create(process.env.MAILGUN_DOMAIN!, {
                from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`,
                to: [`Recipient <${user.email}>`],
                subject: 'Your medicine is about to expire!',
                text: `Dear user, your medicine ${medicine.name} is about to expire. Please take necessary action.`
              })
            : null
        })
    )

    const mailList = (await Promise.all(allMailPromises)).filter(result => result !== null)

    return NextResponse.json({ success: true, data: mailList }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
