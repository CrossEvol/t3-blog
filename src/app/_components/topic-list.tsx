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
    <div className="space-y-2 my-2">
      <div className="w-1/2 flex flex-row justify-between">
        <h1 className="font-bold text-3xl text-gray-600">Topics</h1>
        <Button>
          <Link href={'/'}>All Topics</Link>
        </Button>
      </div>
      <Separator />
      <div className="flex-wrap space-x-4 space-y-2">
        {topics.map((topic) => 
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
        )}
      </div>
      <Separator />
    </div>
  )
}

export default TopicList
