import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminStatsClient } from "@/components/admin/AdminStatsClient";

export default async function AdminStatsPage() {
  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Stats</h1>
            <p className="text-white/40 text-sm">Manage the numbers displayed on your homepage.</p>
          </div>
          <AdminStatsClient initialStats={stats as any} />
        </div>
      </main>
    </div>
  );
}
