'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function ConditionalLayout({
  children,
  sidebar,
  header,
}: {
  children: ReactNode
  sidebar: ReactNode
  header: ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/admin/authentication'

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="antialiased flex flex-row w-full min-h-screen bg-gray-100">
      <div className="w-[25%] border h-screen sticky top-0 bg-amber-500 text-white">
        {sidebar}
      </div>
      <div className="w-[75%]">
        {header}
        {children}
      </div>
    </div>
  )
}

