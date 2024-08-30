import Markdown from '@/components/markdown'
import React from 'react'
import { type PostItem } from './post-list'

const Post: React.FC<{ post: PostItem }> = ({ post }) => {
  const authorName = post.author ? post.author.name : 'Unknown author'
  return (
    <div className="relative m-2 mr-0 flex max-h-56 flex-col space-y-6 overflow-y-scroll bg-inherit px-8 py-12 text-inherit scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-slate-300">
      <h2 className="text-2xl font-semibold">{post.title}</h2>
      <small>By {authorName}</small>
      <Markdown content={post.content} />
      <a href={`/post/${post.id}`} className="absolute inset-0 z-10" />
    </div>
  )
}

export default Post
