import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Global Settings</h1>
            <p className="text-white/40 text-sm">Manage your portfolio's core metadata and contact details.</p>
          </div>
          <AdminSettingsClient initialSettings={settings as any} />
        </div>
      </main>
    </div>
  );
}
