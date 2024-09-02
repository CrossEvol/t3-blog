import { type Tag, type Topic } from '@prisma/client'
import Post from './Post'

export type PostItem = {
  author: {
    name: string | null
    email: string | null
  }
} & {
  id: number
  title: string
  content: string
  published: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
} & {
  tags: Tag[]
  topic: Topic | null
}

type Props = {
  posts: PostItem[]
}

const PostList = ({ posts }: Props) => {
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

export default PostList
