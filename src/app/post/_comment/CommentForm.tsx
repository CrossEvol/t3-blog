'use client'

import { api } from '@/trpc/react'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type CommentFormProps = {
  session: Session | null;
  postId: number;
};

const CommentForm = ({ session, postId }: CommentFormProps) => {
  const router = useRouter()
  const [text, setText] = useState('')
  const createComment = api.comment.create.useMutation({
    onSuccess: ({}) => {
      setText('')
      router.refresh()
    },
  })

  return (
    <form onSubmit={async () => createComment.mutate({ text, postId })}>
      <textarea
        className="flex max-h-40 w-full resize-y rounded bg-gray-200 p-3 text-gray-900 placeholder-gray-500"
        rows={2}
        placeholder={
          session
            ? 'What are your thoughts?'
            : 'Please login to leave a comment'
        }
        onChange={(e) => setText(e.target.value)}
        value={text}
        disabled={!session}
      />

      <div className="mt-4 flex items-center">
        {session ? 
          <div className="flex items-center space-x-6">
            <button
              disabled={createComment.isLoading || !text}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-40"
            >
              {createComment.isLoading ? 'Sending...' : 'Send'}
            </button>
            <Link href={session && '/api/auth/signout'}>
              <button className="text-gray-500">Log Out</button>
            </Link>
          </div>
         : 
          <Link href={!session && '/api/auth/signin'}>
            <button
              type="button"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-40"
            >
              Log In
            </button>
          </Link>
        }
      </div>
    </form>
  )
}

export default CommentForm
