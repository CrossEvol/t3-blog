import CommentList from '@/app/post/_comment/CommentList'
import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'
import CommentForm from '../_comment/CommentForm'
import ShowPost from './show-post'

const Page = async ({ params }: { params: { id: string } }) => {
  const post = await api.post.getOne.query({ id: Number(params.id) })
  const session = await getServerAuthSession()

  if (!post) {
    return null
  }

  const comments = await api.comment.getMany.query({ postId: post.id })

  return (
    <div className="container space-y-4 mx-4">
      <ShowPost post={post} />
      <div className="w-1/2">
        <CommentForm session={session} postId={post.id} />
        <CommentList post={post} comments={comments} />
      </div>
    </div>
  )
}

export default Page
