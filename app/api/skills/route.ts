import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return NextResponse.json(skills);
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  const skill = await prisma.skill.create({
    data: {
      name: data.name,
      category: data.category,
      proficiency: data.proficiency || 80,
      description: data.description,
      order: data.order || 0,
    },
  });
  revalidatePath("/");
  return NextResponse.json(skill, { status: 201 });
}
