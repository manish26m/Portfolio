import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const events = await prisma.journeyEvent.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const event = await prisma.journeyEvent.create({
    data: { year: data.year, title: data.title, description: data.description, icon: data.icon, color: data.color, order: data.order || 0 },
  });

  revalidatePath("/");
  return NextResponse.json(event, { status: 201 });
}
