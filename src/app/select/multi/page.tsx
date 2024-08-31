'use client'

import dynamic from 'next/dynamic'

const MultiSelect = dynamic(() => import('./multi-select'), { ssr: false })

const Page = () => {
  return (
    <div>
      <MultiSelect />
    </div>
  )
}

export default Page
