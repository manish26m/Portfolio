import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(stats);
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  const stat = await prisma.stat.create({ data: { label: data.label, value: data.value, suffix: data.suffix, icon: data.icon, order: data.order || 0 } });
  revalidatePath("/");
  return NextResponse.json(stat, { status: 201 });
}
