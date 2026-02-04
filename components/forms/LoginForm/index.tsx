'use client'
// CORE
import { FC, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// FORM
import { handleLoginAction } from '@actions/auth'
// COMPONENTS
import { FieldGroup, FieldLegend, FieldSet } from '@base-components/field'
import { Button } from '@base-components/button'
import CustomInput from '@custom-components/CustomInput'
// SHARED
import { LOGIN_FORM_LABELS } from '@shared-constants/forms'
import { LoginActionState } from '@shared-types/states'
import { ROUTE_URLS } from '@shared-constants/routes'

const generateLoginFormStructure = () => ({
  email: {
    name: 'email',
    label: LOGIN_FORM_LABELS.EMAIL,
    type: 'email',
    placeholder: LOGIN_FORM_LABELS.EMAIL_PLACEHOLDER
  },
  password: {
    name: 'password',
    label: LOGIN_FORM_LABELS.PASSWORD,
    type: 'password',
    placeholder: LOGIN_FORM_LABELS.PASSWORD_PLACEHOLDER
  }
})

const LoginForm: FC = () => {
  const router = useRouter()
  const loginFormStructure = generateLoginFormStructure()
  const [state, loginFormAction, isPending] = useActionState<LoginActionState, FormData>(
    handleLoginAction,
    {}
  )

  useEffect(() => {
    if (state.success) {
      router.push(ROUTE_URLS.HOME)
    }
  }, [state, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form action={loginFormAction} className="flex w-full max-w-md flex-col gap-4">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{LOGIN_FORM_LABELS.TITLE}</FieldLegend>
            <CustomInput {...loginFormStructure.email} message={state.errors?.email} />
            <CustomInput {...loginFormStructure.password} message={state.errors?.password} />
            {state.message && !state.success && (
              <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
            )}
          </FieldSet>
        </FieldGroup>

        <Button type="submit" disabled={isPending}>
          {LOGIN_FORM_LABELS.SUBMIT_BUTTON}
        </Button>

        <div className="text-center text-sm">
          <Link
            href={ROUTE_URLS.USER_CREATE}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {LOGIN_FORM_LABELS.CREATE_ACCOUNT}
          </Link>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
