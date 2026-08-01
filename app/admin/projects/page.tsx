import Link from "next/link";
import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminProjectsClient } from "@/components/admin/AdminProjectsClient";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { technologies: true },
  });

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Projects</h1>
              <p className="text-white/40 text-sm">{projects.length} total projects</p>
            </div>
            <Link
              href="/admin/projects/new"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300"
            >
              + Add Project
            </Link>
          </div>
          <AdminProjectsClient projects={projects as any} />
        </div>
      </main>
    </div>
  );
}
