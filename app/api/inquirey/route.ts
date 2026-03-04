import { createInquiry } from "@/lib/action";
import prisma from "@/lib/prismaDB";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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

    const inquiries = await prisma.inquiry.findMany({
      where: {
        OR: [
          {
            portfolio: {
              userId: dbUserId,
            },
          },
          {
            portfolioId: null,
            service: {
              userId: dbUserId,
            },
          },
        ],
      },
      include: {
        portfolio: true,
        service: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(inquiries, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, ...formData } = body;

    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      select: { id: true, serviceId: true },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const result = await createInquiry({
      ...formData,
      portfolioId: portfolio.id,
      serviceId: portfolio.serviceId,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create inquiry" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully!",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
