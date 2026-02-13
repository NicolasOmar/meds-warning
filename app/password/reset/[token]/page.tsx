// COMPONENTS
import ResetPasswordForm from '@form-components/ResetPasswordForm'

interface ResetPasswordPageProps {
  params: Promise<{
    token: string
  }>
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params

  return (
    <section className="flex flex-col min-h-screen items-center justify-center px-4">
      <ResetPasswordForm token={token} />
    </section>
  )
}
