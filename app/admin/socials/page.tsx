import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSocialsClient } from "@/components/admin/AdminSocialsClient";

export default async function AdminSocialsPage() {
  const socials = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Social Links</h1>
            <p className="text-white/40 text-sm">Manage your external profiles for the footer and contact sections.</p>
          </div>
          <AdminSocialsClient initialSocials={socials as any} />
        </div>
      </main>
    </div>
  );
}
