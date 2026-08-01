import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminExperienceClient } from "@/components/admin/AdminExperienceClient";
import Link from "next/link";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Experience</h1>
              <p className="text-white/40 text-sm">{experiences.length} entries</p>
            </div>
            <Link href="/admin/experience/new" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300">
              + Add Experience
            </Link>
          </div>
          <AdminExperienceClient experiences={experiences as any} />
        </div>
      </main>
    </div>
  );
}
