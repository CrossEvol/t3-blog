import React from 'react'
import Tooltip from '@atlaskit/tooltip'
import Select, { components, type NoticeProps } from 'react-select'
import chroma from 'chroma-js'

const msgStyles = {
  background: chroma.random().hex(),
  color: 'white',
}

const NoOptionsMessage = (props: NoticeProps) => {
  return (
    <Tooltip content="Custom NoOptionsMessage Component">
      <components.NoOptionsMessage {...props} />
    </Tooltip>
  )
}

const NoneOptionSelect = () => {
  return (
    <Select
      isClearable
      components={{ NoOptionsMessage }}
      styles={{ noOptionsMessage: (base) => ({ ...base, ...msgStyles }) }}
      isSearchable
      name="color"
      options={[]}
    />
  )
}

export default NoneOptionSelect
