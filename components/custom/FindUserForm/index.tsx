'use client'

import { FC, useActionState } from 'react'
// ACTIONS
import { subscribeFindUserForm } from '@actions/index'
// COMPONENTS
import { Button } from '@base-components/button'
import { FieldGroup, FieldLegend, FieldSet } from '@base-components/field'
import CustomField from '@custom-components/CustomField'

const FindUserForm: FC = () => {
  const [state, formAction, isPending] = useActionState(subscribeFindUserForm, {})

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
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        Find User
      </Button>
    </form>
  )
}

export default FindUserForm
