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

  const medicineList = await prisma.medicine.findMany()

  const mailgun = new Mailgun(FormData)
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API!
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  })
  try {
    const userSettings = await prisma.settings.findFirst()
    const mailList = await Promise.all(
      medicineList
        .map(async medicine => {
          if (medicine.expirationDate === null) {
            return null
          }

          const expirationDateInAdvance =
            medicine.expirationDate!.getTime() -
            (userSettings?.daysToNotify ?? 0) * 24 * 60 * 60 * 1000
          const todayDateInAdvance =
            new Date().getTime() + (userSettings?.daysToNotify ?? 0) * 24 * 60 * 60 * 1000

          return expirationDateInAdvance === todayDateInAdvance
            ? mg.messages.create(process.env.MAILGUN_MAIL_SENDER!, {
                from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_MAIL_SENDER}>`,
                to: [`Recipient <${process.env.MAILGUN_MAIL_RECIPIENT}>`],
                subject: 'Your medicine is about to expire!',
                text: `Dear user, your medicine ${medicine.name} is about to expire. Please take necessary action.`
              })
            : null
        })
        .filter(mailToSend => mailToSend !== null)
    )

    return NextResponse.json({ success: true, data: mailList }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
