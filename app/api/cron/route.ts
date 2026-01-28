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

  const medicinePresentationList = await prisma.medicinePresentation.findMany()

  const mailgun = new Mailgun(FormData)
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API!
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  })
  try {
    const data = await mg.messages.create(process.env.MAILGUN_MAIL_SENDER!, {
      from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_MAIL_SENDER}>`,
      to: [`Recipient <${process.env.MAILGUN_MAIL_RECIPIENT}>`],
      subject: 'Hello Recipient',
      text: `Congratulations Recipient, you just sent an email with Mailgun! You are truly awesome!, ${medicinePresentationList[0].description}`
    })

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
