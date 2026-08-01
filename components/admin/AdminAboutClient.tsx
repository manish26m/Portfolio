"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Plus, Edit, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

const inputClass = "w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 transition-all duration-300";
const labelClass = "block text-xs text-white/40 font-medium mb-1.5";

const EMPTY_JOURNEY = { year: "", title: "", description: "", icon: "GraduationCap", color: "sky", order: 0 };
const ICONS = ["GraduationCap", "Trophy", "Globe", "Rocket", "Briefcase", "Code", "Star"];
const COLORS = ["sky", "emerald", "violet", "orange", "rose", "amber"];

export function AdminAboutClient({ initialSettings, initialJourney }: { initialSettings: any, initialJourney: any[] }) {
  const router = useRouter();

  // Settings state
  const [settings, setSettings] = useState(initialSettings || {});
  const [savingSettings, setSavingSettings] = useState(false);

  // Journey state
  const [journey, setJourney] = useState(initialJourney);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY_JOURNEY);
  const [savingJourney, setSavingJourney] = useState(false);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) toast.success("About settings saved!");
      else toast.error("Failed to save settings");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveJourney = async () => {
    if (!form.title || !form.year) return toast.error("Title and Year are required");
    setSavingJourney(true);
    try {
      const url = editingId ? `/api/journey/${editingId}` : "/api/journey";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) {
        toast.success(editingId ? "Event updated" : "Event added");
        const updated = await res.json();
        setJourney((prev: any) => editingId ? prev.map((s: any) => s.id === editingId ? updated : s) : [...prev, updated]);
        setIsAdding(false);
        setEditingId(null);
        router.refresh();
      }
    } catch {
      toast.error("Failed to save journey event");
    } finally {
      setSavingJourney(false);
    }
  };

  const handleDeleteJourney = async (id: string, title: string) => {
    if (!confirm(`Delete ${title}?`)) return;
    const res = await fetch(`/api/journey/${id}`, { method: "DELETE" });
    if (res.ok) {
      setJourney((prev: any) => prev.filter((s: any) => s.id !== id));
      toast.success("Deleted event");
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* About Section Text */}
      <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">About Content</h2>
          <button onClick={handleSaveSettings} disabled={savingSettings} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400/10 text-sky-400 text-sm font-medium hover:bg-sky-400/20 transition-colors disabled:opacity-50">
            <Save size={14} /> {savingSettings ? "Saving..." : "Save About"}
          </button>
        </div>
        <div>
          <label className={labelClass}>Heading (e.g. Engineering Intelligence.)</label>
          <input type="text" value={settings.aboutHeading || ""} onChange={(e) => setSettings({ ...settings, aboutHeading: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Bio Text (Markdown supported)</label>
          <textarea rows={8} value={settings.aboutText || ""} onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })} className={`${inputClass} resize-none font-mono text-xs`} placeholder="I'm Manish Mishra..." />
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Journey Timeline</h2>
          <button onClick={() => { setIsAdding(true); setForm(EMPTY_JOURNEY); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400/10 text-sky-400 text-sm font-medium hover:bg-sky-400/20 transition-colors">
            <Plus size={14} /> Add Event
          </button>
        </div>

        {(isAdding || editingId) && (
          <div className="glass-card rounded-2xl p-5 border border-sky-400/20 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{editingId ? "Edit Event" : "New Event"}</h3>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-white/40 hover:text-white"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className={labelClass}>Year</label><input type="text" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputClass} placeholder="2021" /></div>
              <div><label className={labelClass}>Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Research Intern" /></div>
            </div>
            <div className="mb-4">
              <label className={labelClass}>Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelClass}>Icon</label>
                <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputClass}>
                  {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Color</label>
                <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputClass}>
                  {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={inputClass} /></div>
            </div>
            <button onClick={handleSaveJourney} disabled={savingJourney} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400 text-black text-sm font-semibold disabled:opacity-50">
              <Save size={14} /> {savingJourney ? "Saving..." : "Save Event"}
            </button>
          </div>
        )}

        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
          {journey.length === 0 ? (
            <div className="p-8 text-center text-white/40 text-sm">No journey events added yet.</div>
          ) : (
            journey.map((event) => (
              <div key={event.id} className="p-5 flex items-start gap-4 hover:bg-white/2 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-${event.color}-400/10 flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-${event.color}-400 text-xs font-bold`}>{event.year}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white mb-1">{event.title}</h4>
                  <p className="text-sm text-white/50">{event.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(event.id); setForm(event); setIsAdding(false); }} className="p-1.5 text-white/40 hover:text-sky-400"><Edit size={14} /></button>
                  <button onClick={() => handleDeleteJourney(event.id, event.title)} className="p-1.5 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
