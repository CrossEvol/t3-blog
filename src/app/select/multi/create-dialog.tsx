import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { CirclePlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAtom } from 'jotai'
import TagsInput, { tagsAtom } from './tags-input'

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
  createNewOptions: (values: string[]) => void
}

const CreateDialog = ({ open, setOpen, createNewOptions }: IProps) => {
  const [tags] = useAtom(tagsAtom)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <TagsInput />
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3"
              onClick={() => {
                createNewOptions(tags)
                setOpen(false)
              }}
            >
              <span className="sr-only">Copy</span>
              <CirclePlus className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CreateDialog
