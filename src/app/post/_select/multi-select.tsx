import TooltipWrapper from '@/app/_components/tooltip-wrapper'
import { type ColourOption, colourOptions } from '@/data/select-data'
import chroma from 'chroma-js'
import React from 'react'
import Select, {
  components,
  type MultiValue,
  type MultiValueGenericProps,
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

import { type PropsWithOpen, type PropsWithSelect } from '@/common/props'
import {
  type ColorOption,
  type ColorOptions,
  CREATE_MARK,
} from '@/common/select-option'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { atom, useAtom } from 'jotai'
import { createOption } from './create-option'
import NoneOptionSelect from './none-option-select'

export const tagsAtom = atom<string[]>([])

const TagsInput = () => {
  const [tags, setTags] = useAtom<string[]>(tagsAtom)
  const [inputValue, setInputValue] = React.useState<string>('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const newTags = [...tags, inputValue.trim()]
      setTags(newTags)
      setInputValue('')
    }
  }

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
  }

  return (
    <div className="border rounded-md p-2 flex flex-wrap items-center">
      {tags.map((tag, index) => 
        <div
          key={index}
          className="bg-gray-200 text-gray-700 px-2  rounded-full flex items-center mr-2 my-2"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </div>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow focus:outline-none my-2"
        placeholder="Add a tag..."
      />
    </div>
  )
}

interface CreateDialogProps extends PropsWithOpen {
  createNewOptions: (values: string[]) => void
}

const CreateDialog = ({
  open,
  setOpen,
  createNewOptions,
}: CreateDialogProps) => {
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

const MultiValueLabel = (props: MultiValueGenericProps<ColourOption>) => {
  return (
    <TooltipWrapper content={'just it'}>
      <components.MultiValueLabel {...props} />
    </TooltipWrapper>
  )
}

interface MultiSelectUIProps
  extends PropsWithSelect<ColorOptions>,
    MultiSelectProps {}

const MultiSelectUI = ({
  options,
  selectedOptions,
  setSelectedOptions,
}: MultiSelectUIProps) => {
  const [colorOptions, setColorOptions] = React.useState(options)
  const [open, setOpen] = React.useState(false)

  const handleChange = (options: MultiValue<ColorOption>) => {
    if (options.map((option) => option.value).includes('create')) {
      setOpen(true)
      return
    }
    setSelectedOptions(options.map((option) => ({ ...option })))
  }

  const createNewOptions = (newValues: string[]) => {
    const newOptions = newValues.map((newValue) => ({
      value: `${CREATE_MARK}${newValue}`,
      label: newValue,
      color: chroma.random().hex(),
      isFixed: false,
    }))
    setColorOptions([...colorOptions, ...newOptions])
    setSelectedOptions([
      ...selectedOptions,
      ...newOptions.filter(
        (item) =>
          !new Set(selectedOptions.map((tagOption) => tagOption.label)).has(
            item.label,
          ),
      ),
    ])
  }

  return (
    <>
      <Select
        closeMenuOnSelect={false}
        value={selectedOptions}
        onChange={handleChange}
        components={{ MultiValueLabel }}
        styles={{
          multiValueLabel: (base) => ({
            ...base,
            backgroundColor: colourOptions[2]?.color,
            color: 'white',
          }),
        }}
        isMulti
        options={colorOptions}
      />
      <CreateDialog
        open={open}
        setOpen={setOpen}
        createNewOptions={createNewOptions}
      />
    </>
  )
}

interface MultiSelectProps {
  selectedOptions: ColorOptions
  setSelectedOptions: (options: ColorOptions) => void
}

const MultiSelect = (props: MultiSelectProps) => {
  const {
    isLoading,
    isError,
    data: tags,
  } = api.tag.getManyOrderByName.useQuery()

  if (isLoading) {
    return <NoneOptionSelect />
  }
  if (isError) {
    return null
  }

  if (!tags?.length) {
    return <NoneOptionSelect />
  }

  return (
    <MultiSelectUI
      {...props}
      options={[
        createOption,
        ...tags.map(
          (tag) =>
            ({
              value: tag.id.toString(),
              label: tag.name,
              color: chroma.random().hex(),
            }) satisfies ColorOption,
        ),
      ]}
    />
  )
}

export default MultiSelect
