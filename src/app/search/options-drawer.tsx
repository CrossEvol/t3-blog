import { type SearchPostForm } from '@/common/trpc-schema'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import OptionsForm from './options-form'

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
  form: SearchPostForm
  onSubmit: () => void
}

const OptionsDrawer = ({ open, setOpen, form, onSubmit }: IProps) => {
  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Search Options</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col">
            <OptionsForm form={form} />
          </div>
          <DrawerFooter>
            <Button
              type="submit"
              onClick={() => {
                onSubmit()
                setTimeout(() => setOpen(false), 200)
              }}
            >
              Submit
            </Button>
            <DrawerClose>
              <div className="h-10 leading-10 rounded-md border-2 border-solid">
                Cancel
              </div>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default OptionsDrawer
