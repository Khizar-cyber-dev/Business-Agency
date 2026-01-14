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



export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, message, budget, serviceId, portfolioId } = body;

        if (!name || !email || !message || !budget || !serviceId || !portfolioId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const inquiry = await prisma.inquiry.create({
            data: {
                name,
                email,
                message,
                budget,
                status: "NEW",
                serviceId,
                portfolioId,
            },
        });

        return NextResponse.json(inquiry, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
