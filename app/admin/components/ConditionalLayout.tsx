'use client'

import React, { ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { UserButton } from '@clerk/clerk-react'

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isAuthPage) {
    return <>{children}</>
  }

  const closeSidebar = () => setSidebarOpen(false)
  const mobileSidebar = React.isValidElement(sidebar)
    ? React.cloneElement(sidebar as React.ReactElement<any>, {
        onNavigate: closeSidebar,
        showMobileClose: true,
      })
    : sidebar

  return (
    <div className="antialiased min-h-screen bg-gray-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
            Menu
          </button>
        </div>
      </div>

      <div className="flex w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:w-72 md:shrink-0 md:border-r md:h-screen md:sticky md:top-0 bg-amber-500 text-white">
          {sidebar}
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {header}
          {children}
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeSidebar}
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 max-w-[85%] bg-amber-500 text-white shadow-xl transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {mobileSidebar}
        </div>
      </div>
    </div>
  )
}

