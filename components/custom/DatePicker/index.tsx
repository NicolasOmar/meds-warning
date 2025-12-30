'use client'
// CORE
import { FC, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
// COMPONENTS
import { Button } from '@base-components/button'
import { Calendar } from '@base-components/calendar'
import { Input } from '@base-components/input'
import { Label } from '@base-components/label'
import { Popover, PopoverContent, PopoverTrigger } from '@base-components/popover'

interface DatePickerProps {
  label: string
  name: string
  value?: string
  placeholder?: string
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

const DatePicker: FC<DatePickerProps> = ({ label, name, value: propValue, placeholder }) => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(propValue ? new Date(propValue) : new Date())
  const [month, setMonth] = useState<Date | undefined>(date)
  const [value, setValue] = useState(formatDate(date))

  return (
    <section className="flex flex-col gap-3">
      <Label htmlFor={name} className="px-1">
        {label}
      </Label>
      <section className="relative flex gap-2">
        <Input
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={e => {
            const date = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(date)) {
              setDate(date)
              setMonth(date)
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
              onSelect={date => {
                setDate(date)
                setValue(formatDate(date))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </section>
    </section>
  )
}

export default DatePicker
