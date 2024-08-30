import { getServerAuthSession } from '@/server/auth'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import type { PostItem } from '@/app/_components/post-list'

interface IProps {
  post: PostItem
}

const PostActions = async ({ post }: IProps) => {
  const session = await getServerAuthSession()

  return (
    <>
      {session?.user.name === post.author.name && (
        <div className="ml-8 mt-12 flex w-1/5 justify-between">
          <Link href={`/post/edit/${post.id}`}>
            <button
              value="Edit"
              className="w-32 cursor-pointer border-0 bg-gray-200 px-8 py-4 text-center text-gray-500 hover:bg-blue-600 hover:text-white"
            >
              {'Edit'}
            </button>
          </Link>
          <DeleteButton post={post} />
        </div>
      )}
    </>
  )
}

export default PostActions
