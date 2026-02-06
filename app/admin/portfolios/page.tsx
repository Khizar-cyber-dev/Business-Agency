import Link from "next/link";
import prisma from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function PortfoliosPage() {
  const { userId } = await auth();
  
  const portfolios = await prisma.portfolio.findMany({
    where: { user: { clerkId: userId || "" } },
    include: {
      service: { select: { title: true } },
      _count: { select: { inquiries: true, links: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-gray-600 mt-2">Showcase your best work to clients</p>
          </div>
          <Link
            href="/admin/portfolios/new"
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition"
          >
            + Add Portfolio
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{portfolios.length}</div>
            <div className="text-gray-600">Total Portfolios</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {portfolios.reduce((sum, p) => sum + p._count.inquiries, 0)}
            </div>
            <div className="text-gray-600">Total Inquiries</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {portfolios.reduce((sum, p) => sum + p._count.links, 0)}
            </div>
            <div className="text-gray-600">External Links</div>
          </div>
        </div>

        {/* Portfolio Grid */}
        {portfolios.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No portfolios yet</h3>
            <p className="text-gray-500 mb-6">Add your first portfolio project to showcase your work</p>
            <Link
              href="/admin/portfolio/new"
              className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-8 rounded-lg font-semibold hover:opacity-90"
            >
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {portfolio.image ? (
                    <Image
                      src={portfolio.image}
                      alt={portfolio.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span className="text-4xl">🖼️</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{portfolio.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{portfolio.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      {portfolio.service.title}
                    </span>
                    <span>{new Date(portfolio.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-sm border-t pt-4">
                    <div className="flex items-center gap-1">
                      <span>📩</span>
                      <span>{portfolio._count.inquiries} inquiries</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🔗</span>
                      <span>{portfolio._count.links} links</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t p-4 flex gap-2">
                  <Link
                    href={`/admin/portfolio/${portfolio.id}`}
                    className="flex-1 text-center py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition"
                  >
                    Edit
                  </Link>
                  <button className="flex-1 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}