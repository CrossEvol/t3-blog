import chroma from 'chroma-js'

import { type ColorOption, type ColorOptions } from '@/common/select-option'
import { api } from '@/trpc/react'
import MultiSelect from './multi-select'
import NoneOptionSelect from './none-option-select'

interface IProps {
  selectedOptions: ColorOptions
  setSelectedOptions: (options: ColorOptions) => void
}

const MultiTagsSelect = (props: IProps) => {
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
    <MultiSelect
      {...props}
      options={[
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

export default MultiTagsSelect
