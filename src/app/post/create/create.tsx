'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/trpc/react'
import { CircleEllipsis } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { TabsEnum } from '../constants'
import FabContainer from '../fab-container'
import CreateOptions from './create-options'

const Editor = dynamic(() => import('@/app/_components/rich-text-editor'), {
  ssr: false,
})

const Create = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const createPost = api.post.create.useMutation({
    onSuccess: ({ id }) => {
      setTitle('')
      setContent('')
      router.push(`/post/${id}`)
    },
  })

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      createPost.mutate({ title, content })
    } catch (error) {
      console.error(error)
    }
  }

  const clearData = () => {
    setTitle('')
    setContent('')
  }

  const FabContent = (
    <>
      <TabsList>
        <TabsTrigger value={TabsEnum.markdown}>Markdown</TabsTrigger>
        <TabsTrigger value={TabsEnum.editor}>RichEditor</TabsTrigger>
      </TabsList>
      <Separator orientation="vertical" />
      <Button
        disabled={!content || !title || createPost.isLoading}
        onClick={() => {
          try {
            createPost.mutate({ title, content })
          } catch (error) {
            console.error(error)
          }
        }}
      >
        {createPost.isLoading ? 'Creating...' : 'Create'}
      </Button>
      <Button className="opacity-50" onClick={clearData}>
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
            <div className="flex flex-row space-x-4 w-full items-center">
              <CreateOptions open={open} setOpen={setOpen} />
              <Button
                type="button"
                size="sm"
                className="px-3"
                onClick={() => {
                  setOpen(true)
                }}
              >
                <span className="sr-only">Options</span>
                <CircleEllipsis className="h-4 w-4" />
              </Button>
              <input
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                type="text"
                value={title}
                className="rounded border p-2 w-1/2"
              />
              <h1 className="text-2xl font-bold">New Draft</h1>
            </div>
            <TabsContent value={TabsEnum.markdown}>
              <Textarea
                cols={50}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                rows={20}
                value={content ?? ''}
                className="mb-2 w-full rounded border p-2"
              />
            </TabsContent>
            <TabsContent value={TabsEnum.editor}>
              <div className="min-h-96 bg-white">
                <Editor postId={0} content={content} setContent={setContent} />
              </div>
            </TabsContent>
          </form>
        </div>
      </FabContainer>
    </>
  )
}

export default Create
