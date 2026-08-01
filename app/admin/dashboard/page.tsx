import { AdminSidebar } from "@/components/admin/AdminSidebar";
import prisma from "@/lib/db";
import { FolderCode, Briefcase, Award, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDashboard() {
  const [
    projectsCount,
    experienceCount,
    skillsCount,
    messagesCount,
    recentProjects,
    recentMessages
  ] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.skill.count(),
    prisma.contactMessage.count(),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, status: true, updatedAt: true }
    }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, subject: true, createdAt: true, read: true }
    })
  ]);

  const stats = [
    { label: "Total Projects", value: projectsCount, icon: FolderCode, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Experience Entries", value: experienceCount, icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Skills", value: skillsCount, icon: Award, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Messages", value: messagesCount, icon: MessageSquare, color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  return (
    <div className="min-h-screen bg-[#080808]">
      <AdminSidebar />
      
      <main className="pl-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-white/50">Manage your portfolio content and view statistics.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-card rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/40 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Recent Projects</h2>
                <Link href="/admin/projects" className="text-sm text-sky-400 hover:underline">
                  View All
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-4 flex items-center justify-between hover:bg-white/3 transition-colors">
                    <div>
                      <h3 className="text-sm font-semibold text-white/90 mb-1">{project.title}</h3>
                      <p className="text-xs text-white/40">
                        Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      project.status === "PUBLISHED" ? "bg-emerald-400/10 text-emerald-400" :
                      project.status === "DRAFT" ? "bg-orange-400/10 text-orange-400" :
                      "bg-violet-400/10 text-violet-400"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                ))}
                {recentProjects.length === 0 && (
                  <div className="p-8 text-center text-white/30 text-sm">No projects found.</div>
                )}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Recent Messages</h2>
              </div>
              <div className="divide-y divide-white/5">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="p-4 flex items-start gap-4 hover:bg-white/3 transition-colors">
                    <div className={`w-2 h-2 mt-1.5 rounded-full ${msg.read ? "bg-white/10" : "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]"}`} />
                    <div>
                      <h3 className="text-sm font-semibold text-white/90 mb-0.5">{msg.name}</h3>
                      <p className="text-xs text-white/60 mb-1">{msg.subject || "No Subject"}</p>
                      <p className="text-xs text-white/40">
                        {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                {recentMessages.length === 0 && (
                  <div className="p-8 text-center text-white/30 text-sm">No messages found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
