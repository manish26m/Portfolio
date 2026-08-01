import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        technologies: true,
        images: { orderBy: { order: "asc" } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Resolve technologies
    let techUpdate = undefined;
    if (data.technologies && Array.isArray(data.technologies)) {
      const techConnects = [];
      for (const techName of data.technologies) {
        const tech = await prisma.technology.upsert({
          where: { name: techName },
          update: {},
          create: { name: techName },
        });
        techConnects.push({ id: tech.id });
      }
      techUpdate = { set: techConnects };
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        overview: data.overview,
        problem: data.problem,
        solution: data.solution,
        architecture: data.architecture,
        challenges: data.challenges,
        decisions: data.decisions,
        performance: data.performance,
        lessons: data.lessons,
        futureWork: data.futureWork,
        thumbnailUrl: data.thumbnailUrl,
        heroImageUrl: data.heroImageUrl,
        liveUrl: data.liveUrl,
        githubUrl: data.githubUrl,
        status: data.status,
        featured: data.featured,
        order: data.order,
        category: data.category,
        ...(techUpdate ? { technologies: techUpdate } : {}),
      },
      include: { technologies: true },
    });

    revalidatePath("/");
    revalidatePath(`/projects/${project.slug}`);
    return NextResponse.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.project.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/projects");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
