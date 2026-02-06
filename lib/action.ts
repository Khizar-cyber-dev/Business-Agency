'use server';

import prisma from "./prismaDB";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redis } from "./redis";
import { revalidatePath } from "next/cache";

interface FormData {
  businessName: string;
  businessEmail: string;
  role: 'OWNER' | 'PARTNER' | 'FREELANCER';
  experience: string;
  joinReason: string;
}

interface serviceData {
  title: string;
  description: string;
  price: string;
}

interface portfolioData {
  title: string;
  image: string;
  description: string;
  serviceId: string;
  links?: Array<{
    url: string;
    title?: string;
    type?: string;
  }>;
}

export async function getCurrentUserFromDB(){
  try {
    const { userId } = await auth();
    if(!userId) {
      console.log("User is not Authenticated")
      throw new Error('User not authenticated');
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { email: email }
        ]
      }
    })
    return user;
  } catch (error) {
    console.log("Error in getting the user from db:", error);
    throw new Error('Error in getting the user from db');
  }
}

export async function storeFormDataInRedis(formData: FormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const key = `formData:${userId}`;
    await redis.set(key, JSON.stringify(formData));

    return { success: true, message: 'Form data stored successfully' };
  } catch (error) {
    console.error('Error storing form data in Redis:', error);
    throw error;
  }
}

export async function getFormDataFromRedis() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    console.log('Retrieving form data for userId:', userId);
    const key = `formData:${userId}`;
    const data = await redis.get(key);
    
    // Parse JSON string if data exists, otherwise return null
    return data && typeof data === 'string' ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving form data from Redis:', error);
    throw error;
  }
}

export async function makeAdmin(formData: FormData) {
  try {
    const user = await getCurrentUserFromDB();
    if (!user) {
      throw new Error('User not found in database');
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        businessName: formData.businessName,
        businessEmail: formData.businessEmail,
        role: 'ADMIN', // Set role to ADMIN
        experience: formData.experience,
        joinReason: formData.joinReason,
      },
    });
    storeFormDataInRedis(formData);
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function createService(data: serviceData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const user = await getCurrentUserFromDB();
    if (!user) {
      throw new Error('User not found in database');
    }
    
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create new service in the database
    const newService = await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        userId: user.id,
        slug: slug,
      }
    });
    revalidatePath("/admin/services");
    revalidatePath("/admin/dashboard");
    return newService;
  } catch (error) {
    console.log('Error making user service:', error);
    throw error;
  }
}

export async function getServices() {
  try {
    const user = await getCurrentUserFromDB();
    if (!user) throw new Error("User not found");

    const services = await prisma.service.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        portfolios: {
          select: { id: true }
        },
        inquiries: {
          select: { id: true }
        }
      }
    });
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

// Public services for the marketing site (no auth required)
export async function getPublicServices() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        portfolios: {
          select: { id: true }
        },
        inquiries: {
          select: { id: true }
        },
        user: {
          select: {
            businessName: true,
            name: true,
          }
        }
      },
      take: 3 // Limit to 3 services for homepage display,
    });

    return services;
  } catch (error) {
    console.error("Error fetching public services:", error);
    return [];
  }
}

export async function toggleServiceStatus(id: string, isActive: boolean) {
  try {
    const user = await getCurrentUserFromDB();
    if (!user) throw new Error("Unauthorized");

    const service = await prisma.service.update({
      where: {
        id,
        userId: user.id // Ensure user owns this service
      },
      data: { isActive },
    });

    revalidatePath("/admin/services");
    return { success: true, service };
  } catch (error) {
    console.error("Error toggling service status:", error);
    return { success: false, error: "Failed to update service" };
  }
}

export async function deleteService(id: string) {
  try {
    const user = await getCurrentUserFromDB();
    if (!user) throw new Error("Unauthorized");

    await prisma.service.delete({
      where: {
        id,
        userId: user.id // Ensure user owns this service
      },
    });

    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: "Failed to delete service" };
  }
}

export async function getServicesForSelect() {
  try {
    const user = await getCurrentUserFromDB();
    if (!user) throw new Error("User not found");

    const services = await prisma.service.findMany({
      where: { 
        userId: user.id,
        isActive: true 
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return services;
  } catch (error) {
    console.error("Error fetching services for select:", error);
    return [];
  }
}

export async function createPortfolio(data: portfolioData) {
  try {
    const user = await getCurrentUserFromDB();
    if (!user) {
      throw new Error('User not found in database');
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create portfolio with links
    const portfolio = await prisma.portfolio.create({
      data: {
        title: data.title,
        image: data.image,
        description: data.description,
        serviceId: data.serviceId,
        userId: user.id,
        slug: slug,
        links: data.links && data.links.length > 0 ? {
          create: data.links.map(link => ({
            url: link.url,
            title: link.title || null,
            type: link.type || null,
          }))
        } : undefined,
      },
      include: {
        service: {
          select: {
            title: true,
          }
        }
      }
    });

    revalidatePath("/admin/portfolios");
    return { success: true, portfolio };
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return { success: false, error: "Failed to create portfolio" };
  }
}

export async function updateInquiryStatus(inquiryId: string, status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED') {
  try {
    const user = await getCurrentUserFromDB();
    if (!user) throw new Error("Unauthorized");

    // Verify that the inquiry belongs to a portfolio owned by the current user
    const inquiry = await prisma.inquiry.findFirst({
      where: {
        id: inquiryId,
        portfolio: {
          userId: user.id
        }
      }
    });

    if (!inquiry) {
      throw new Error("Inquiry not found or you don't have permission to update it");
    }

    // Update the inquiry status
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status },
    });

    revalidatePath("/admin/inquires");
    return { success: true, inquiry: updatedInquiry };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update inquiry status" };
  }
}


export async function getHomePageData() {
  try {
    const [services, featuredPortfolios] = await Promise.all([
      // Get active services with their portfolio counts
      prisma.service.findMany({
        where: { isActive: true },
        include: {
          user: {
            select: {
              businessName: true,
              name: true,
            }
          },
          _count: {
            select: {
              portfolios: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 6, // Limit to 6 services
      }),
      // Get featured portfolios (most recent with images)
      prisma.portfolio.findMany({
        where: {
          service: {
            isActive: true,
          }
        },
        include: {
          service: {
            select: {
              title: true,
              slug: true,
            }
          },
          user: {
            select: {
              businessName: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 6, // Limit to 6 portfolios
      }),
    ]);

    return { services, featuredPortfolios };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return { services: [], featuredPortfolios: [] };
  }
}
