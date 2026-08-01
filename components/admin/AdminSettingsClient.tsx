"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface Settings {
  id?: string; siteTitle: string; siteDescription: string;
  email: string; phone: string; location: string;
  calendarUrl: string; metaKeywords: string; ogImage: string;
}

const EMPTY = { siteTitle: "", siteDescription: "", email: "", phone: "", location: "", calendarUrl: "", metaKeywords: "", ogImage: "" };

const inputClass = "w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 transition-all duration-300";
const labelClass = "block text-xs text-white/40 font-medium mb-1.5";

export function AdminSettingsClient({ initialSettings }: { initialSettings?: Settings }) {
  const [form, setForm] = useState<Settings>(initialSettings || EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof Settings, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) toast.success("Settings saved successfully!");
      else toast.error("Failed to save settings");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">SEO & Metadata</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Site Title</label><input type="text" value={form.siteTitle || ""} onChange={(e) => set("siteTitle", e.target.value)} className={inputClass} placeholder="Manish Mishra - Portfolio" /></div>
          <div><label className={labelClass}>Keywords (comma-separated)</label><input type="text" value={form.metaKeywords || ""} onChange={(e) => set("metaKeywords", e.target.value)} className={inputClass} placeholder="Developer, Portfolio, React..." /></div>
        </div>
        <div>
          <label className={labelClass}>Site Description</label>
          <textarea rows={3} value={form.siteDescription || ""} onChange={(e) => set("siteDescription", e.target.value)} className={`${inputClass} resize-none`} placeholder="Senior AI Engineer building scalable web applications..." />
        </div>
        <div><label className={labelClass}>OG Image URL (Social Sharing Preview)</label><input type="url" value={form.ogImage || ""} onChange={(e) => set("ogImage", e.target.value)} className={inputClass} placeholder="https://..." /></div>
      </section>

      <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Contact Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Public Email</label><input type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="hello@example.com" /></div>
          <div><label className={labelClass}>Phone Number</label><input type="text" value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} className={inputClass} placeholder="+1 234 567 890" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Location</label><input type="text" value={form.location || ""} onChange={(e) => set("location", e.target.value)} className={inputClass} placeholder="San Francisco, CA" /></div>
          <div><label className={labelClass}>Calendar / Booking URL</label><input type="url" value={form.calendarUrl || ""} onChange={(e) => set("calendarUrl", e.target.value)} className={inputClass} placeholder="https://cal.com/..." /></div>
        </div>
      </section>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300 disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
