import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='relative overflow-hidden border-t border-gray-200'>
      <div className="absolute inset-0 z-0 bg-white bg-[radial-gradient(ellipse_80%_80%_at_0%_120%,rgba(80,77,188,0.55),rgba(121,134,255,0.26),rgba(255,255,255,0.0))]" />
      <div className='relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid gap-10 md:grid-cols-4'>
          <div className='md:col-span-2'>
            <h3 className='text-2xl font-bold text-gray-900'>
              Your {' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
                Business
              </span>
            </h3>
            <p className='mt-3 text-sm text-gray-600 max-w-md'>
              Connect with expert service providers, showcase your portfolio, and
              turn business goals into measurable results.
            </p>
            <div className='mt-5 flex gap-3'>
              <Link
                href='/services'
                className='inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition'
              >
                Explore Services
              </Link>
              <Link
                href='/admin/authentication'
                className='inline-flex items-center rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition'
              >
                Become a Partner
              </Link>
            </div>
          </div>

          <div>
            <h4 className='text-sm font-semibold uppercase tracking-wide text-gray-700'>
              Company
            </h4>
            <div className='mt-4 flex flex-col gap-2 text-sm text-gray-600'>
              <Link href='/' className='hover:text-gray-900 transition'>
                Home
              </Link>
              <Link href='/services' className='hover:text-gray-900 transition'>
                Services
              </Link>
              <Link href='/about' className='hover:text-gray-900 transition'>
                About
              </Link>
              <Link href='/contact' className='hover:text-gray-900 transition'>
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className='text-sm font-semibold uppercase tracking-wide text-gray-700'>
              Resources
            </h4>
            <div className='mt-4 flex flex-col gap-2 text-sm text-gray-600'>
              <Link href='/admin/dashboard' className='hover:text-gray-900 transition'>
                Admin Dashboard
              </Link>
              <Link href='/admin/portfolios' className='hover:text-gray-900 transition'>
                Portfolios
              </Link>
              <Link href='/admin/services' className='hover:text-gray-900 transition'>
                Manage Services
              </Link>
              <Link href='/admin/inquires' className='hover:text-gray-900 transition'>
                Inquiries
              </Link>
            </div>
          </div>
        </div>

        <div className='mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between'>
          <p>© 2026 BusinessAgency. All rights reserved.</p>
          <div className='flex gap-4'>
            <Link href='/privacy' className='hover:text-gray-800 transition'>
              Privacy
            </Link>
            <Link href='/terms' className='hover:text-gray-800 transition'>
              Terms
            </Link>
            <Link href='/support' className='hover:text-gray-800 transition'>
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
