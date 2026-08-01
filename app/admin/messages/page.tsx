import prisma from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMessagesClient } from "@/components/admin/AdminMessagesClient";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Inbox</h1>
            <p className="text-white/40 text-sm">
              {messages.filter(m => !m.read).length} unread messages
            </p>
          </div>
          <AdminMessagesClient initialMessages={messages as any} />
        </div>
      </main>
    </div>
  );
}
