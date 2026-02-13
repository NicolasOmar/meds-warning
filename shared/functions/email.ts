import FormData from 'form-data'
import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(FormData)

const getMailgunClient = () => {
  return mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY!
  })
}

export interface SendPasswordResetEmailParams {
  to: string
  resetToken: string
}

export async function sendPasswordResetEmail({
  to,
  resetToken
}: SendPasswordResetEmailParams): Promise<void> {
  const mg = getMailgunClient()
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/password/reset/${resetToken}`

  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: `MedsWarning <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to: [to],
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`
  })
}
