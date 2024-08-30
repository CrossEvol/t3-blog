import PostList, { type PostItem } from './post-list'
import TagList, { type Tag } from './tag-list'
import TopicList, { type Topic } from './topic-list'

interface IProps {
  posts: PostItem[]
  tags: Tag[]
  topics: Topic[]
}

const Blog = async ({ posts, tags, topics }: IProps) => {
  return (
    <div className="grid grid-cols-12 space-x-2">
      <div className="col-span-8">
        <PostList posts={posts} />
      </div>
      <div className="col-span-4">
        <div className="flex flex-col ml-2 pl-4 border-l-2 border-solid">
          <TopicList topics={topics} />
          <TagList tags={tags} />
        </div>
      </div>
    </div>
  )
}

export default Blog
