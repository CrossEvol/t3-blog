import { api } from '@/trpc/server'
import Blog from './_components/blog'
import PageBar from './_components/page-bar'

const Home = async () => {
  const postPage = await api.post.getPage.query({
    current: 1,
  })
  const tags = await api.tag.statistics.query({})
  const topics = await api.topic.statistics.query({})

  return (
    <div className="my-4 w-full px-4">
      <h1 className="pb-6 text-4xl font-bold">Public Feed</h1>
      <Blog posts={postPage.posts} topics={topics} tags={tags} />
      <div className="w-[32rem] border-t-2 border-solid pt-2">
        <PageBar count={postPage.count} current={postPage.current} />
      </div>
    </div>
  )
}

export default Home
