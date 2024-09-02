import type { PostItem } from '@/app/_components/post-list'
import { type SessionUser } from '@/common/auth'
import { type PropsWithOpen } from '@/common/props'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Link from 'next/link'
import DeleteButton from './delete-button'
import PublishButton from './publish-button'

interface IProps extends PropsWithOpen {
  post: PostItem
  user: SessionUser
}

const ShowActions = ({ post, open, setOpen, user }: IProps) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent className="w-[28rem] mt-2">
        <div>
          {user.name === post.author.name && 
            <div className="flex justify-between">
              <Link href={`/post/edit/${post.id}`}>
                <button
                  value="Edit"
                  className="w-32 cursor-pointer border-0 bg-gray-200 px-8 py-4 text-center text-gray-700 hover:bg-blue-600 hover:text-white font-bold"
                >
                  {'Edit'}
                </button>
              </Link>
              <PublishButton post={post} />
              <DeleteButton post={post} />
            </div>
          }
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ShowActions
