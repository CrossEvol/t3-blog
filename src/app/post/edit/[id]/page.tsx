import { api } from '@/trpc/server'
import PostEdit from './post-edit'

const Page = async ({ params }: { params: { id: string } }) => {
  const post = await api.post.getOne.query({ id: Number(params.id) })

  if (!post) {
    return null
  }
  return (
    <>
      <PostEdit post={post} />
    </>
  )
}

export default Page
