'use server'
import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@prisma/index'
// SHARED
import { EmailTemplateName, sendTemplateEmail } from '@shared-functions/email'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

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
            ? sendTemplateEmail({
                nameRecipient: user.name,
                emailRecipient: user.email,
                subject: `Your medicine ${medicine.name} is about to expire!`,
                templateName: EmailTemplateName.MedicineToExpire,
                templateVariables: {
                  userName: user.name,
                  medicineName: medicine.name,
                  expirationDate: medicine.expirationDate!.toISOString().split('T')[0]
                }
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
