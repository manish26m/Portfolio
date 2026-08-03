"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Plus, X } from "lucide-react";

interface Hero {
  id?: string;
  name: string;
  titles: string[];
  tagline: string;
  description: string;
  photoUrl?: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
}

const EMPTY: Hero = {
  name: "", titles: [], tagline: "", description: "",
  ctaPrimary: "Explore Projects", ctaSecondary: "Download Resume", ctaTertiary: "Contact"
};

const inputClass = "w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 transition-all duration-300";
const labelClass = "block text-xs text-white/40 font-medium mb-1.5";

export function AdminHeroClient({ initialData }: { initialData?: Hero }) {
  const [form, setForm] = useState<Hero>(initialData || EMPTY);
  const [titleInput, setTitleInput] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key: keyof Hero, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const addTitle = () => {
    if (!titleInput.trim()) return;
    setForm((f) => ({ ...f, titles: [...f.titles, titleInput.trim()] }));
    setTitleInput("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) toast.success("Hero section saved successfully!");
      else toast.error("Failed to save");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Identity</h2>
        <div>
          <label className={labelClass}>Your Name</label>
          <input type="text" value={form.name || ""} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="Manish Mishra" />
        </div>
        <div>
          <label className={labelClass}>Profile Photo URL</label>
          <input type="url" value={form.photoUrl || ""} onChange={(e) => set("photoUrl", e.target.value)} className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label className={labelClass}>Rotating Titles (e.g., AI Engineer, Python Developer)</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTitle()}
              className={`${inputClass} flex-1`}
              placeholder="Add a title..."
            />
            <button onClick={addTitle} className="px-4 py-2 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400 hover:bg-sky-400/20 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.titles?.map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-400/10 border border-sky-400/15 text-sky-400 text-xs">
                {t}
                <button onClick={() => setForm((f) => ({ ...f, titles: f.titles.filter((_, j) => j !== i) }))} className="hover:text-red-400">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Content</h2>
        <div>
          <label className={labelClass}>Tagline</label>
          <input type="text" value={form.tagline || ""} onChange={(e) => set("tagline", e.target.value)} className={inputClass} placeholder="Building scalable AI solutions." />
        </div>
        <div>
          <label className={labelClass}>Bio / Description</label>
          <textarea rows={4} value={form.description || ""} onChange={(e) => set("description", e.target.value)} className={`${inputClass} resize-none`} placeholder="I'm an AI engineer specializing in..." />
        </div>
      </section>

      <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Buttons (Call to Actions)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={labelClass}>Primary Button</label><input type="text" value={form.ctaPrimary || ""} onChange={(e) => set("ctaPrimary", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Secondary Button</label><input type="text" value={form.ctaSecondary || ""} onChange={(e) => set("ctaSecondary", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Tertiary Button</label><input type="text" value={form.ctaTertiary || ""} onChange={(e) => set("ctaTertiary", e.target.value)} className={inputClass} /></div>
        </div>
      </section>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300 disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save Hero"}
        </button>
      </div>
    </div>
  );
}
