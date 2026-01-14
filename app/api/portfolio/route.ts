import prisma from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const portfolios = await prisma.portfolio.findMany({
            where: {
                userId: userId,
            },
        });
        return NextResponse.json(portfolios, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId } = await auth();
        const { title, image, description, serviceId, links } = body;

        if (!title || !image || !description || !serviceId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const portfolio = await prisma.portfolio.create({
            data: {
                title,
                image,
                description,
                serviceId,
                userId,
                slug: title,
                links: {
                    create: links
                },
            },
        });

        return NextResponse.json(portfolio, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId } = await auth();
        const { id } = body;

        if (!id || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const portfolio = await prisma.portfolio.update({
            where: {
                id,
            },
            data: {
                title: body.title,
                image: body.image,
                description: body.description,
                serviceId: body.serviceId,
                userId: userId,
                slug: body.title,
            },
        });

        return NextResponse.json(portfolio, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}