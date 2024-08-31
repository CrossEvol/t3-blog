import { ColourOption, colourOptions } from '@/data/select-data'
import chroma from 'chroma-js'
import React from 'react'
import Select, {
  components,
  type SingleValue,
  SingleValueProps,
} from 'react-select'
import CreateDialog from './create-dialog'

const SingleValue = ({
  children,
  ...props
}: SingleValueProps<ColourOption>) => (
  <>
    <components.SingleValue {...props}>{children}</components.SingleValue>
  </>
)

const SingleSelect = () => {
  const [selectedOption, setSelectedOption] =
    React.useState<ColourOption | null>(null)
  const [colorOptions, setColorOptions] = React.useState(colourOptions)
  const [open, setOpen] = React.useState(false)

  const handleChange = (option: SingleValue<ColourOption>) => {
    if (option?.value === 'create') {
      setOpen(true)
      return
    }
    setSelectedOption(option)
  }

  const createNewOption = (newValue: string) => {
    const newOption = {
      value: newValue,
      label: newValue,
      color: chroma.random().hex(),
      isFixed: false,
    }
    setColorOptions([...colorOptions, newOption])
    setSelectedOption(newOption)
  }

  return (
    <>
      <Select
        value={selectedOption}
        isMulti={false}
        onChange={handleChange}
        isClearable
        styles={{
          singleValue: (base) => ({
            ...base,
            padding: 5,
            borderRadius: 5,
            background: selectedOption?.color,
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
  )
}

export default SingleSelect
