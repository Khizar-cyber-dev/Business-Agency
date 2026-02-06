import prisma from "./prismaDB";

export async function syncUser(clerkUser: any) {
  const clerkId = clerkUser.id; 
  const email = clerkUser?.primaryEmailAddress?.emailAddress || 
                clerkUser?.emailAddresses?.[0]?.emailAddress;
  const name = `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim();

  if (!email) {
    console.warn("No email found in Clerk user");
    return;
  }

  const existingUser = await prisma.user.findFirst({
    where: { 
      OR: [
        { email },
        { clerkId }
      ]
    },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email,
        name: name || email,
        password: "ManagedByClerk",
        role: "CLIENT",
        clerkId: clerkId,
      },
    });
    console.log("Created new user:", email);
  } else {
    const updateData: any = {};
    
    if (name && name !== existingUser.name) {
      updateData.name = name;
    }
    
    if (!existingUser.clerkId) {
      updateData.clerkId = clerkId;
    }
    
    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: updateData,
      });
      console.log("Updated user:", email, updateData);
    }
  }
}