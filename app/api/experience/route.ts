import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(experiences);
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const experience = await prisma.experience.create({
    data: {
      company: data.company,
      role: data.role,
      type: data.type || "Full-time",
      location: data.location,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current || false,
      description: data.description,
      achievements: data.achievements || [],
      technologies: data.technologies || [],
      logoUrl: data.logoUrl,
      companyUrl: data.companyUrl,
      order: data.order || 0,
    },
  });

  revalidatePath("/");
  return NextResponse.json(experience, { status: 201 });
}
