import { Role } from '@prisma/client'
import { MonitorCog } from 'lucide-react'
import type { Session } from 'next-auth'
import Link from 'next/link'

interface Props {
  session: Session | null
}

const RightNav = ({ session }: Props) => {
  return (
    <div className="ml-auto flex items-center space-x-4">
      {session && (
        <>
          <p className="text-sm">
            {session.user.name} ({session.user.email})
          </p>
          {session.user.role === Role.ADMIN ? (
            <>
              <Link
                href="/admin"
                className="inline-block rounded border border-black px-4 py-2"
              >
                <MonitorCog />
              </Link>
              <Link
                href="/post/create"
                className="inline-block rounded border border-black px-4 py-2"
              >
                New post
              </Link>
            </>
          ) : null}
        </>
      )}
      <Link
        className="inline-block rounded border border-black px-4 py-2"
        href={session ? '/api/auth/signout' : '/api/auth/signin'}
      >
        {session ? 'Log out' : 'Log in'}
      </Link>
    </div>
  )
}

export default RightNav
