import Blog from '@/app/_components/blog'
import { api } from '@/trpc/server'

const Page = async ({ params }: { params: { name: string } }) => {
  const posts = await api.topic.getByName.query({ name: params.name })
  const topics = await api.topic.statistics.query({})
  const tags = await api.tag.statistics.query({})

  return (
    <div className="my-4 w-full px-4">
      <h1 className="pb-6 text-4xl font-bold">Public Feed</h1>
      <Blog posts={posts} topics={topics} tags={tags} />
    </div>
  )
}

export default Page
