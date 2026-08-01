"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["AI/ML", "Data Engineering", "Full Stack", "Backend", "DevOps", "Open Source", "Research"];
const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"];

interface Technology { id: string; name: string; color?: string | null; }

interface Project {
  id?: string; slug?: string; title: string; shortDescription: string;
  description: string; overview?: string | null; problem?: string | null;
  solution?: string | null; architecture?: string | null; challenges?: string | null;
  decisions?: string | null; performance?: string | null; lessons?: string | null;
  futureWork?: string | null; thumbnailUrl?: string | null; heroImageUrl?: string | null;
  liveUrl?: string | null; githubUrl?: string | null; status: string;
  featured: boolean; order: number; category: string[]; technologies: Technology[];
}

const EMPTY: Project = {
  title: "", shortDescription: "", description: "", status: "DRAFT",
  featured: false, order: 0, category: [], technologies: [],
};

export function ProjectForm({ initialData }: { initialData?: Project }) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState<Project>(initialData || EMPTY);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key: keyof Project, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const toggleCategory = (cat: string) => {
    setForm((f) => ({
      ...f,
      category: f.category.includes(cat) ? f.category.filter((c) => c !== cat) : [...f.category, cat],
    }));
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    const names = techInput.split(",").map((t) => t.trim()).filter(Boolean);
    setForm((f) => ({
      ...f,
      technologies: [...f.technologies, ...names.map((name) => ({ id: name, name }))],
    }));
    setTechInput("");
  };

  const removeTech = (name: string) => {
    setForm((f) => ({ ...f, technologies: f.technologies.filter((t) => t.name !== name) }));
  };

  const handleSave = async () => {
    if (!form.title || !form.shortDescription) {
      toast.error("Title and short description are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies.map((t) => t.name),
      };

      const url = isEdit ? `/api/projects/${initialData!.id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEdit ? "Project updated!" : "Project created!");
        router.push("/admin/projects");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 transition-all duration-300";
  const labelClass = "block text-xs text-white/40 font-medium mb-1.5";
  const textareaClass = `${inputClass} resize-none`;

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] pb-20">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/projects" className="text-white/40 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-lg font-bold text-white">
              {isEdit ? `Edit: ${initialData!.title}` : "New Project"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="px-3 py-2 rounded-xl glass border border-white/5 text-xs text-white/70 outline-none"
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-sm font-semibold disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-8 space-y-8">
        {/* Basic Info */}
        <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Basic Info</h2>
          <Field label="Project Title *">
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} placeholder="MediReporter AI" />
          </Field>
          <Field label="Short Description * (shown in cards)">
            <input type="text" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className={inputClass} placeholder="A brief 1-2 sentence description" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Live URL">
              <input type="url" value={form.liveUrl || ""} onChange={(e) => set("liveUrl", e.target.value)} className={inputClass} placeholder="https://..." />
            </Field>
            <Field label="GitHub URL">
              <input type="url" value={form.githubUrl || ""} onChange={(e) => set("githubUrl", e.target.value)} className={inputClass} placeholder="https://github.com/..." />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Thumbnail Image URL">
              <input type="url" value={form.thumbnailUrl || ""} onChange={(e) => set("thumbnailUrl", e.target.value)} className={inputClass} placeholder="https://..." />
            </Field>
            <Field label="Hero Image URL">
              <input type="url" value={form.heroImageUrl || ""} onChange={(e) => set("heroImageUrl", e.target.value)} className={inputClass} placeholder="https://..." />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Display Order">
              <input type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} className={inputClass} />
            </Field>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-sky-400" />
              <label htmlFor="featured" className="text-sm text-white/70">Featured project</label>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  form.category.includes(cat)
                    ? "bg-sky-400/20 text-sky-400 border border-sky-400/30"
                    : "glass border border-white/5 text-white/40 hover:text-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Technologies */}
        <section className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Technologies</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTech()}
              className={`${inputClass} flex-1`}
              placeholder="Python, FastAPI, PostgreSQL (comma-separated or press Enter)"
            />
            <button onClick={addTech} className="px-4 py-2 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400 text-sm hover:bg-sky-400/20 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.technologies.map((tech) => (
              <span key={tech.name} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-400/10 border border-sky-400/15 text-sky-400 text-xs">
                {tech.name}
                <button onClick={() => removeTech(tech.name)} className="hover:text-red-400 transition-colors">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Case Study Sections */}
        <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Case Study (Markdown Supported)</h2>
          {[
            { key: "overview", label: "Overview" },
            { key: "problem", label: "The Problem" },
            { key: "solution", label: "The Solution" },
            { key: "architecture", label: "Architecture" },
            { key: "challenges", label: "Challenges" },
            { key: "decisions", label: "Engineering Decisions" },
            { key: "performance", label: "Performance" },
            { key: "lessons", label: "Lessons Learned" },
            { key: "futureWork", label: "Future Work" },
          ].map(({ key, label }) => (
            <Field key={key} label={label}>
              <textarea
                rows={4}
                value={(form as any)[key] || ""}
                onChange={(e) => set(key as keyof Project, e.target.value)}
                className={textareaClass}
                placeholder={`Write about ${label.toLowerCase()}... (Markdown supported)`}
              />
            </Field>
          ))}
        </section>
      </div>
    </div>
  );
}
