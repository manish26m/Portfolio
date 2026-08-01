"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderCode, 
  Briefcase, 
  Award, 
  Settings, 
  LogOut,
  Terminal,
  ChevronRight,
  Mail,
  Type,
  UserCircle,
  FileText,
  BarChart,
  Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Inbox", href: "/admin/messages", icon: Mail },
  { label: "Hero Content", href: "/admin/hero", icon: Type },
  { label: "About & Journey", href: "/admin/about", icon: UserCircle },
  { label: "Stats", href: "/admin/stats", icon: BarChart },
  { label: "Projects", href: "/admin/projects", icon: FolderCode },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Skills", href: "/admin/skills", icon: Award },
  { label: "Social Links", href: "/admin/socials", icon: LinkIcon },
  { label: "Resume", href: "/admin/resume", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch {
      toast.error("Failed to logout");
      setLoggingOut(false);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#0a0a0c] border-r border-white/5 flex flex-col z-50">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Terminal size={14} className="text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            Portfolio<span className="text-sky-400">CMS</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3 mt-2 px-3">
          Management
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-sky-400/10 text-sky-400"
                  : "text-white/50 hover:bg-white/5 hover:text-white/90"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={isActive ? "text-sky-400" : "text-white/40 group-hover:text-white/70"} />
                {item.label}
              </div>
              {isActive && <ChevronRight size={14} className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all duration-200 disabled:opacity-50"
        >
          <LogOut size={16} className="text-white/40" />
          {loggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </aside>
  );
}
