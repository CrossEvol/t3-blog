import { api } from '@/trpc/server'
import { type Topic } from '@prisma/client'
import TopicGrid from './topic-grid'

export type TopicWithCount = Topic & { count: number }

const Topics = async () => {
  const topics = await api.topic.getManyForAdmin.query()

  return (
    <div>
      <TopicGrid topics={topics} />
    </div>
  )
}

export default Topics
