import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await prisma.experience.findUnique({ where: { id } });

  if (!experience) notFound();

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <div className="pl-64"><ExperienceForm initialData={experience as any} /></div>
    </div>
  );
}
