import { api } from '@/trpc/server'
import Blog from './_components/blog'

const Home = async () => {
  const posts = await api.post.getMany.query()
  const tags = await api.tag.statistics.query({})
  const topics = await api.topic.statistics.query({})

  return (
    <div className="my-4 w-full px-4">
      <h1 className="pb-6 text-4xl font-bold">Public Feed</h1>
      <Blog posts={posts} topics={topics} tags={tags} />
    </div>
  )
}

export default Home
