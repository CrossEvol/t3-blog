import { api } from '@/trpc/server'
import TagList from '../_components/tag-list'

const Page = async () => {
  const tags = await api.tag.statistics.query({})

  return (
    <div className="w-96 h-96 m-4">
      <TagList tags={tags} />
    </div>
  )
}

export default Page
