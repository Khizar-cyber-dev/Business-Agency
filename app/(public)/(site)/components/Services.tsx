import Link from 'next/link'
import { getPublicServices } from '@/lib/action'
import { ArrowBigRight, Briefcase, Layers, MessageCircle } from 'lucide-react'

const Services = async () => {
  const services = await getPublicServices()

  return (
    <section className="relative w-full bg-white py-20 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Services We{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Provide
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Showcase the solutions you offer to your clients. Each service card highlights
            key details so visitors can quickly understand how you can help.
          </p>
        </div>

        {/* Content */}
        {services.length === 0 ? null : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const portfoliosCount = service.portfolios?.length ?? 0
              const inquiriesCount = service.inquiries?.length ?? 0

              return (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      <Layers className="h-3.5 w-3.5" />
                      <span>{service.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                      {service.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-gray-600">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Starting from</span>
                      <span className="text-base font-semibold text-gray-900">
                        {service.price || 'Custom pricing'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs md:text-sm">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        <span>{portfoliosCount} portfolio{portfoliosCount === 1 ? '' : 's'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-4 w-4 text-indigo-600" />
                        <span>{inquiriesCount} inquiry{inquiriesCount === 1 ? '' : 'ies'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
        <div className='text-end'>
          <Link href="/services" className="inline-flex items-center gap-1">
              <span className="text-sm font-medium text-blue-600 hover:text-blue-500 inline-flex items-center gap-1">
                <ArrowBigRight className="inline h-4 w-4" />
                View all services
              </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Services