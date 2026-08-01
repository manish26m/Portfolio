import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSkillsClient } from "@/components/admin/AdminSkillsClient";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Skills</h1>
            <p className="text-white/40 text-sm">{skills.length} skills listed</p>
          </div>
          <AdminSkillsClient skills={skills as any} />
        </div>
      </main>
    </div>
  );
}
