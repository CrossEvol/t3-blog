import chroma from 'chroma-js'

import { type ColorOption, type ColorOptions } from '@/common/select-option'
import { api } from '@/trpc/react'
import MultiSelect from './multi-select'
import NoneOptionSelect from './none-option-select'

interface IProps {
  selectedOptions: ColorOptions
  setSelectedOptions: (options: ColorOptions) => void
}

const MultiTopicsSelect = (props: IProps) => {
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

  if (!topics?.length) {
    return <NoneOptionSelect />
  }

  return (
    <MultiSelect
      {...props}
      options={[
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

export default MultiTopicsSelect
