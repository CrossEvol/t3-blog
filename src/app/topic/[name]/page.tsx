import { api } from '@/trpc/server'
import TopicList from '../../_components/topic-list'

const Page = async ({ params }: { params: { name: string } }) => {
  const topics = await api.topic.statistics.query({})

  return (
    <div className="w-96 h-96 m-4">
      <TopicList topics={topics} />
    </div>
  )
}

export default Page
