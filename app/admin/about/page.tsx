import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminAboutClient } from "@/components/admin/AdminAboutClient";

export default async function AdminAboutPage() {
  const settings = await prisma.settings.findFirst();
  const journey = await prisma.journeyEvent.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">About & Journey</h1>
            <p className="text-white/40 text-sm">Manage your bio, engineering philosophy, and timeline events.</p>
          </div>
          <AdminAboutClient initialSettings={settings as any} initialJourney={journey} />
        </div>
      </main>
    </div>
  );
}
