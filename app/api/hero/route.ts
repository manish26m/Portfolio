import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const hero = await prisma.hero.findFirst();
  return NextResponse.json(hero || {});
}

export async function PUT(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const existing = await prisma.hero.findFirst();

  let hero;
  if (existing) {
    hero = await prisma.hero.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        titles: data.titles,
        tagline: data.tagline,
        description: data.description,
        photoUrl: data.photoUrl,
        ctaPrimary: data.ctaPrimary,
        ctaSecondary: data.ctaSecondary,
        ctaTertiary: data.ctaTertiary,
      },
    });
  } else {
    hero = await prisma.hero.create({
      data: {
        name: data.name,
        titles: data.titles,
        tagline: data.tagline,
        description: data.description,
        photoUrl: data.photoUrl || null,
        ctaPrimary: data.ctaPrimary || "Explore Projects",
        ctaSecondary: data.ctaSecondary || "Download Resume",
        ctaTertiary: data.ctaTertiary || "Contact",
      },
    });
  }

  revalidatePath("/");
  return NextResponse.json(hero);
}
