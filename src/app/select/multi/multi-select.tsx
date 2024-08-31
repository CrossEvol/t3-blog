import { ColourOption, colourOptions } from '@/data/select-data'
import chroma from 'chroma-js'
import React from 'react'
import Select, {
  components,
  MultiValue,
  MultiValueGenericProps,
} from 'react-select'
import CreateDialog from './create-dialog'
import TooltipWrapper from '@/app/_components/tooltip-wrapper'

const MultiValueLabel = (props: MultiValueGenericProps<ColourOption>) => {
  return (
    <TooltipWrapper content={'just it'}>
      <components.MultiValueLabel {...props} />
    </TooltipWrapper>
  )
}

const MultiSelect = () => {
  const [selectedOptions, setSelectedOptions] = React.useState<ColourOption[]>(
    [],
  )
  const [colorOptions, setColorOptions] = React.useState(colourOptions)
  const [open, setOpen] = React.useState(false)

  const handleChange = (options: MultiValue<ColourOption>) => {
    if (options.map((option) => option.value).includes('create')) {
      setOpen(true)
      return
    }
    setSelectedOptions(options.map((option) => ({ ...option })))
  }

  const createNewOptions = (newValues: string[]) => {
    const newOptions = newValues.map((newValue) => ({
      value: newValue,
      label: newValue,
      color: chroma.random().hex(),
      isFixed: false,
    }))
    setColorOptions([...colorOptions, ...newOptions])
    setSelectedOptions([...selectedOptions, ...newOptions])
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

export default MultiSelect
