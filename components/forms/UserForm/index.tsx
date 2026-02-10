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
import { COMMON_LABELS } from '@shared-constants/common'

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
  }
})

const UserForm: FC<UserFormProps> = ({ userData }) => {
  const userFormStructure = generateUserFormStructure()
  const customUserFormAction = (state: UserActionState, formData: FormData) =>
    handleUserAction(state, formData, userData?.id?.toString(), userData?.email)
  const [state, userFormAction, isPending] = useActionState(customUserFormAction, {})

  useEffect(() => {
    const redirectUrl = userData ? ROUTE_URLS.SETTINGS_ROOT : ROUTE_URLS.LOGIN
    handleCommonFormState(redirectUrl, state)
  }, [state, userData])

  return (
    <section className="mx-auto w-full bg-card text-card-foreground rounded-lg shadow-sm border p-6">
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
            {userData ? null : (
              <CustomInput {...userFormStructure.email} message={state.errors?.email} />
            )}
            {userData ? null : (
              <CustomInput {...userFormStructure.password} message={state.errors?.password} />
            )}
          </FieldSet>
        </FieldGroup>

        <Button type="submit" disabled={isPending}>
          {userData ? COMMON_LABELS.SAVE_CHANGES : USER_FORM_LABELS.SUBMIT_BUTTON}
        </Button>
      </form>
    </section>
  )
}

export default UserForm
