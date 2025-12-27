'use client'
// CORE
import { FC, useActionState } from 'react'
// ACTIONS
import { createUserForm, updateUserForm } from '@actions/index'
// COMPONENTS
import { FieldGroup, FieldLegend, FieldSet } from '@base-components/field'
import { Button } from '@base-components/button'
import CustomField from '@custom-components/CustomField'
// TYPES
import { SignUpActionState } from 'ts/forms'
import { userFormType } from '@actions/schemas'

interface UserFormProps {
  userUpdate?: userFormType
}

const initialState: SignUpActionState = {
  errors: {}
}

const generateUserFormStructure = (userUpdate?: userFormType) => ({
  name: {
    name: 'name',
    label: 'Name',
    type: 'text',
    value: userUpdate?.name || '',
    placeholder: 'John'
  },
  lastName: {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    value: userUpdate?.lastName || '',
    placeholder: 'Doe'
  },
  likedMovie: {
    name: 'likedMovie',
    label: 'Liked Movie',
    type: 'text',
    value: userUpdate?.likedMovie || '',
    placeholder: 'John'
  },
  email: {
    name: 'email',
    label: 'Email',
    type: 'email',
    value: userUpdate?.email || '',
    placeholder: 'john.doe@example.com'
  }
})

const UserForm: FC<UserFormProps> = ({ userUpdate }) => {
  // Connect the action to the state
  const action = userUpdate ? updateUserForm : createUserForm
  const formStructure = generateUserFormStructure(userUpdate)
  const submitLabel = userUpdate ? 'Update User' : 'Create User'
  const [state, formAction, isPending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Create an user</FieldLegend>

          {Object.values(formStructure).map(({ name, label, type, placeholder, value }) => (
            <CustomField
              key={name}
              name={name}
              label={label}
              type={type}
              value={value}
              placeholder={placeholder}
            />
          ))}

          {/* Display Error for Email */}
          {state.errors?.email ? (
            <p className="text-red-500 text-sm">{state.errors.email[0]}</p>
          ) : null}
        </FieldSet>
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Working...' : submitLabel}
      </Button>

      {/* Display Global Message */}
      {state.message && <p className="text-gray-700 font-medium">{state.message}</p>}
    </form>
  )
}

export default UserForm
