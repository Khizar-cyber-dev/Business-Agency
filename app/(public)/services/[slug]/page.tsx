import prisma from '@/lib/prismaDB';
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
        <main className="min-h-screen bg-[#050505] text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/20 to-transparent blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <span className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium tracking-wide uppercase animate-fade-in">
                            Our Expertise
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                            {service.title}
                        </h1>
                        <p className="max-w-2xl text-lg md:text-xl text-gray-400 leading-relaxed">
                            {service.description}
                        </p>
                        {service.price && (
                            <div className="text-2xl font-semibold text-blue-400">
                                Starting from <span className="text-white">{service.price}</span>
                            </div>
                        )}

                        <div className="pt-10">
                            <button className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                Start a Project
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolios Section */}
            <section className="py-24 px-6 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold">Showcase</h2>
                            <p className="text-gray-500 text-lg">Selected works related to {service.title.toLowerCase()}.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {service.portfolios.length > 0 ? (
                            service.portfolios.map((item) => (
                                <div key={item.id} className="group relative overflow-hidden rounded-3xl bg-[#111] border border-white/5 hover:border-white/20 transition-all">
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <h3 className="text-2xl font-bold">{item.title}</h3>
                                        <p className="text-gray-400 line-clamp-2">{item.description}</p>

                                        <div className="flex flex-wrap gap-4 pt-4">
                                            {item.links.map((link) => (
                                                <a
                                                    key={link.id}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                                                >
                                                    {link.title || 'View Link'}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                                <p className="text-gray-500 italic">No portfolios available for this service yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Inquiry CTA */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto rounded-[40px] p-12 md:p-20 bg-gradient-to-br from-blue-600 to-blue-800 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-blue-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to transform your business?</h2>
                        <p className="text-xl text-blue-100 max-w-xl mx-auto">
                            Tell us about your project and let&apos;s build something extraordinary together.
                        </p>
                        <div className="pt-6">
                            <button className="px-12 py-5 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-blue-50 transition-colors">
                                Get Free Estimate
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Business Agency. All rights reserved.
            </footer>
        </main>
    );
}
