'use client'
// CORE
import { FC, useActionState, useEffect } from 'react'
import Link from 'next/link'
// FORM
import { handleResetPasswordAction } from '@actions/password'
// COMPONENTS
import { FieldGroup, FieldLegend, FieldSet } from '@base-components/field'
import { Button } from '@base-components/button'
import CustomInput from '@custom-components/CustomInput'
// SHARED
import { RESET_PASSWORD_FORM_LABELS } from '@shared-constants/forms'
import { ResetPasswordActionState } from '@shared-types/states'
import { ROUTE_URLS } from '@shared-constants/routes'
import { ROOT_LAYOUT_LABELS } from '@shared-constants/pages'
import { handleCommonFormState } from '@shared-functions/forms'

interface ResetPasswordFormProps {
  token: string
}

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ token }) => {
  const [state, resetPasswordFormAction, isPending] = useActionState<
    ResetPasswordActionState,
    FormData
  >(handleResetPasswordAction, {})

  useEffect(() => {
    handleCommonFormState(ROUTE_URLS.PASSWORD_RESET, state)
  }, [state])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md bg-card text-card-foreground rounded-lg shadow-sm border p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-primary">
            {ROOT_LAYOUT_LABELS.METADATA_TITLE}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {RESET_PASSWORD_FORM_LABELS.SUBTITLE}
          </p>
        </div>

        {state.success ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-green-600 dark:text-green-400">{state.message}</p>
          </div>
        ) : (
          <form action={resetPasswordFormAction} className="flex w-full max-w-md flex-col gap-4">
            <input type="hidden" name="token" value={token} />
            <FieldGroup>
              <FieldSet>
                <FieldLegend>{RESET_PASSWORD_FORM_LABELS.TITLE}</FieldLegend>
                <CustomInput
                  name="password"
                  label={RESET_PASSWORD_FORM_LABELS.PASSWORD}
                  type="password"
                  placeholder={RESET_PASSWORD_FORM_LABELS.PASSWORD_PLACEHOLDER}
                  message={state.errors?.password}
                />
                <CustomInput
                  name="confirmPassword"
                  label={RESET_PASSWORD_FORM_LABELS.CONFIRM_PASSWORD}
                  type="password"
                  placeholder={RESET_PASSWORD_FORM_LABELS.CONFIRM_PASSWORD_PLACEHOLDER}
                  message={state.errors?.confirmPassword}
                />
              </FieldSet>
            </FieldGroup>

            {state.message && !state.success && (
              <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
            )}

            <Button type="submit" disabled={isPending}>
              {RESET_PASSWORD_FORM_LABELS.SUBMIT_BUTTON}
            </Button>

            <div className="text-center text-sm">
              <Link
                href={ROUTE_URLS.LOGIN}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {RESET_PASSWORD_FORM_LABELS.BACK_TO_LOGIN}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordForm
