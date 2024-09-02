import TooltipWrapper from '@/app/_components/tooltip-wrapper'
import { type ColourOption, colourOptions } from '@/data/select-data'
import React from 'react'
import Select, {
  components,
  type MultiValue,
  type MultiValueGenericProps,
} from 'react-select'

import { type PropsWithSelect } from '@/common/props'
import { type ColorOption, type ColorOptions } from '@/common/select-option'

const MultiValueLabel = (props: MultiValueGenericProps<ColourOption>) => {
  return (
    <TooltipWrapper content={'just it'}>
      <components.MultiValueLabel {...props} />
    </TooltipWrapper>
  )
}

interface MultiSelectUIProps extends PropsWithSelect<ColorOptions> {
  selectedOptions: ColorOptions
  setSelectedOptions: (options: ColorOptions) => void
}

const MultiSelect = ({
  options,
  selectedOptions,
  setSelectedOptions,
}: MultiSelectUIProps) => {
  const [colorOptions] = React.useState(options)

  const handleChange = (options: MultiValue<ColorOption>) => {
    if (options.map((option) => option.value).includes('create')) {
      return
    }
    setSelectedOptions(options.map((option) => ({ ...option })))
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
    </>
  )
}

export default MultiSelect
