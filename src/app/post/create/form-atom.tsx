import { CreatePostForm } from '@/common/trpc-schema'
import { atom } from 'jotai'

const formObjectAtom = atom<CreatePostForm>()
const hasAssignedAtom = atom(false)

export const formAtom = atom(
  (get) => get(formObjectAtom),
  (get, set, newValue: CreatePostForm) => {
    if (!get(hasAssignedAtom)) {
      set(formObjectAtom, newValue)
      set(hasAssignedAtom, true)
    } else {
      console.warn('The form object has already been assigned.')
      return
    }
  },
)
