'use client'

import { createPostFormSchema, createPostSchema } from '@/common/trpc-schema'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleEllipsis } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { type z } from 'zod'
import { TabsEnum } from '../constants'
import FabContainer from '../fab-container'
import CreateOptions from './create-options'

const Editor = dynamic(() => import('@/app/_components/rich-text-editor'), {
  ssr: false,
})

const PostCreate = () => {
  const form = useForm<z.infer<typeof createPostFormSchema>>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      title: '',
      content: '',
      published: false,
    },
  })
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const createPost = api.post.create.useMutation({
    onSuccess: ({ id }) => {
      form.reset()
      router.push(`/post/${id}`)
    },
    onError(error, _variables, _context) {
      console.log(error)
    },
  })

  function onSubmit(values: z.infer<typeof createPostFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    createPost.mutate({ ...values })
  }

  const FabContent = 
    <>
      <TabsList>
        <TabsTrigger value={TabsEnum.markdown}>Markdown</TabsTrigger>
        <TabsTrigger value={TabsEnum.editor}>RichEditor</TabsTrigger>
      </TabsList>
      <Separator orientation="vertical" />
      <Button
        onClick={() => {
          const safeParsedResult = createPostSchema.safeParse(form.getValues())
          if (!safeParsedResult.success) {
            console.error(safeParsedResult.error.errors)
            return
          }
          console.log(form.getValues())
          createPost.mutate({ ...form.getValues() })
        }}
      >
        {createPost.isLoading ? 'Creating...' : 'Create'}
      </Button>
      <Button className="opacity-50" onClick={() => form.reset()}>
        Cancel
      </Button>
    </>
  

  return (
    <>
      <FabContainer components={FabContent}>
        <div className="ml-8 flex flex-col items-center justify-center p-3">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto flex min-w-full flex-col space-y-4"
          >
            <div className="flex flex-row space-x-4 w-full items-center">
              <CreateOptions open={open} setOpen={setOpen} form={form} />
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
                render={({ field }) => 
                  <input
                    autoFocus
                    {...field}
                    placeholder="Title"
                    type="text"
                    className="rounded border p-2 w-1/2"
                  />
                }
              />
              <h1 className="text-2xl font-bold">New Draft</h1>
            </div>
            <Controller
              name="content"
              control={form.control}
              render={({ field }) => 
                <>
                  <TabsContent value={TabsEnum.markdown}>
                    <Textarea
                      {...field}
                      cols={50}
                      placeholder="Content"
                      rows={20}
                      className="mb-2 w-full rounded border p-2"
                    />
                  </TabsContent>
                  <TabsContent value={TabsEnum.editor}>
                    <div className="min-h-96 bg-white">
                      <Editor
                        postId={0}
                        content={field.value}
                        setContent={field.onChange}
                      />
                    </div>
                  </TabsContent>
                </>
              }
            />
          </form>
        </div>
      </FabContainer>
    </>
  )
}

export default PostCreate
