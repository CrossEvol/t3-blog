'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { DatePresetEnum, type SearchPostForm } from '@/common/trpc-schema'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Controller } from 'react-hook-form'

interface IProps {
  form: SearchPostForm
}

export function DatePickerWithPresets({ form }: IProps) {
  const [date, setDate] = React.useState<Date>(form.getValues('date')!)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Controller
          name="datePreset"
          control={form.control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                {Object.entries(DatePresetEnum).map(([k, v]) => (
                  <SelectItem key={k} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <div className="rounded-md border">
          <Controller
            name="date"
            control={form.control}
            render={({ field }) => (
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(value) => {
                  field.onChange(value)
                  setDate(value!)
                }}
              />
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
