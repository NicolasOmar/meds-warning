'use client'
// CORE
import { FC, useActionState, useEffect } from 'react'
import Link from 'next/link'
// FORM
import { handleForgotPasswordAction } from '@actions/password'
// COMPONENTS
import { FieldGroup, FieldLegend, FieldSet } from '@base-components/field'
import { Button } from '@base-components/button'
import CustomInput from '@custom-components/CustomInput'
// SHARED
import { FORGOT_PASSWORD_FORM_LABELS } from '@shared-constants/forms'
import { ForgotPasswordActionState } from '@shared-types/states'
import { ROUTE_URLS } from '@shared-constants/routes'
import { ROOT_LAYOUT_LABELS } from '@shared-constants/pages'
import { handleCommonFormState } from '@shared-functions/forms'

const ForgotPasswordForm: FC = () => {
  const [state, forgotPasswordFormAction, isPending] = useActionState<
    ForgotPasswordActionState,
    FormData
  >(handleForgotPasswordAction, {})

  useEffect(() => {
    handleCommonFormState(ROUTE_URLS.PASSWORD_FORGOT, state)
  }, [state])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md bg-card text-card-foreground rounded-lg shadow-sm border p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-primary">
            {ROOT_LAYOUT_LABELS.METADATA_TITLE}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {FORGOT_PASSWORD_FORM_LABELS.SUBTITLE}
          </p>
        </div>

        {state.success ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-green-600 dark:text-green-400">{state.message}</p>
            <Link
              href={ROUTE_URLS.LOGIN}
              className="inline-block text-blue-600 hover:underline dark:text-blue-400"
            >
              {FORGOT_PASSWORD_FORM_LABELS.BACK_TO_LOGIN}
            </Link>
          </div>
        ) : (
          <form action={forgotPasswordFormAction} className="flex w-full max-w-md flex-col gap-4">
            <FieldGroup>
              <FieldSet>
                <FieldLegend>{FORGOT_PASSWORD_FORM_LABELS.TITLE}</FieldLegend>
                <CustomInput
                  name="email"
                  label={FORGOT_PASSWORD_FORM_LABELS.EMAIL}
                  type="email"
                  placeholder={FORGOT_PASSWORD_FORM_LABELS.EMAIL_PLACEHOLDER}
                  message={state.errors?.email}
                />
              </FieldSet>
            </FieldGroup>

            <Button type="submit" disabled={isPending}>
              {FORGOT_PASSWORD_FORM_LABELS.SUBMIT_BUTTON}
            </Button>

            <div className="text-center text-sm">
              <Link
                href={ROUTE_URLS.LOGIN}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {FORGOT_PASSWORD_FORM_LABELS.BACK_TO_LOGIN}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordForm
