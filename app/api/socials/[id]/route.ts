import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await request.json();
  const social = await prisma.socialLink.update({
    where: { id },
    data: { platform: data.platform, url: data.url, username: data.username, icon: data.icon, order: data.order },
  });

  revalidatePath("/");
  return NextResponse.json(social);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.socialLink.delete({ where: { id } });

  revalidatePath("/");
  return NextResponse.json({ success: true });
}
