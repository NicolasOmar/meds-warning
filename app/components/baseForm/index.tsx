'use client'

import { useActionState } from 'react'
import { subscribe } from '../../actions'
import { SignUpActionState } from 'app/things'

const initialState: SignUpActionState = {
  errors: {}
}

export function SubscribeForm() {
  // Connect the action to the state
  const [state, formAction, isPending] = useActionState(subscribe, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" className="border p-2 rounded" />

        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" name="lastName" type="text" className="border p-2 rounded" />

        <label htmlFor="likedMovie">Liked Movie</label>
        <input id="likedMovie" name="likedMovie" type="text" className="border p-2 rounded" />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="border p-2 rounded" />
        {/* Display Error for Email */}
        {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email[0]}</p>}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Subscribe'}
      </button>

      {/* Display Global Message */}
      {state.message && <p className="text-gray-700 font-medium">{state.message}</p>}
    </form>
  )
}
