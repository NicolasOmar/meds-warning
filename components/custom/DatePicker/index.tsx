'use client'
// CORE
import { FC, useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
// COMPONENTS
import { Button } from '@base-components/button'
import { Calendar } from '@base-components/calendar'
import { Input } from '@base-components/input'
import { Popover, PopoverContent, PopoverTrigger } from '@base-components/popover'
import FormFieldTemplate from '@template-components/FormFieldTemplate'
// SHARED
import { CompleteFormFieldPorps } from '@shared-types/interfaces'

/**
 * Converts a UTC ISO string to a local Date that represents the same calendar day
 * as the UTC date, preventing the off-by-one issue for users in negative UTC offsets.
 */
function toUTCCalendarDate(isoString: string): Date | undefined {
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return undefined
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

/**
 * Converts a local calendar Date (year/month/day the user selected) to a UTC midnight
 * ISO string, producing an unambiguous value safe to transfer to the server.
 */
function toUTCMidnightISO(date: Date): string {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString()
}

function formatDate(date: Date | undefined): string {
  if (!date) return ''
  return format(date, 'MMMM dd, yyyy')
}

function isValidDate(date: Date | undefined): boolean {
  if (!date) return false
  return !Number.isNaN(date.getTime())
}

const DatePicker: FC<CompleteFormFieldPorps> = ({ label, name, value: propValue, placeholder }) => {
  const [open, setOpen] = useState(false)
  const initialDate = propValue ? toUTCCalendarDate(propValue) : new Date()
  const [date, setDate] = useState<Date | undefined>(initialDate)
  const [month, setMonth] = useState<Date | undefined>(date)
  const [displayValue, setDisplayValue] = useState(formatDate(date))
  const [hiddenValue, setHiddenValue] = useState(initialDate ? toUTCMidnightISO(initialDate) : '')

  return (
    <FormFieldTemplate label={label} name={name} message={undefined}>
      <input type="hidden" name={name} value={hiddenValue} />
      <section className="relative flex gap-2">
        <Input
          id={name}
          value={displayValue}
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={e => {
            const typed = e.target.value
            setDisplayValue(typed)
            const parsed = new Date(typed)
            if (isValidDate(parsed)) {
              setDate(parsed)
              setMonth(parsed)
              setHiddenValue(toUTCMidnightISO(parsed))
            }
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={selected => {
                setDate(selected)
                setDisplayValue(formatDate(selected))
                setHiddenValue(selected ? toUTCMidnightISO(selected) : '')
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </section>
    </FormFieldTemplate>
  )
}

export default DatePicker
