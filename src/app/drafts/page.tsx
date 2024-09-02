import { api } from '@/trpc/server'
import Post from '../_components/Post'
import type { PostItem } from '../_components/post-list'

type Props = {
  posts: PostItem[]
}

const Blog: React.FC<Props> = ({ posts }) => {
  return (
    <main className="space-y-8">
      {posts.map((post) => 
        <div
          key={post.id}
          className=" bg-white transition-shadow duration-100 ease-in hover:shadow-md"
        >
          <Post post={post} />
        </div>
      )}
    </main>
  )
}

const Home = async () => {
  const posts = await api.post.getDrafts.query()

  return (
    <div className="my-4 ml-8 w-11/12">
      <h1 className="pb-6 text-4xl font-bold">Drafts</h1>
      <Blog posts={posts} />
    </div>
  )
}

export default Home
