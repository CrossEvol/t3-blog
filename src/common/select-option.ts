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

export const safeOption = {
  value: '',
  label: '',
  color: '#f5eded',
} satisfies ColorOption
