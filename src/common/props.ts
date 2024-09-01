import { type SelectOptions } from './select-option'

export interface PropsWithOpen {
  open: boolean
  setOpen: (open: boolean) => void
}

export interface PropsWithSelect<T extends SelectOptions> {
  options: T
}
