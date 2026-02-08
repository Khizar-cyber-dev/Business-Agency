import { getPublicServices } from '@/lib/action'
import { Briefcase, Layers, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const page = async () => {
    const getServices = await getPublicServices(0);
  return (
    <div className='w-full min-h-screen md:p-6 z-10 relative'>
        <section className='w-full md:p-6 pt-24 md:pt-20'>
            <h1 className='mb-4 text-3xl font-bold text-center'>
                Choose the {' '} 
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
                    Service
                </span> 
                {' '} you like.
            </h1>

            <div className='w-full max-w-7xl mx-auto mt-10'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
                    {getServices.length === 0 ? null : (
                        getServices.map((service) => {
                            const portfoliosCount = service.portfolios?.length ?? 0
                            const inquiriesCount = service.inquiries?.length ?? 0
                            return(
                            <Link 
                            key={service.id} 
                            href={`/services/${service.slug}`}
                            className='group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10'>
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
                        )})
                    )}
                </div>
            </div>
        </section>
    </div>
  )
}

export default page