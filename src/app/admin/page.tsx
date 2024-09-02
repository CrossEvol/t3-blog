import { Terminal } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'

export function AdminPortal() {
  return (
    <div className="container space-y-4 min-h-96">
      <div className="hover:bg-slate-600">
        <Link href={'/admin/topic'}>
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Topic</AlertTitle>
            <AlertDescription>
              You can edit/delete/sort/filter topics here.
            </AlertDescription>
          </Alert>
        </Link>
      </div>
      <div className="hover:bg-slate-600">
        <Link href={'/admin/tag'}>
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Tag</AlertTitle>
            <AlertDescription>
              You can edit/delete/sort/filter tags here.
            </AlertDescription>
          </Alert>
        </Link>
      </div>
    </div>
  )
}

export default AdminPortal
