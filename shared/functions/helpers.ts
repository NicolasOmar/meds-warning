export const parseEmptyFormValueToNull = (value: FormDataEntryValue | null) => {
  return value === '' || value === null ? null : value
}
