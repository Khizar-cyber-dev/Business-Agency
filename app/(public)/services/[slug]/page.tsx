import prisma from '@/lib/prismaDB';
import Link from 'next/link';
import { ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';

interface ServicePageProps {
    params: {
        slug: string;
    };
}

export default async function ServicePage({ params }: ServicePageProps) {
    const { slug } = await params;

    const service = await prisma.service.findUnique({
        where: { slug },
        include: {
            portfolios: {
                include: {
                    links: true,
                },
            },
        },
    });

    if (!service) {
        notFound();
    }

    return (
        <div className='min-h-screen relative z-10'>
            <section>
                <div className='mx-auto w-full max-w-6xl px-6 pt-24 pb-12'>
                    <div className='flex flex-col items-center text-center'>
                        <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-sm'>
                            <Sparkles className='h-3.5 w-3.5' />
                            <span>Service Overview</span>
                        </div>
                        <h1 className='text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl'>
                            {service.title}
                        </h1>
                        <p className='mt-4 max-w-2xl text-base text-gray-600 md:text-lg'>
                            {service.description}
                        </p>

                        <div className='mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600'>
                            <span className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1'>
                                <Briefcase className='h-4 w-4 text-blue-600' />
                                {service.portfolios.length} portfolio{service.portfolios.length === 1 ? '' : 's'}
                            </span>
                            <span className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1'>
                                Starting from <span className='font-semibold text-gray-900'>{service.price || 'Custom pricing'}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-6 pb-16'>
                <div className='flex items-end justify-between gap-4'>
                    <div>
                        <h2 className='text-2xl font-semibold text-gray-900'>Featured Portfolios</h2>
                        <p className='mt-1 text-sm text-gray-600'>
                            Pick a portfolio to explore past work and start a conversation.
                        </p>
                    </div>
                </div>

               <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                    {service.portfolios.length === 0 ? (
                        <p className='col-span-full text-center text-gray-500'>No portfolios available for this service.</p>
                    ) : (
                        service.portfolios.map(portfolio => {
                            const imageSrc = portfolio.image?.startsWith('data:')
                                ? portfolio.image
                                : `data:image/png;base64,${portfolio.image}`;
                            return (
                            <Link
                                key={portfolio.id}
                                href={`/portfolio/${portfolio.slug}`}
                                className='group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10'
                            >
                                <div className='space-y-4'>
                                    <div className='relative h-44 w-full overflow-hidden rounded-xl bg-gray-100'>
                                        <img
                                            src={imageSrc}
                                            alt={portfolio.title}
                                            className='h-full w-full object-cover'
                                            loading='lazy'
                                        />
                                    </div>
                                    <h3 className='text-lg font-semibold text-gray-900 group-hover:text-blue-700'>
                                        {portfolio.title}
                                    </h3>
                                    <p className='line-clamp-3 text-sm text-gray-600'>
                                        {portfolio.description}
                                    </p>
                                </div>
                                <div className='mt-6 flex items-center justify-between text-sm text-gray-600'>
                                    <span className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1'>
                                        <Briefcase className='h-4 w-4 text-blue-600' />
                                        {portfolio.links.length} link{portfolio.links.length === 1 ? '' : 's'}
                                    </span>
                                    <ArrowRight className='h-4 w-4 text-gray-400' />
                                </div>
                            </Link>
                        )})
                    )}
               </div>
            </section>
        </div>
    );
}
