'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  LogOut,
  X
} from 'lucide-react'

type SidebarProps = {
  onNavigate?: () => void
  showMobileClose?: boolean
}

const Sidebar = ({ onNavigate, showMobileClose = false }: SidebarProps) => {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Portfolios',
      href: '/admin/portfolios',
      icon: FileText
    },
    {
      label: 'Services',
      href: '/admin/services',
      icon: Briefcase
    },
    {
      label: 'Inquiries',
      href: '/admin/inquires',
      icon: MessageSquare
    },
  ]

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className='flex flex-col h-full p-6'>
      {/* {showMobileClose && (
        <div className='mb-6 flex items-center justify-between md:hidden'>
          <div>
            <h1 className='text-xl font-bold text-white'>Admin</h1>
            <p className='text-amber-100 text-xs'>Business Agency</p>
          </div>
          <button
            type='button'
            onClick={onNavigate}
            className='inline-flex items-center justify-center rounded-md bg-white/10 p-2 text-white hover:bg-white/20 transition-colors'
            aria-label='Close sidebar'
          >
            <X size={18} />
          </button>
        </div>
      )} */}

      <div className='mb-6 flex items-center justify-between md:hidden'>
          <div>
            <h1 className='text-xl font-bold text-white'>Admin</h1>
            <p className='text-amber-100 text-xs'>Business Agency</p>
          </div>
          <button
            type='button'
            onClick={onNavigate}
            className='inline-flex items-center justify-center rounded-md bg-white/10 p-2 text-white hover:bg-white/20 transition-colors'
            aria-label='Close sidebar'
          >
            <X size={18} />
          </button>
        </div>

      {/* Logo/Brand */}
      <div className={`mb-8 ${showMobileClose ? 'hidden md:block' : ''}`}>
        <h1 className='text-2xl font-bold text-white'>Admin</h1>
        <p className='text-amber-100 text-sm'>Business Agency</p>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-2'>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-white text-amber-600 font-semibold shadow-lg'
                  : 'text-white hover:bg-amber-600 text-gray-100'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className='border-t border-amber-600 pt-4'>
        <button
          type='button'
          onClick={onNavigate}
          className='flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white hover:bg-amber-600 transition-all duration-200'
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
