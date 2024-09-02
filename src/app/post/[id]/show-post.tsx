import type { PostItem } from '@/app/_components/post-list'
import { Badge } from '@/components/ui/badge'
import { getServerAuthSession } from '@/server/auth'
import { Bookmark, ChartBarStacked, Signature } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ShowActionsWrapper from './show-actions-wrapper'

interface Props {
  post: PostItem
}

const ShowPost = async ({ post }: Props) => {
  const session = await getServerAuthSession()
  let title = post.title
  if (!post.published) {
    title = `${title} (Draft)`
  }

  return (
    <>
      <div className="">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-8">
            <h2 className="mb-4 text-2xl font-bold">{title}</h2>
            <ShowActionsWrapper post={post} user={session!.user} />
          </div>
          <div className="flex flex-row space-x-4 items-center flex-wrap">
            <div className="mx-2">
              <Badge variant={'secondary'} className="space-x-2">
                <Signature />
                <span>By {post?.author?.name ?? 'Unknown author'}</span>
              </Badge>
            </div>
            {[
              ...post.tags.map((tag) => ({ ...tag, keyID: `tag-${tag.id}` })),
              { ...post.topic, keyID: `topic-${post.topic?.id}` },
            ]
              .filter((item) => item !== null)
              .map((item) => 
                <Badge
                  variant={'outline'}
                  key={item.keyID}
                  className="space-x-1"
                >
                  {item.keyID.startsWith('tag-') ? 
                    <Bookmark />
                   : 
                    <ChartBarStacked />
                  }
                  <span>{item?.name}</span>
                </Badge>
              )}
          </div>
          <div className="bg-white p-8">
            <div className="prose prose-slate ">
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="mt-4 ">
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShowPost
