import { getCurrentUserFromDB } from "@/lib/action";
import prisma from "@/lib/prismaDB";
import InquiryStatusSelector from "../components/InquiryStatusSelector";

export default async function Page() {
    const user = await getCurrentUserFromDB();
    
    if (!user) {
        return (
            <main className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
                    <p className="text-gray-600 mt-4">Please log in to view inquiries.</p>
                </div>
            </main>
        );
    }

    // Fetch inquiries that belong to portfolios created by the current user
    const inquiries = await prisma.inquiry.findMany({
        where: {
            portfolio: {
                userId: user.id
            }
        },
        include: {
            portfolio: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                }
            },
            service: {
                select: {
                    id: true,
                    title: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // Group inquiries by status for stats
    const statusCounts = {
        NEW: inquiries.filter(i => i.status === 'NEW').length,
        CONTACTED: inquiries.filter(i => i.status === 'CONTACTED').length,
        IN_PROGRESS: inquiries.filter(i => i.status === 'IN_PROGRESS').length,
        CLOSED: inquiries.filter(i => i.status === 'CLOSED').length,
    };

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
                    <p className="text-gray-600 mt-2">Manage inquiries from your portfolio projects</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900">{inquiries.length}</div>
                        <div className="text-gray-600">Total Inquiries</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="text-2xl font-bold text-blue-600">{statusCounts.NEW}</div>
                        <div className="text-gray-600">New</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="text-2xl font-bold text-yellow-600">{statusCounts.CONTACTED}</div>
                        <div className="text-gray-600">Contacted</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="text-2xl font-bold text-purple-600">{statusCounts.IN_PROGRESS}</div>
                        <div className="text-gray-600">In Progress</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="text-2xl font-bold text-green-600">{statusCounts.CLOSED}</div>
                        <div className="text-gray-600">Closed</div>
                    </div>
                </div>

                {/* Inquiries List */}
                {inquiries.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
                        <div className="text-6xl mb-4">📧</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No inquiries yet</h3>
                        <p className="text-gray-500">Inquiries from your portfolio projects will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    {/* Left side - Inquiry details */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{inquiry.name}</h3>
                                                <p className="text-sm text-gray-600">{inquiry.email}</p>
                                            </div>
                                            <InquiryStatusSelector 
                                                inquiryId={inquiry.id} 
                                                currentStatus={inquiry.status as 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED'} 
                                            />
                                        </div>
                                        
                                        <p className="text-gray-700 mb-4 line-clamp-3">{inquiry.message}</p>
                                        
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            {inquiry.budget && (
                                                <div className="flex items-center gap-1">
                                                    <span>💰</span>
                                                    <span>Budget: {inquiry.budget}</span>
                                                </div>
                                            )}
                                            {inquiry.portfolio && (
                                                <div className="flex items-center gap-1">
                                                    <span>📁</span>
                                                    <span>Portfolio: {inquiry.portfolio.title}</span>
                                                </div>
                                            )}
                                            {inquiry.service && (
                                                <div className="flex items-center gap-1">
                                                    <span>🔧</span>
                                                    <span>Service: {inquiry.service.title}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <span>📅</span>
                                                <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
} 