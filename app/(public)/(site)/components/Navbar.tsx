import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { LayoutDashboard, Store } from 'lucide-react'
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prismaDB'
import { syncUser } from '@/lib/syncUser'

const Navbar = async () => {
  const authSession = await auth()
  const clerkUserId = authSession.userId
  let userRole: string | null = null

  if (clerkUserId) {
    const user = await currentUser()
    if (user) {
      await syncUser(user)
    }

    const email =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress

    if (email) {
      const userResult = await prisma.user.findUnique({
        where: { email },
        select: { role: true },
      })
      userRole = userResult?.role ?? null
    }
  }

  return (
    <header className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="relative flex items-center justify-between gap-6 rounded-2xl border border-white/60 bg-white/70 px-5 py-3 shadow-lg shadow-blue-500/10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-2xl bg-white/80 shadow-md shadow-blue-500/10 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="Main Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-gray-900">
                Your {' '}
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
                  Business
                </span>
              </span>
              <span className="text-xs text-gray-500">
                Connect. Collaborate. Grow.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SignedIn>
              {userRole === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/40 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
              )}

              {userRole && userRole !== 'ADMIN' && (
                <Link
                  href="/admin/authentication"
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 border border-gray-200 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <Store size={16} />
                  <span>Become a Dealer</span>
                </Link>
              )}

              {/* <div className="ml-1 rounded-full border border-white/60 bg-white/70 p-1 shadow-sm shadow-blue-500/20">
                <UserButton />
              </div> */}
              <UserButton />
            </SignedIn>

            <SignedOut>
              <div className="rounded-xl border border-gray-200 bg-gray-900 text-white shadow-md shadow-gray-900/30 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <SignInButton mode="modal">
                  <div className="cursor-pointer px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded-xl transition-colors">
                    Sign In
                  </div>
                </SignInButton>
              </div>
            </SignedOut>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar