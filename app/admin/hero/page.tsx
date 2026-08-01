import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeroClient } from "@/components/admin/AdminHeroClient";

export default async function AdminHeroPage() {
  const hero = await prisma.hero.findFirst();

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Hero Section</h1>
            <p className="text-white/40 text-sm">Customize the main landing area of your portfolio.</p>
          </div>
          <AdminHeroClient initialData={hero as any} />
        </div>
      </main>
    </div>
  );
}
