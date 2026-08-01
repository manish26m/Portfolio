"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Plus, Edit, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

const inputClass = "w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 transition-all duration-300";
const labelClass = "block text-xs text-white/40 font-medium mb-1.5";

const EMPTY_SOCIAL = { platform: "", url: "", username: "", icon: "Github", order: 0 };
const ICONS = ["Github", "Linkedin", "Twitter", "Instagram", "Mail", "Link"];

export function AdminSocialsClient({ initialSocials }: { initialSocials: any[] }) {
  const router = useRouter();
  const [socials, setSocials] = useState(initialSocials);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY_SOCIAL);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.platform || !form.url) return toast.error("Platform and URL are required");
    setSaving(true);
    try {
      const url = editingId ? `/api/socials/${editingId}` : "/api/socials";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) {
        toast.success(editingId ? "Social updated" : "Social added");
        const updated = await res.json();
        setSocials((prev: any) => editingId ? prev.map((s: any) => s.id === editingId ? updated : s) : [...prev, updated]);
        setIsAdding(false);
        setEditingId(null);
        router.refresh();
      }
    } catch {
      toast.error("Failed to save social");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, platform: string) => {
    if (!confirm(`Delete ${platform}?`)) return;
    const res = await fetch(`/api/socials/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSocials((prev: any) => prev.filter((s: any) => s.id !== id));
      toast.success("Deleted social link");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => { setIsAdding(true); setForm(EMPTY_SOCIAL); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400/10 text-sky-400 text-sm font-medium hover:bg-sky-400/20 transition-colors">
          <Plus size={14} /> Add Link
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="glass-card rounded-2xl p-5 border border-sky-400/20 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">{editingId ? "Edit Link" : "New Link"}</h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-white/40 hover:text-white"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><label className={labelClass}>Platform</label><input type="text" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={inputClass} placeholder="e.g. GitHub" /></div>
            <div><label className={labelClass}>Username</label><input type="text" value={form.username || ""} onChange={(e) => setForm({ ...form, username: e.target.value })} className={inputClass} placeholder="@manish" /></div>
            <div className="col-span-2"><label className={labelClass}>URL</label><input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClass} placeholder="https://..." /></div>
            <div>
              <label className={labelClass}>Icon</label>
              <select value={form.icon || "Github"} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputClass}>
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={inputClass} /></div>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400 text-black text-sm font-semibold disabled:opacity-50">
            <Save size={14} /> {saving ? "Saving..." : "Save Link"}
          </button>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
        {socials.length === 0 ? (
          <div className="p-8 text-center text-white/40 text-sm">No social links added yet.</div>
        ) : (
          socials.map((social: any) => (
            <div key={social.id} className="p-5 flex items-center justify-between hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <span className="text-white/60 text-xs font-mono">{social.icon.substring(0, 2)}</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">{social.platform}</h4>
                  <p className="text-xs text-white/40">{social.url}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(social.id); setForm(social); setIsAdding(false); }} className="p-2 text-white/40 hover:text-sky-400"><Edit size={16} /></button>
                <button onClick={() => handleDelete(social.id, social.platform)} className="p-2 text-white/40 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
