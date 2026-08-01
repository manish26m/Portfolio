import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const settings = await prisma.settings.findFirst();
  const socialLinks = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ settings, socialLinks });
}

export async function PUT(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const existing = await prisma.settings.findFirst();

  let settings;
  if (existing) {
    settings = await prisma.settings.update({
      where: { id: existing.id },
      data: {
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription,
        email: data.email,
        phone: data.phone,
        location: data.location,
        calendarUrl: data.calendarUrl,
        metaKeywords: data.metaKeywords,
        ogImage: data.ogImage,
        aboutHeading: data.aboutHeading,
        aboutText: data.aboutText,
      },
    });
  } else {
    settings = await prisma.settings.create({ data });
  }

  revalidatePath("/");
  return NextResponse.json(settings);
}
