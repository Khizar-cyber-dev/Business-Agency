"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, Plus, X } from "lucide-react";
import { createPortfolio, getServicesForSelect } from "@/lib/action";

interface Service {
  id: string;
  title: string;
}

interface Link {
  url: string;
  title: string;
  type: string;
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    serviceId: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getServicesForSelect();
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleAddLink = () => {
    setLinks([...links, { url: "", title: "", type: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: keyof Link, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setLinks(updatedLinks);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please select an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size too large. Maximum size is 5MB.");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, image: base64String });
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty links
      const validLinks = links.filter(link => link.url.trim() !== "");

      const result = await createPortfolio({
        ...formData,
        links: validLinks.length > 0 ? validLinks : undefined,
      });

      if (result.success) {
        router.push("/admin/portfolios");
      } else {
        alert(result.error || "Failed to create portfolio");
      }
    } catch (error) {
      console.error("Error creating portfolio:", error);
      alert("An error occurred while creating the portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Portfolio</h1>
          <p className="text-gray-600 mt-2">Add a portfolio item to showcase your work.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block font-semibold text-gray-800" htmlFor="title">
                Portfolio Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="e.g., E-commerce Website Redesign"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-gray-800" htmlFor="image">
                Portfolio Image *
              </label>
              <input
                type="file"
                id="image"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                required={!formData.image}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              )}
              <p className="text-sm text-gray-500">Select an image file (JPEG, PNG, WebP, or GIF, max 5MB)</p>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-gray-800" htmlFor="description">
                Portfolio Description *
              </label>
              <textarea
                id="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition"
                placeholder="Describe your portfolio item, the challenges you faced, and the solutions you implemented..."
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-gray-800" htmlFor="serviceId">
                Service *
              </label>
              {loadingServices ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-xl flex items-center gap-2">
                  <Loader className="animate-spin" size={20} />
                  <span className="text-gray-500">Loading services...</span>
                </div>
              ) : (
                <select
                  id="serviceId"
                  required
                  value={formData.serviceId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              )}
              {services.length === 0 && !loadingServices && (
                <p className="text-sm text-amber-600">
                  No services available. Please create a service first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-gray-800">Links</label>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                >
                  <Plus size={16} />
                  Add Link
                </button>
              </div>
              {links.length === 0 ? (
                <p className="text-sm text-gray-500">No links added. Click &quot;Add Link&quot; to add one.</p>
              ) : (
                <div className="space-y-3">
                  {links.map((link, index) => (
                    <div key={index} className="flex gap-2 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input
                          type="url"
                          placeholder="URL *"
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          required={links.length > 0}
                        />
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          value={link.title}
                          onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Type (optional)"
                          value={link.type}
                          onChange={(e) => handleLinkChange(index, "type", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loadingServices || services.length === 0}
              className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                "Create Portfolio"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
