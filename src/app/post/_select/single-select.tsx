import { ColourOption } from '@/data/select-data'
import chroma from 'chroma-js'
import React, { useMemo } from 'react'
import Select, {
  components,
  type SingleValue,
  SingleValueProps,
} from 'react-select'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { CirclePlus } from 'lucide-react'

import { PropsWithSelect, type PropsWithOpen } from '@/common/props'
import { ColorOption, ColorOptions, CREATE_MARK } from '@/common/select-option'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'
import { createOption } from './create-option'
import NoneOptionSelect from './none-option-select'
import { useAtom } from 'jotai'
import { formAtom } from '../create/form-atom'
import { Controller } from 'react-hook-form'

interface CreateDialogProps extends PropsWithOpen {
  createNewOption: (value: string) => void
}

const CreateDialog = ({
  open,
  setOpen,
  createNewOption,
}: CreateDialogProps) => {
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

const SingleValue = ({
  children,
  ...props
}: SingleValueProps<ColourOption>) => (
  <>
    <components.SingleValue {...props}>{children}</components.SingleValue>
  </>
)

const SingleSelectUI = ({ options }: PropsWithSelect<ColorOptions>) => {
  const [form] = useAtom(formAtom)
  const [colorOptions, setColorOptions] = React.useState(options)
  const [open, setOpen] = React.useState(false)

  const handleChange = (option: SingleValue<ColourOption>) => {
    if (option?.value === 'create') {
      setOpen(true)
      return
    }
    form?.setValue('topic', option!)
  }

  const createNewOption = (newValue: string) => {
    const newOption = {
      value: `${CREATE_MARK}${newValue}`,
      label: newValue,
      color: chroma.random().hex(),
      isFixed: false,
    }
    setColorOptions([...colorOptions, newOption])
    form?.setValue('topic', newOption!)
  }

  return (
    <>
      <Controller
        name="topic"
        control={form?.control}
        render={({ field }) => (
          <>
            <Select
              value={field.value}
              isMulti={false}
              onChange={handleChange}
              isClearable
              styles={{
                singleValue: (base) => ({
                  ...base,
                  padding: 5,
                  borderRadius: 5,
                  background: form?.getValues('topic').color,
                  color: 'white',
                  display: 'flex',
                }),
              }}
              components={{ SingleValue }}
              isSearchable
              name="color"
              options={colorOptions}
            />
            <CreateDialog
              open={open}
              setOpen={setOpen}
              createNewOption={createNewOption}
            />
          </>
        )}
      />
    </>
  )
}

const SingleSelect = () => {
  const {
    isLoading,
    isError,
    data: topics,
  } = api.topic.getManyOrderByName.useQuery()
  if (isLoading) {
    return <NoneOptionSelect />
  }
  if (isError) {
    return null
  }

  if (!topics || !topics.length) {
    return <NoneOptionSelect />
  }
  return (
    <SingleSelectUI
      options={[
        createOption,
        ...topics.map(
          (topic) =>
            ({
              value: topic.id.toString(),
              label: topic.name,
              color: chroma.random().hex(),
            }) satisfies ColorOption,
        ),
      ]}
    />
  )
}

export default SingleSelect
