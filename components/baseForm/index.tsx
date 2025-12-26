'use client'

import { FC, useActionState } from 'react'
import { subscribeUserForm } from '@actions/index'
import { SignUpActionState } from 'ts/forms'
import { FieldGroup, FieldLegend, FieldSet } from '@components/field'
import CustomField from '@components/customField'
import { Button } from '@components/button'

const initialState: SignUpActionState = {
  errors: {}
}

const userFormStructure = {
  name: {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'John'
  },
  lastName: {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Doe'
  },
  likedMovie: {
    name: 'likedMovie',
    label: 'Liked Movie',
    type: 'text',
    placeholder: 'John'
  },
  email: {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'john.doe@example.com'
  }
}

const UserForm: FC = () => {
  // Connect the action to the state
  const [state, formAction, isPending] = useActionState(subscribeUserForm, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Create an user</FieldLegend>

          {
            Object.values(userFormStructure).map(({ name, label, type, placeholder }) => (
              <CustomField
                key={name}
                name={name}
                label={label}
                type={type}
                placeholder={placeholder}
              />
            ))
          }
          
          {/* Display Error for Email */}
          {state.errors?.email ? <p className="text-red-500 text-sm">{state.errors.email[0]}</p> : null}
        </FieldSet>
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Subscribe'}
      </Button>

      {/* Display Global Message */}
      {state.message && <p className="text-gray-700 font-medium">{state.message}</p>}
    </form>
  )
}

export default UserForm