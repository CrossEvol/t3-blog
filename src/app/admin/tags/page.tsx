import { api } from '@/trpc/server'
import { Tag } from '@prisma/client'
import TagGrid from './tag-grid'

export type TagWithCount = Tag & { count: number }

const Topics = async () => {
  const tags = await api.tag.getManyForAdmin.query({})

  return (
    <div>
      <TagGrid tags={tags} />
    </div>
  )
}

export default Topics
