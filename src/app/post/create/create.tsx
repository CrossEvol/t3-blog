'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { CircleEllipsis } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { TabsEnum } from '../constants'
import FabContainer from '../fab-container'
import CreateOptions from './create-options'
import { formAtom } from './form-atom'
import { colorOptionSchema } from '@/common/select-option'

const Editor = dynamic(() => import('@/app/_components/rich-text-editor'), {
  ssr: false,
})

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(colorOptionSchema),
  topic: colorOptionSchema,
  published: z.boolean(),
})

export type FormAtom = UseFormReturn<z.infer<typeof formSchema>>

export const Create = () => {
  const [, setForm] = useAtom(formAtom)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      published: false,
    },
  })
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      createPost.mutate({ title, content })
    } catch (error) {
      console.error(error)
    }
  }

  const FabContent = (
    <>
      <TabsList>
        <TabsTrigger value={TabsEnum.markdown}>Markdown</TabsTrigger>
        <TabsTrigger value={TabsEnum.editor}>RichEditor</TabsTrigger>
      </TabsList>
      <Separator orientation="vertical" />
      <Button
        disabled={
          !form.getValues('content') ||
          !form.getValues('title') ||
          createPost.isLoading
        }
        onClick={() => {
          console.log(form.getValues())
          // try {
          //   createPost.mutate({ title, content })
          // } catch (error) {
          //   console.error(error)
          // }
        }}
      >
        {createPost.isLoading ? 'Creating...' : 'Create'}
      </Button>
      <Button className="opacity-50" onClick={() => form.reset()}>
        Cancel
      </Button>
    </>
  )

  React.useEffect(() => {
    setForm(form)
    return () => {}
  }, [form])

  return (
    <>
      <FabContainer components={FabContent}>
        <div className="ml-8 flex flex-col items-center justify-center p-3">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
              <h1 className="text-2xl font-bold">New Draft</h1>
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
              )}
            />
          </form>
        </div>
      </FabContainer>
    </>
  )
}

export default Create
