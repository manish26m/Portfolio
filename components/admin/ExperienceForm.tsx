"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Experience {
  id?: string; company: string; role: string; type: string;
  location: string; startDate: string; endDate: string; current: boolean;
  description: string; achievements: string[]; technologies: string[];
  logoUrl: string; companyUrl: string; order: number;
}

const EMPTY: Experience = {
  company: "", role: "", type: "Internship", location: "", startDate: "", endDate: "",
  current: false, description: "", achievements: [], technologies: [], logoUrl: "", companyUrl: "", order: 0,
};

const TYPE_OPTIONS = ["Full-time", "Part-time", "Internship", "Freelance", "Contract", "Research"];
const inputClass = "w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 transition-all duration-300";
const labelClass = "block text-xs text-white/40 font-medium mb-1.5";

export function ExperienceForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const parseDate = (d: any) => {
    if (!d) return "";
    try { return format(new Date(d), "yyyy-MM-dd"); } catch { return ""; }
  };

  const [form, setForm] = useState<Experience>(initialData ? {
    ...initialData,
    startDate: parseDate(initialData.startDate),
    endDate: parseDate(initialData.endDate),
    achievements: initialData.achievements || [],
    technologies: initialData.technologies || [],
  } : EMPTY);

  const [techInput, setTechInput] = useState("");
  const [achieveInput, setAchieveInput] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key: keyof Experience, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const addTech = () => {
    const names = techInput.split(",").map((t) => t.trim()).filter(Boolean);
    setForm((f) => ({ ...f, technologies: [...f.technologies, ...names] }));
    setTechInput("");
  };

  const addAchievement = () => {
    if (!achieveInput.trim()) return;
    setForm((f) => ({ ...f, achievements: [...f.achievements, achieveInput.trim()] }));
    setAchieveInput("");
  };

  const handleSave = async () => {
    if (!form.company || !form.role || !form.startDate) {
      toast.error("Company, role, and start date are required");
      return;
    }
    setSaving(true);
    try {
      const url = isEdit ? `/api/experience/${initialData.id}` : "/api/experience";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(isEdit ? "Experience updated!" : "Experience added!");
        router.push("/admin/experience");
        router.refresh();
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] pb-20">
      <div className="sticky top-0 z-20 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/experience" className="text-white/40 hover:text-white transition-colors"><ArrowLeft size={18} /></Link>
            <h1 className="text-lg font-bold text-white">{isEdit ? `Edit: ${initialData.company}` : "New Experience"}</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-sm font-semibold disabled:opacity-50">
            <Save size={14} />{saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 pt-8 space-y-6">
        <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Company *</label><input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} className={inputClass} placeholder="Futurense Technologies" /></div>
            <div><label className={labelClass}>Role *</label><input type="text" value={form.role} onChange={(e) => set("role", e.target.value)} className={inputClass} placeholder="Data Engineer Intern" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Location</label><input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} className={inputClass} placeholder="Remote / Bangalore, India" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Start Date *</label><input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputClass} /></div>
            <div>
              <label className={labelClass}>End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputClass} disabled={form.current} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="current" checked={form.current} onChange={(e) => set("current", e.target.checked)} className="w-4 h-4 accent-sky-400" />
            <label htmlFor="current" className="text-sm text-white/70">Currently working here</label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Company Logo URL</label><input type="url" value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} className={inputClass} placeholder="https://..." /></div>
            <div><label className={labelClass}>Company Website</label><input type="url" value={form.companyUrl} onChange={(e) => set("companyUrl", e.target.value)} className={inputClass} placeholder="https://..." /></div>
          </div>
          <div><label className={labelClass}>Description</label><textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${inputClass} resize-none`} placeholder="Describe your responsibilities..." /></div>
        </section>

        <section className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Achievements</h2>
          <div className="flex gap-2 mb-3">
            <input type="text" value={achieveInput} onChange={(e) => setAchieveInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addAchievement()} className={`${inputClass} flex-1`} placeholder="Add a key achievement..." />
            <button onClick={addAchievement} className="px-4 py-2 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400 hover:bg-sky-400/20 transition-colors"><Plus size={14} /></button>
          </div>
          <div className="space-y-2">
            {form.achievements.map((a, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white/3 border border-white/5">
                <span className="flex-1 text-sm text-white/70">{a}</span>
                <button onClick={() => setForm((f) => ({ ...f, achievements: f.achievements.filter((_, j) => j !== i) }))} className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"><X size={12} /></button>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Technologies Used</h2>
          <div className="flex gap-2 mb-3">
            <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTech()} className={`${inputClass} flex-1`} placeholder="Python, SQL, Spark (comma-separated)" />
            <button onClick={addTech} className="px-4 py-2 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400 hover:bg-sky-400/20 transition-colors"><Plus size={14} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.technologies.map((tech) => (
              <span key={tech} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-400/10 border border-sky-400/15 text-sky-400 text-xs">
                {tech}<button onClick={() => setForm((f) => ({ ...f, technologies: f.technologies.filter((t) => t !== tech) }))} className="hover:text-red-400"><X size={11} /></button>
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
