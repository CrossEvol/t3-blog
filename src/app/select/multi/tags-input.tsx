import { atom, useAtom } from 'jotai'
import React, { useState } from 'react'

export const tagsAtom = atom<string[]>([])

const TagsInput = () => {
  const [tags, setTags] = useAtom<string[]>(tagsAtom)
  const [inputValue, setInputValue] = useState<string>('')

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
      {tags.map((tag, index) => (
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
      ))}
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

export default TagsInput
