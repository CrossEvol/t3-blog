'use client'

import { type PostItem } from '@/app/_components/post-list'
import { type SessionUser } from '@/common/auth'
import { Button } from '@/components/ui/button'
import { EllipsisVertical } from 'lucide-react'
import React from 'react'
import ShowActions from './show-actions'

interface IProps {
  post: PostItem
  user: SessionUser
}

const ShowActionsWrapper = ({ post, user }: IProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="">
      <Button
        variant={'outline'}
        type="button"
        size="sm"
        className="px-3"
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">Options</span>
        <EllipsisVertical className="h-4 w-4" />
      </Button>
      <ShowActions post={post} user={user} open={open} setOpen={setOpen} />
    </div>
  )
}

export default ShowActionsWrapper
