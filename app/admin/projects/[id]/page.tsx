import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { technologies: true },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <div className="pl-64">
        <ProjectForm initialData={project as any} />
      </div>
    </div>
  );
}
