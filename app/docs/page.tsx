import { Terminal, Shield, Home, Mail, UserCircle, FolderCode, Briefcase, Award, Settings as SettingsIcon, FileText } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const routes = [
    { section: "Public Routes", routes: [
      { path: "/", desc: "The main portfolio landing page.", icon: Home }
    ]},
    { section: "Admin Dashboard Routes (God Mode)", routes: [
      { path: "/admin/login", desc: "Authentication gateway for the God Mode dashboard.", icon: Shield },
      { path: "/admin/dashboard", desc: "Overview of your portfolio's metrics and quick actions.", icon: Terminal },
      { path: "/admin/messages", desc: "Your inbox. Read and manage messages from the contact form.", icon: Mail },
      { path: "/admin/hero", desc: "Edit the main landing page text (Name, Titles, Tagline).", icon: FileText },
      { path: "/admin/about", desc: "Edit your biography and the Journey timeline.", icon: UserCircle },
      { path: "/admin/projects", desc: "Manage your portfolio projects and case studies.", icon: FolderCode },
      { path: "/admin/experience", desc: "Manage your work history and internships.", icon: Briefcase },
      { path: "/admin/skills", desc: "Quickly manage your technical skills and proficiencies.", icon: Award },
      { path: "/admin/settings", desc: "Manage SEO metadata, contact information, and Resume URL.", icon: SettingsIcon },
    ]}
  ];

  return (
    <div className="min-h-screen bg-[#080808] p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Portfolio CMS Documentation</h1>
          <p className="text-white/40">Complete reference of all accessible routes and their functions.</p>
        </div>

        {routes.map((group) => (
          <div key={group.section} className="space-y-4">
            <h2 className="text-xl font-semibold text-sky-400 border-b border-white/10 pb-2">{group.section}</h2>
            <div className="grid gap-3">
              {group.routes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link href={route.path} key={route.path} className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/20 transition-colors flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-400/10 group-hover:text-sky-400 transition-colors">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-mono font-semibold text-white mb-1 group-hover:text-sky-400 transition-colors">{route.path}</h3>
                      <p className="text-sm text-white/50">{route.desc}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
