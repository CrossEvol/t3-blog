import type { PostItem } from '@/app/_components/post-list'
import type { CommentModel } from '@/interfaces'
import distanceToNow from '@/lib/dateRelative'
import { getServerAuthSession } from '@/server/auth'
import Image from 'next/image'
import CommentDelete from './CommentDelete'

type CommentListProps = {
  comments?: CommentModel[]
  post: PostItem
}

const CommentList = async ({ comments, post }: CommentListProps) => {
  const session = await getServerAuthSession()

  return (
    <div className="mt-10 space-y-6">
      {comments?.map((comment) => {
        return (
          <div key={comment.id} className="flex space-x-4">
            <div className="flex-shrink-0">
              <Image
                src={comment.user.image!}
                alt={comment.user.name!}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>

            <div className="flex-grow">
              <div className="flex space-x-2">
                <b>{comment.user.name}</b>
                <time className="text-gray-400">
                  {distanceToNow(comment.createdAt.getTime())}
                </time>
                <CommentDelete
                  session={session}
                  post={post}
                  commentId={comment.id}
                />
              </div>

              <div>{comment.text}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CommentList
