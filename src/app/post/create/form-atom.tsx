import { atom } from 'jotai'
import { type FormAtom } from './create'

const formObjectAtom = atom<FormAtom>()
const hasAssignedAtom = atom(false)

export const formAtom = atom(
  (get) => get(formObjectAtom),
  (get, set, newValue: FormAtom) => {
    if (!get(hasAssignedAtom)) {
      set(formObjectAtom, newValue)
      set(hasAssignedAtom, true)
    } else {
      console.warn('The form object has already been assigned.')
      return
    }
  },
)
