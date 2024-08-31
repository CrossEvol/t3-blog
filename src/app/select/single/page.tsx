'use client'

import dynamic from 'next/dynamic'

const SingleSelect = dynamic(() => import('./single-select'), { ssr: false })

const Page = () => {
  return (
    <div>
      <SingleSelect />
    </div>
  )
}

export default Page
