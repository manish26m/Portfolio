import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await request.json();
  const skill = await prisma.skill.update({
    where: { id },
    data: { name: data.name, category: data.category, proficiency: data.proficiency, description: data.description, order: data.order },
  });
  revalidatePath("/");
  return NextResponse.json(skill);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
