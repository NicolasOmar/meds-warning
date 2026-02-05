'use client'
// CORE
import { FC, useActionState, useEffect } from 'react'
// ACTIONS
import { updateSettings } from '@actions/settings'
// COMPONENTS
import { Button } from '@base-components/button'
import { FieldGroup, FieldLegend } from '@base-components/field'
import CustomInput from '@custom-components/CustomInput'
// SHARED
import { SETTINGS_FORM_LABELS } from '@shared-constants/forms'
import { handleCommonFormState } from '@shared-functions/forms'
import { SettingsActionState } from '@shared-types/states'

interface SettingsFormProps {
  userDaysToNotify: number
}

const generateSettingsFormStructure = () => ({
  daysToNotify: {
    name: 'daysToNotify',
    label: SETTINGS_FORM_LABELS.DAYS_TO_NOTIFY,
    type: 'number',
    placeholder: SETTINGS_FORM_LABELS.DAYS_TO_NOTIFY_PLACEHOLDER
  }
})

const SettingsForm: FC<SettingsFormProps> = ({ userDaysToNotify }) => {
  const settingsFormStructure = generateSettingsFormStructure()
  const [state, settingsActionForm, isPending] = useActionState<SettingsActionState, FormData>(
    updateSettings,
    {}
  )

  useEffect(() => {
    handleCommonFormState(null, state)
  }, [state])

  return (
    <div className="mx-auto w-full bg-card text-card-foreground rounded-lg shadow-sm border p-6">
      <form action={settingsActionForm} className="flex flex-col gap-4">
        <FieldGroup>
          <FieldLegend>{SETTINGS_FORM_LABELS.TITLE}</FieldLegend>
          <CustomInput
            {...settingsFormStructure.daysToNotify}
            message={state.errors?.daysToNotify}
            value={userDaysToNotify.toString()}
          />
        </FieldGroup>

        <Button type="submit" disabled={isPending}>
          {SETTINGS_FORM_LABELS.SUBMIT_BUTTON}
        </Button>
      </form>
    </div>
  )
}

export default SettingsForm
