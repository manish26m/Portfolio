import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

// GET all published projects (public) or all projects (admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const projects = await prisma.project.findMany({
      where: {
        ...(user ? {} : { status: "PUBLISHED" }),
        ...(category && category !== "all" ? { category: { has: category } } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { shortDescription: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      include: { technologies: true, images: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST create project (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const slug = data.slug || slugify(data.title);

    // Resolve technologies
    const techConnects = [];
    if (data.technologies && Array.isArray(data.technologies)) {
      for (const techName of data.technologies) {
        const tech = await prisma.technology.upsert({
          where: { name: techName },
          update: {},
          create: { name: techName },
        });
        techConnects.push({ id: tech.id });
      }
    }

    const project = await prisma.project.create({
      data: {
        slug,
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description || "",
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
        status: data.status || "DRAFT",
        featured: data.featured || false,
        order: data.order || 0,
        category: data.category || [],
        technologies: { connect: techConnects },
      },
      include: { technologies: true },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
