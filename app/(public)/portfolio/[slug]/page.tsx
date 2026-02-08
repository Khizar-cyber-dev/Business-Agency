import prisma from "@/lib/prismaDB";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
    
  const { userId } = await auth();

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    include: { links: true },
  });

  if (!portfolio) notFound();

  const imageSrc = portfolio.image?.startsWith('data:') 
    ? portfolio.image 
    : `data:image/png;base64,${portfolio.image}`;

  return (
    <main className="min-h-screen p-6 pt-24 relative z-10">
      <section className="text-center max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-sm mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Portfolio Details
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
            {portfolio.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {portfolio.description}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <img 
            src={imageSrc}
            alt={portfolio.title}
            className="w-full h-48 object-cover rounded-lg mb-8"
          />
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Project Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portfolio?.links.length === 0 ? (
              <p className="text-gray-600 col-span-full text-center">No links available for this portfolio.</p>
            ) : (
                portfolio.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors text-center"
              >
                {link.title}
              </a>
            )))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Contact Us About This Project</h2>
          <Link
            href={userId ? `/contact/${portfolio.slug}` : `/sign-in?redirect_url=${encodeURIComponent(`/contact${portfolio ? `?portfolio=${portfolio.slug}` : ''}`)}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}