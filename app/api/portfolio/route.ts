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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { userId: dbUserId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(portfolios, { status: 200 });
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
    const { title, image, description, serviceId, links } = body;

    if (!title || !image || !description || !serviceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const service = await prisma.service.findFirst({
      where: { id: serviceId, userId: dbUserId },
      select: { id: true },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        image,
        description,
        serviceId,
        userId: dbUserId,
        slug: buildSlug(title),
        links: Array.isArray(links) && links.length > 0 ? { create: links } : undefined,
      },
    });

    return NextResponse.json(portfolio, { status: 201 });
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
    const { id, title, image, description, serviceId } = body;

    if (!id || !title || !image || !description || !serviceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { id, userId: dbUserId },
      select: { id: true },
    });

    if (!existingPortfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const service = await prisma.service.findFirst({
      where: { id: serviceId, userId: dbUserId },
      select: { id: true },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        title,
        image,
        description,
        serviceId,
        slug: buildSlug(title),
      },
    });

    return NextResponse.json(portfolio, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
