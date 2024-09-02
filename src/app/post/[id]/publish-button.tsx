'use client'

import type { PostItem } from '@/app/_components/post-list'
import { api } from '@/trpc/react'
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types'
import { useRouter } from 'next/navigation'

interface Props {
  post: PostItem
}

const PublishButton = ({ post }: Props) => {
  const router = useRouter()

  const publishMutation = api.post.publish.useMutation({
    onSuccess: ({ id, title }) => {
      console.log(`${id}:${title} has been published.`)
      router.prefetch('/drafts', { kind: PrefetchKind.FULL })
      router.push('/drafts')
    },
    onError(error) {
      console.error(error)
    },
  })

  const onSubmit = () => {
    // Your confirm logic here
    publishMutation.mutate({ id: post.id })
  }

  return (
    <>
      <button
        value="Edit"
        className="w-32 cursor-pointer border-0 font-bold bg-gray-200 px-8 py-4 text-center text-gray-700 hover:bg-green-600 hover:text-white"
        onClick={onSubmit}
      >
        {publishMutation.isLoading ? 'Publishing...' : 'Publish'}
      </button>
    </>
  )
}

export default PublishButton
