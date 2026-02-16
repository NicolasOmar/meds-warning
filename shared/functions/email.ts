import FormData from 'form-data'
import Mailgun from 'mailgun.js'

export enum EmailTemplateName {
  MedicineToExpire = 'warning about medicine to expire',
  PasswordReset = 'reset-password'
}

type EmailTemplateParams<T> = {
  nameRecipient: string
  emailRecipient: string
  subject: string
  templateName: EmailTemplateName
  templateVariables: T
}

const mailgun = new Mailgun(FormData)

const getMailgunClient = () => {
  return mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY!
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  })
}

export const sendTemplateEmail = async <T>(params: EmailTemplateParams<T>): Promise<void> => {
  const mg = getMailgunClient()

  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: `MedsWarning <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to: [`${params.nameRecipient} <${params.emailRecipient}>`],
    subject: params.subject,
    template: params.templateName,
    'h:X-Mailgun-Variables': JSON.stringify(params.templateVariables)
  })
}
