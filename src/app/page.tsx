import { api } from '@/trpc/server'
import Blog from './_components/blog'
import TagList from './_components/tag-list'
import TopicList from './_components/topic-list'

const Home = async () => {
  const posts = await api.post.getMany.query()
  const tags = await api.tag.statistics.query({})
  const topics = await api.topic.statistics.query({})

  return (
    <div className="my-4 w-full px-4">
      <h1 className="pb-6 text-4xl font-bold">Public Feed</h1>
      <div className="grid grid-cols-12 space-x-2">
        <div className="col-span-8">
          <Blog posts={posts} />
        </div>
        <div className="col-span-4">
          <div className="flex flex-col ml-2 pl-4 border-l-2 border-solid">
            <TopicList topics={topics} />
            <TagList tags={tags} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
