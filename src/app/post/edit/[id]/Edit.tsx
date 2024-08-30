'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/trpc/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { TabsEnum } from '../../constants'
import FabContainer from '../../fab-container'
import PublishSelect from './publish-select'
import type { PostItem } from '@/app/_components/post-list'

const Editor = dynamic(() => import('../../../_components/rich-text-editor'), {
  ssr: false,
})

interface Props {
  post: PostItem
}

const PostEdit = ({ post }: Props) => {
  const router = useRouter()
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [pub, setPub] = useState('public')

  const updatePost = api.post.update.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/post/${id}`)
    },
  })

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()
  }

  const FabContent = (
    <>
      <TabsList>
        <TabsTrigger value={TabsEnum.markdown}>Markdown</TabsTrigger>
        <TabsTrigger value={TabsEnum.editor}>RichEditor</TabsTrigger>
      </TabsList>
      <Separator orientation="vertical" />
      <PublishSelect pub={pub} setPub={setPub} />
      <Separator orientation="vertical" />
      <Button
        onClick={() => {
          try {
            updatePost.mutate({
              id: post.id,
              title,
              content: content,
              published: pub === 'public',
            })
          } catch (error) {
            console.error(error)
          }
        }}
      >
        {updatePost.isLoading ? 'Publishing...' : 'Publish'}
      </Button>
      <Button className="opacity-50" onClick={() => router.back()}>
        Cancel
      </Button>
    </>
  )

  return (
    <>
      <FabContainer components={FabContent}>
        <div className="ml-8 flex flex-col items-center justify-center p-3">
          <form
            onSubmit={submitData}
            className="mx-auto flex min-w-full flex-col space-y-4"
          >
            <h1 className="mb-4 text-2xl font-bold">Edit Draft</h1>
            <input
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              type="text"
              value={title}
              className="mb-2 w-full rounded border p-2"
            />
            <TabsContent value={TabsEnum.markdown}>
              <Textarea
                cols={50}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                rows={40}
                value={content ?? ''}
                className="mb-2 w-full rounded border p-2"
              />
            </TabsContent>
            <TabsContent value={TabsEnum.editor}>
              <div className="min-h-96 bg-white">
                <Editor
                  postId={post.id}
                  content={content}
                  setContent={setContent}
                />
              </div>
            </TabsContent>
          </form>
        </div>
      </FabContainer>
    </>
  )
}

export default PostEdit
