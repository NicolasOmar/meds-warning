'use client'
// CORE
import { FC, useActionState } from 'react'
import { useRouter } from 'next/navigation'
// ACTIONS
import { subscribeFindUserForm } from '@actions/user'
// COMPONENTS
import { Button } from '@base-components/button'
import { FieldGroup, FieldLegend, FieldSet } from '@base-components/field'
import CustomField from '@custom-components/CustomField'
// TYPES & ENUMS
import { ROUTES } from '@constants/routes'

const FindUserForm: FC = () => {
  const [state, formAction, isPending] = useActionState(subscribeFindUserForm, {})
  const router = useRouter()

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Find User Form</FieldLegend>

          <CustomField
            key={'search'}
            name={'search'}
            label={'Search'}
            type={'text'}
            placeholder={'Enter the email to start the search'}
          />
        </FieldSet>

        {state.message ? <p>{state.message}</p> : null}
        {state.email ? (
          <Button onClick={() => router.push(`${ROUTES.CREATE_USER}/${state.email}`)}>
            Update user with email {state.email}
          </Button>
        ) : null}
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {state.email ? 'Or find another user' : 'Find User'}
      </Button>
    </form>
  )
}

export default FindUserForm
