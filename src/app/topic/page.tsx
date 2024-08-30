import { api } from '@/trpc/server'
import React from 'react'
import TopicList from '../_components/topic-list'

const Page = async () => {
  const topics = await api.topic.statistics.query({})

  return (
    <div className="w-96 h-96 m-4">
      <TopicList topics={topics} />
    </div>
  )
}

export default Page
