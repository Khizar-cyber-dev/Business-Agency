import { createInquiry } from "@/lib/action";
import prisma from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const inquiries = await prisma.inquiry.findMany({
            where: {
                OR: [
                    {
                        portfolio: {
                            userId: userId
                        }
                    },
                    {
                        portfolioId: null,
                        service: {
                            userId: userId
                        }
                    }
                ]
            },
            include: {
                portfolio: true,
                service: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(inquiries, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { slug, ...formData } = body;

        const portfolio = await prisma.portfolio.findUnique({
            where: { slug },
            select: { id: true, service: { select: { id: true } } },
        });

        if (!portfolio) {
            return NextResponse.json(
                { error: 'Portfolio not found' },
                { status: 404 }
            );
        }

        const inquiryData = {
            ...formData,
            portfolioId: portfolio.id,
            serviceId: portfolio.service?.id || null,
        };

        await createInquiry(inquiryData);
        
        return NextResponse.json({
            success: true,
            message: 'Inquiry submitted successfully!'
        });
        
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}