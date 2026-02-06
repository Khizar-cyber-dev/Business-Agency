import prisma from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const cards = [
  {
    title: "Add Service",
    description: "Create and manage services you offer to clients.",
    href: "/admin/services/new",
    icon: "🧩",
    color: "bg-blue-50 border-blue-100",
  },
  {
    title: "Add Portfolio",
    description: "Showcase past work to build client trust.",
    href: "/admin/portfolios/new",
    icon: "🖼️",
    color: "bg-purple-50 border-purple-100",
  },
  {
    title: "Client Inquiries",
    description: "View messages from potential clients.",
    href: "/admin/inquiries",
    icon: "📩",
    color: "bg-green-50 border-green-100",
  },
];

export default async function CardsSection() {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId || "" },
  });

  // Then fetch other stats based on user ID
  const [servicesCount, portfoliosCount, newInquiries] = await Promise.all([
    prisma.service.count({
      where: { 
        userId: user?.id || "",
        isActive: true 
      },
    }),
    prisma.portfolio.count({
      where: { userId: user?.id || "" },
    }),
    prisma.inquiry.count({
      where: { 
        service: { 
          userId: user?.id || "" 
        },
        status: "NEW"
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.businessName || user?.name || "Admin"}
          </h1>
          <p className="mt-2 text-gray-600">Manage your business operations</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {servicesCount}
                </div>
                <div className="text-gray-600">Active Services</div>
              </div>
              <div className="text-3xl">🧩</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {portfoliosCount}
                </div>
                <div className="text-gray-600">Portfolio Items</div>
              </div>
              <div className="text-3xl">🖼️</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {newInquiries}
                </div>
                <div className="text-gray-600">New Inquiries</div>
              </div>
              <div className="text-3xl">📩</div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group rounded-xl border-2 p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${card.color}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{card.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{card.description}</p>
                  <div className="mt-4 text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    Get started →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        {newInquiries > 0 && (
          <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                {newInquiries} new
              </span>
            </div>
            <div className="text-gray-600">
              You have {newInquiries} new client {newInquiries === 1 ? 'inquiry' : 'inquiries'} waiting for your response.
            </div>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              View all inquiries →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}