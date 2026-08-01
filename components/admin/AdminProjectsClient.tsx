"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Trash2, Eye, Star, StarOff, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface Technology { id: string; name: string; color?: string | null; }
interface Project {
  id: string; slug: string; title: string; shortDescription: string;
  status: string; featured: boolean; category: string[];
  liveUrl?: string | null; githubUrl?: string | null;
  technologies: Technology[]; order: number; updatedAt: Date;
}

export function AdminProjectsClient({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } else {
      toast.error("Failed to delete project");
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    if (res.ok) {
      setProjects((prev) => prev.map((p) => p.id === id ? { ...p, featured: !featured } : p));
      toast.success(featured ? "Removed from featured" : "Marked as featured");
    }
  };

  const STATUS_STYLE: Record<string, string> = {
    PUBLISHED: "bg-emerald-400/10 text-emerald-400",
    DRAFT: "bg-orange-400/10 text-orange-400",
    ARCHIVED: "bg-gray-400/10 text-gray-400",
  };

  if (projects.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center border border-white/5">
        <p className="text-white/30 text-sm mb-4">No projects yet.</p>
        <Link href="/admin/projects/new" className="text-sky-400 text-sm underline underline-offset-4">
          Add your first project
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
      <div className="divide-y divide-white/5">
        {projects.map((project) => (
          <div key={project.id} className="p-5 flex items-center gap-5 hover:bg-white/2 transition-colors group">
            {/* Featured toggle */}
            <button
              onClick={() => handleToggleFeatured(project.id, project.featured)}
              className={cn("transition-colors flex-shrink-0", project.featured ? "text-yellow-400" : "text-white/20 hover:text-yellow-400/60")}
              title={project.featured ? "Remove from featured" : "Mark as featured"}
            >
              {project.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="font-semibold text-white/90 text-sm truncate">{project.title}</h3>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0", STATUS_STYLE[project.status] || "bg-gray-400/10 text-gray-400")}>
                  {project.status}
                </span>
                {project.featured && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-400 flex-shrink-0">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 truncate mb-2">{project.shortDescription}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span key={tech.id} className="px-2 py-0.5 rounded-md text-xs" style={{ background: `${tech.color || "#38bdf8"}12`, color: tech.color || "#38bdf8" }}>
                    {tech.name}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="text-xs text-white/30">+{project.technologies.length - 5} more</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg glass border border-white/5 flex items-center justify-center text-white/40 hover:text-sky-400 transition-colors" title="Live Demo">
                  <ExternalLink size={13} />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg glass border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors" title="GitHub">
                  <FaGithub size={13} />
                </a>
              )}
              <Link href={`/projects/${project.slug}`} target="_blank" className="w-8 h-8 rounded-lg glass border border-white/5 flex items-center justify-center text-white/40 hover:text-emerald-400 transition-colors" title="View Live">
                <Eye size={13} />
              </Link>
              <Link href={`/admin/projects/${project.id}`} className="w-8 h-8 rounded-lg glass border border-white/5 flex items-center justify-center text-white/40 hover:text-sky-400 transition-colors" title="Edit">
                <Edit size={13} />
              </Link>
              <button onClick={() => handleDelete(project.id, project.title)} className="w-8 h-8 rounded-lg glass border border-white/5 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors" title="Delete">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
