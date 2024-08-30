import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export type Topic = {
  id: number
  name: string
  count: number
}

interface IProps {
  topics: Topic[]
}

const TopicList = ({ topics }: IProps) => {
  return (
    <div className="space-y-2">
      <h1 className="font-bold text-3xl text-gray-600">Topics</h1>
      <Separator />
      <div className="flex-wrap space-x-4 space-y-2">
        {topics.map((topic) => (
          <Button
            size={'sm'}
            className="bg-gray-300 text-blue-500"
            key={topic.id}
          >
            <Link href={`/topic/${topic.name}`}>
              {topic.name}
              <Badge className="ml-2 bg-blue-600">{topic.count}</Badge>
            </Link>
          </Button>
        ))}
      </div>
      <Separator />
      <Button>
        <Link href={`/`}>All Topics</Link>
      </Button>
    </div>
  )
}

export default TopicList
