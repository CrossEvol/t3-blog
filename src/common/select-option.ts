import { z } from 'zod'

export type ColorOption = {
  readonly value: string
  readonly label: string
  readonly color: string
  readonly isFixed?: boolean
  readonly isDisabled?: boolean
}

export type ColorOptions = ColorOption[]

export type SelectOption = {
  readonly value: string
  readonly label: string
}

export type SelectOptions = SelectOption[]

export const CREATE_MARK = '$$$'

export const colorOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  color: z.string(),
})
