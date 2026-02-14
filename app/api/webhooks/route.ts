import { Webhook } from "svix";
import { NextRequest } from "next/server";
import prisma from "@/lib/prismaDB";

interface ClerkEvent {
  type: string;
  data: {
    id: string; 
    email_addresses?: { email_address: string }[];
    first_name?: string;
    last_name?: string;
    username?: string;
    image_url?: string;
  };
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("Missing CLERK_WEBHOOK_SECRET");

  const headersList = await import("next/headers").then((m) => m.headers());
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent;

    console.log("✅ Webhook event received:", evt.type);

    const { id, email_addresses, first_name, last_name } = evt.data;

    switch (evt.type) {
      // ✅ USER CREATED
      case "user.created": {
        await prisma.user.create({
          data: {
            clerkId: id,
            name: `${first_name || ""} ${last_name || ""}`.trim() || "Unnamed",
            email: email_addresses?.[0]?.email_address || "",
            password: "", // No password since we're using Clerk for auth
          },
        });
        console.log("👤 User created in DB:", id);
        break;
      }

      // ✅ USER UPDATED
      case "user.updated": {
        await prisma.user.update({
          where: { clerkId: id },
          data: {
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            email: email_addresses?.[0]?.email_address || undefined,
            password: "", // No password since we're using Clerk for auth
          },
        });
        console.log("✏️ User updated in DB:", id);
        break;
      }

      // ✅ USER DELETED
      case "user.deleted": {
        await prisma.user.delete({
          where: { clerkId: id },
        });
        console.log("🗑️ User deleted in DB:", id);
        break;
      }

      default:
        console.log("ℹ️ Unhandled Clerk event:", evt.type);
    }

    return new Response("Webhook handled successfully", { status: 200 });
  } catch (err) {
    console.error("❌ Error verifying or handling webhook:", err);
    return new Response("Error handling webhook", { status: 400 });
  }
}
