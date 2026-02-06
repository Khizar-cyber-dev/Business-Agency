"use client";

import { useState } from "react";
import Link from "next/link";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    price: string | null;
    isActive: boolean;
    portfolios: { id: string }[];
    inquiries: { id: string }[];
  };
  toggleServiceStatus: (id: string, isActive: boolean) => Promise<{ success: boolean; service?: unknown; error?: string }>;
}

export default function ServiceCard({ service, toggleServiceStatus }: ServiceCardProps) {
  const [isActive, setIsActive] = useState(service.isActive);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newStatus = !isActive;
      const result = await toggleServiceStatus(service.id, newStatus);
      if (result.success) {
        setIsActive(newStatus);
      }
    } catch (error) {
      console.error("Error toggling service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Service Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
            {service.price && (
              <span className="text-sm text-gray-600">• {service.price}</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6 line-clamp-2">{service.description}</p>

      {/* Stats */}
      <div className="flex gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-lg">🖼️</span>
          <span>{service.portfolios.length} portfolios</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-lg">📩</span>
          <span>{service.inquiries.length} inquiries</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            isActive
              ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
              : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
          } disabled:opacity-50`}
        >
          {loading
            ? "Updating..."
            : isActive
            ? "Deactivate"
            : "Activate"}
        </button>
        <Link
          href={`/admin/services/${service.id}`}
          className="flex-1 py-2 px-4 text-center border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}