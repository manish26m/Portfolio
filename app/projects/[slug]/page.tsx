import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectDetailClient } from "@/components/project/ProjectDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} | Manish Mishra`,
      description: project.shortDescription,
      images: project.heroImageUrl ? [project.heroImageUrl] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const [project, allProjects, socialLinks] = await Promise.all([
    prisma.project.findUnique({
      where: { slug },
      include: {
        technologies: true,
        images: { orderBy: { order: "asc" } },
      },
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED", NOT: { slug } },
      orderBy: { featured: "desc" },
      take: 3,
      include: { technologies: true },
    }),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <main>
      <Navbar />
      <ProjectDetailClient
        project={project as any}
        relatedProjects={allProjects as any}
      />
      <Footer socialLinks={socialLinks} />
    </main>
  );
}
