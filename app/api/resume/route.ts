import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const resume = await prisma.resume.findFirst({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(resume || {});
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const resume = await prisma.resume.create({
    data: {
      url: data.url,
      publicId: data.publicId,
      filename: data.filename,
    },
  });

  revalidatePath("/");
  return NextResponse.json(resume, { status: 201 });
}
