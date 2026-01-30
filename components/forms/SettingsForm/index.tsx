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

const generateSettingsFormStructure = () => ({
  daysToNotify: {
    name: 'daysToNotify',
    label: SETTINGS_FORM_LABELS.DAYS_TO_NOTIFY,
    type: 'number',
    placeholder: SETTINGS_FORM_LABELS.DAYS_TO_NOTIFY_PLACEHOLDER
  }
})

const SettingsForm: FC = () => {
  const settingsFormStructure = generateSettingsFormStructure()
  const [state, settingsActionForm, isPending] = useActionState<SettingsActionState, FormData>(
    updateSettings,
    {}
  )

  useEffect(() => {
    handleCommonFormState(null, state)
  }, [state])

  return (
    <form action={settingsActionForm} className="flex flex-col gap-4">
      <FieldGroup>
        <FieldLegend>{SETTINGS_FORM_LABELS.TITLE}</FieldLegend>
        <CustomInput
          {...settingsFormStructure.daysToNotify}
          message={state.errors?.daysToNotify}
          // value={settingsFormStructure.daysToNotify.value || ""}
        />
      </FieldGroup>

      <Button type="submit" disabled={isPending}>
        {SETTINGS_FORM_LABELS.SUBMIT_BUTTON}
      </Button>
    </form>
  )
}

export default SettingsForm
