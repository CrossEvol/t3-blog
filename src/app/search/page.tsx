import { type PostSearchParams, safeDateParam } from '@/common/trpc-schema'
import { api } from '@/trpc/server'
import { type Post, type Tag, type Topic, type User } from '@prisma/client'
import SearchPortal from './search-portal'

export type SearchedPost = Post & {
  author: Pick<User, 'name' | 'email'>
  topic: Pick<Topic, 'id' | 'name'> | null
  tags: Pick<Tag, 'id' | 'name'>[]
  comments: number
}

export type SearchParams = PostSearchParams

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const startDay = safeDateParam(searchParams.startDay)
  const endDay = safeDateParam(searchParams.endDay)
  const tags = !!searchParams.tags
    ? typeof searchParams.tags === 'string'
      ? [searchParams.tags]
      : searchParams.tags
    : undefined
  const topics = !!searchParams.topics
    ? typeof searchParams.topics === 'string'
      ? [searchParams.topics]
      : searchParams.topics
    : undefined

  const hasSearched = Object.keys(searchParams).length !== 0

  const posts = hasSearched
    ? await api.post.search.query({
        ...searchParams,
        startDay,
        endDay,
        tags: tags,
        topics: topics,
      })
    : []

  return (
    <div>
      <SearchPortal posts={posts} hasSearched={hasSearched} />
    </div>
  )
}

export default Page
