"use client";

import useSWR from 'swr'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { createService } from '@/lib/action';

export default function CreateServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Creating service:", formData);
    createService(formData);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push("/admin/dashboard");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Service
          </h1>
          <p className="text-gray-600">
            Add a service to showcase what you offer to clients
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <div className="space-y-2">
            <label className="block font-semibold text-gray-800" htmlFor="title">
              Service Name 
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Web Development, Graphic Design"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-gray-800" htmlFor="price">
              Price Range
            </label>
            <input
              id="price"
              type="text"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., $500-$2000, Custom Quote"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-gray-800" htmlFor="description">
              Description *
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe what clients can expect from this service..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? <Loader className="animate-spin bg-transparent"/> : "Create Service"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          * Required fields
        </p>
      </div>
    </main>
  );
}