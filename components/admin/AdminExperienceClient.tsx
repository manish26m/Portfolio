"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Trash2, Building2, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Experience {
  id: string; company: string; role: string; type: string;
  location?: string | null; startDate: Date; endDate?: Date | null;
  current: boolean; technologies: string[]; description: string;
}

export function AdminExperienceClient({ experiences: initial }: { experiences: Experience[] }) {
  const [experiences, setExperiences] = useState(initial);

  const handleDelete = async (id: string, company: string) => {
    if (!confirm(`Delete "${company}" experience? This cannot be undone.`)) return;
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (res.ok) {
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      toast.success("Experience deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  if (experiences.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center border border-white/5">
        <p className="text-white/30 text-sm mb-4">No experience entries yet.</p>
        <Link href="/admin/experience/new" className="text-sky-400 text-sm underline underline-offset-4">Add your first experience</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <div key={exp.id} className="glass-card rounded-2xl p-5 border border-white/5 group hover:border-white/10 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-white">{exp.role}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs bg-sky-400/10 text-sky-400">{exp.type}</span>
                {exp.current && <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-400/10 text-emerald-400">Current</span>}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-3">
                <span className="flex items-center gap-1.5"><Building2 size={12} />{exp.company}</span>
                {exp.location && <span className="flex items-center gap-1.5"><MapPin size={12} />{exp.location}</span>}
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {format(new Date(exp.startDate), "MMM yyyy")} – {exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : ""}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.slice(0, 6).map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded-md text-xs bg-white/5 text-white/50">{tech}</span>
                ))}
                {exp.technologies.length > 6 && <span className="text-xs text-white/30">+{exp.technologies.length - 6}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={`/admin/experience/${exp.id}`} className="w-8 h-8 rounded-lg glass border border-white/5 flex items-center justify-center text-white/40 hover:text-sky-400 transition-colors">
                <Edit size={13} />
              </Link>
              <button onClick={() => handleDelete(exp.id, exp.company)} className="w-8 h-8 rounded-lg glass border border-white/5 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
