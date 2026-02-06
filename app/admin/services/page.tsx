// app/admin/services/page.tsx
import Link from "next/link";
import { getServices, toggleServiceStatus } from "@/lib/action";
import ServiceCard from "../components/ServiceCard";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services</h1>
              <p className="text-gray-600 mt-2">Manage your services and visibility</p>
            </div>
            <Link
              href="/admin/services/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              + New Service
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {services.length}
              </div>
              <div className="text-gray-600">Total Services</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {services.filter(s => s.isActive).length}
              </div>
              <div className="text-gray-600">Active</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-gray-500">
                {services.filter(s => !s.isActive).length}
              </div>
              <div className="text-gray-600">Inactive</div>
            </div>
          </div>
        </div>

        {/* Services List */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No services yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first service to start offering it to clients
            </p>
            <Link
              href="/admin/services/new"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700"
            >
              Create Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                toggleServiceStatus={toggleServiceStatus}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}