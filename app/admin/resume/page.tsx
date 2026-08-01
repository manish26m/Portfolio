import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminResumeClient } from "@/components/admin/AdminResumeClient";

export default async function AdminResumePage() {
  const resume = await prisma.resume.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Resume Manager</h1>
            <p className="text-white/40 text-sm">Upload and manage your CV/Resume PDF.</p>
          </div>
          <AdminResumeClient currentResume={resume as any} />
        </div>
      </main>
    </div>
  );
}
