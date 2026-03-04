import prisma from "@/lib/prismaDB";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

function buildSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ clerkId }, ...(email ? [{ email }] : [])],
    },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function GET() {
  try {
    const dbUserId = await getDbUserId();

    if (!dbUserId) {
      const services = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(services, { status: 200 });
    }

    const services = await prisma.service.findMany({
      where: { userId: dbUserId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const dbUserId = await getDbUserId();
    if (!dbUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug: buildSlug(title),
        description,
        price: price || null,
        isActive: true,
        userId: dbUserId,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const dbUserId = await getDbUserId();
    if (!dbUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, description, price, isActive } = body;

    if (!id || !title || !description || isActive === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.service.findFirst({
      where: { id, userId: dbUserId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        slug: buildSlug(title),
        description,
        price: price || null,
        isActive,
      },
    });

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
