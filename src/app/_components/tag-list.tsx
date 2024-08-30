import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export type Tag = {
  id: number
  name: string
  count: number
}

interface IProps {
  tags: Tag[]
}

const TagList = ({ tags }: IProps) => {
  return (
    <div className="space-y-2">
      <h1 className="font-bold text-3xl text-gray-600">Tags</h1>
      <Separator />
      <div className="flex-wrap space-x-4 space-y-2">
        {tags.map((tag) => (
          <Button
            size={'sm'}
            className="bg-gray-300 text-blue-500"
            key={tag.id}
          >
            <Link href={`/tag/${tag.name}`}>
              {tag.name}
              <Badge className="ml-2 bg-blue-600">{tag.count}</Badge>
            </Link>
          </Button>
        ))}
      </div>
      <Separator />
      <Button>
        <Link href={'/'}>All Tags</Link>
      </Button>
    </div>
  )
}

export default TagList
