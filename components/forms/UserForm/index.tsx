'use client'
// CORE
import { FC, useActionState, useEffect } from 'react'
// FORM
import { handleUserAction } from '@actions/user'
// COMPONENTS
import { FieldGroup, FieldLegend, FieldSet } from '@base-components/field'
import { Button } from '@base-components/button'
import CustomInput from '@custom-components/CustomInput'
// SHARED
import { USER_FORM_LABELS } from '@shared-constants/forms'
import { UserType } from '@shared-types/zod'
import { UserActionState } from '@shared-types/states'
import { handleCommonFormState } from '@shared-functions/forms'
import { ROUTE_URLS } from '@shared-constants/routes'
import { ROOT_LAYOUT_LABELS } from '@shared-constants/pages'

interface UserFormProps {
  userData?: UserType
}

const generateUserFormStructure = () => ({
  name: {
    name: 'name',
    label: USER_FORM_LABELS.NAME,
    type: 'text',
    placeholder: USER_FORM_LABELS.NAME_PLACEHOLDER
  },
  lastName: {
    name: 'lastName',
    label: USER_FORM_LABELS.LAST_NAME,
    type: 'text',
    placeholder: USER_FORM_LABELS.LAST_NAME_PLACEHOLDER
  },
  email: {
    name: 'email',
    label: USER_FORM_LABELS.EMAIL,
    type: 'email',
    placeholder: USER_FORM_LABELS.EMAIL_PLACEHOLDER
  },
  password: {
    name: 'password',
    label: USER_FORM_LABELS.PASSWORD,
    type: 'password',
    placeholder: USER_FORM_LABELS.PASSWORD_PLACEHOLDER
  },
  daysToNotify: {
    name: 'daysToNotify',
    label: USER_FORM_LABELS.DAYS_TO_NOTIFY,
    type: 'number',
    placeholder: USER_FORM_LABELS.DAYS_TO_NOTIFY_PLACEHOLDER
  }
})

const User: FC<UserFormProps> = ({ userData }) => {
  const userFormStructure = generateUserFormStructure()
  const customUserFormAction = (state: UserActionState, formData: FormData) =>
    handleUserAction(state, formData, userData?.id?.toString())
  const [state, userFormAction, isPending] = useActionState(customUserFormAction, {})

  useEffect(() => {
    handleCommonFormState(ROUTE_URLS.USER_LIST, state)
  }, [state])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md bg-card text-card-foreground rounded-lg shadow-sm border p-8">
        <h1 className="text-xl font-semibold text-center text-primary mb-6">
          {ROOT_LAYOUT_LABELS.METADATA_TITLE}
        </h1>
        <form action={userFormAction} className="flex flex-col gap-4">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>{USER_FORM_LABELS.TITLE}</FieldLegend>
              <CustomInput
                {...userFormStructure.name}
                message={state.errors?.name}
                value={userData?.name ?? ''}
              />
              <CustomInput
                {...userFormStructure.lastName}
                message={state.errors?.lastName}
                value={userData?.lastName ?? ''}
              />
              <CustomInput
                {...userFormStructure.email}
                message={state.errors?.email}
                value={userData?.email ?? ''}
              />
              <CustomInput {...userFormStructure.password} message={state.errors?.password} />
            </FieldSet>
          </FieldGroup>

          <Button type="submit" disabled={isPending}>
            {USER_FORM_LABELS.SUBMIT_BUTTON}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default User
