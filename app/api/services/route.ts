import prisma from "@/lib/prismaDB";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const services = await prisma.service.findMany();
        return NextResponse.json(services, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description, price, userId } = body;

        if (!title || !description || !price || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const service = await prisma.service.create({
            data: {
                title,
                slug: title,
                description,
                price,
                isActive: true,
                userId,
            },
        });

        return NextResponse.json(service, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, title, description, price, isActive, userId } = body;

        if (!id || !title || !description || !price || isActive === undefined || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const service = await prisma.service.update({
            where: {
                id,
            },
            data: {
                title,
                slug: title,
                description,
                price,
                isActive,
                userId,
            },
        });

        return NextResponse.json(service, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}