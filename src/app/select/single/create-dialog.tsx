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
import { Input } from '@/components/ui/input'
import React from 'react'

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
  createNewOption: (value: string) => void
}

const CreateDialog = ({ open, setOpen, createNewOption }: IProps) => {
  const [text, setText] = React.useState('')

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
              <Input
                id="link"
                placeholder="New topic ..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3"
              onClick={() => {
                createNewOption(text)
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
