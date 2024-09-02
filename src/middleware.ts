import { type NextRequest, NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
  console.log(request.nextUrl)
  // TODO: parse the jwt and validate current user is ADMIN or not
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
