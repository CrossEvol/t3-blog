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
import React from 'react'
import OptionsForm from './options-form'

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const OptionsDrawer = ({ open, setOpen }: IProps) => {
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
            <OptionsForm />
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default OptionsDrawer
