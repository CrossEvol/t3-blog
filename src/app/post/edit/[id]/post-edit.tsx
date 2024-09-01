'use client'

import type { PostItem } from '@/app/_components/post-list'
import { updatePostFormSchema } from '@/common/trpc-schema'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleEllipsis } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { type z } from 'zod'
import { TabsEnum } from '../../constants'
import FabContainer from '../../fab-container'
import PublishSelect from './publish-select'
import UpdateOptions from './update-options'
import { type Tag, type Topic } from '@prisma/client'
import chroma from 'chroma-js'

const Editor = dynamic(() => import('../../../_components/rich-text-editor'), {
  ssr: false,
})

interface Props {
  post: PostItem & { topic: Topic | null; tags: Tag[] }
}

const PostEdit = ({ post }: Props) => {
  const form = useForm<z.infer<typeof updatePostFormSchema>>({
    resolver: zodResolver(updatePostFormSchema),
    defaultValues: {
      id: post.id,
      title: post.title,
      content: post.content,
      published: post.published,
      topic: {
        value: post.topic?.id.toString(),
        label: post.topic?.name,
        color: chroma.random().hex(),
      },
      tags: post.tags.map((tag) => ({
        value: tag.id.toString(),
        label: tag.name,
        color: chroma.random().hex(),
      })),
    },
  })
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pub, setPub] = useState('public')

  const updatePost = api.post.update.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/post/${id}`)
    },
    onError(error, _variables, _context) {
      console.error(error)
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
          console.log(form.getValues())
          updatePost.mutate({
            ...form.getValues(),
            topic:
              form.getValues('topic') !== null
                ? form.getValues('topic')
                : undefined,
          })
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
            <div className="flex flex-row space-x-4 w-full items-center">
              <UpdateOptions open={open} setOpen={setOpen} form={form} />
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
              <Controller
                name="title"
                control={form.control}
                render={({ field }) => (
                  <input
                    autoFocus
                    {...field}
                    placeholder="Title"
                    type="text"
                    className="rounded border p-2 w-1/2"
                  />
                )}
              />
              <h1 className="text-2xl font-bold">Edit Draft</h1>
            </div>
            <Controller
              name="content"
              control={form.control}
              render={({ field }) => (
                <>
                  <TabsContent value={TabsEnum.markdown}>
                    <Textarea
                      {...field}
                      cols={50}
                      placeholder="Content"
                      rows={40}
                      className="mb-2 w-full rounded border p-2"
                    />
                  </TabsContent>
                  <TabsContent value={TabsEnum.editor}>
                    <div className="min-h-96 bg-white">
                      <Editor
                        postId={post.id}
                        content={field.value}
                        setContent={field.onChange}
                      />
                    </div>
                  </TabsContent>
                </>
              )}
            />
          </form>
        </div>
      </FabContainer>
    </>
  )
}

export default PostEdit
