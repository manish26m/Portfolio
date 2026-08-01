import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const socials = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(socials);
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const social = await prisma.socialLink.create({
    data: { platform: data.platform, url: data.url, username: data.username, icon: data.icon, order: data.order || 0 },
  });

  revalidatePath("/");
  return NextResponse.json(social, { status: 201 });
}
