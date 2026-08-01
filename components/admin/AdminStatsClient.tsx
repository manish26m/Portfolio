"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Plus, Edit, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

const inputClass = "w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 transition-all duration-300";
const labelClass = "block text-xs text-white/40 font-medium mb-1.5";

const EMPTY_STAT = { label: "", value: "", suffix: "", icon: "Terminal", order: 0 };
const ICONS = ["Terminal", "Code", "Database", "Server", "Users", "Briefcase", "Coffee", "Award"];

export function AdminStatsClient({ initialStats }: { initialStats: any[] }) {
  const router = useRouter();
  const [stats, setStats] = useState(initialStats);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY_STAT);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.label || !form.value) return toast.error("Label and Value are required");
    setSaving(true);
    try {
      const url = editingId ? `/api/stats/${editingId}` : "/api/stats";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) {
        toast.success(editingId ? "Stat updated" : "Stat added");
        const updated = await res.json();
        setStats((prev: any) => editingId ? prev.map((s: any) => s.id === editingId ? updated : s) : [...prev, updated]);
        setIsAdding(false);
        setEditingId(null);
        router.refresh();
      }
    } catch {
      toast.error("Failed to save stat");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete stat "${label}"?`)) return;
    const res = await fetch(`/api/stats/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStats((prev: any) => prev.filter((s: any) => s.id !== id));
      toast.success("Deleted stat");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => { setIsAdding(true); setForm(EMPTY_STAT); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400/10 text-sky-400 text-sm font-medium hover:bg-sky-400/20 transition-colors">
          <Plus size={14} /> Add Stat
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="glass-card rounded-2xl p-5 border border-sky-400/20 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">{editingId ? "Edit Stat" : "New Stat"}</h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-white/40 hover:text-white"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><label className={labelClass}>Value (e.g. 5, 100)</label><input type="text" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Suffix (e.g. +, %)</label><input type="text" value={form.suffix || ""} onChange={(e) => setForm({ ...form, suffix: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Label (e.g. Projects)</label><input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inputClass} /></div>
            <div>
              <label className={labelClass}>Icon</label>
              <select value={form.icon || "Terminal"} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputClass}>
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={inputClass} /></div>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400 text-black text-sm font-semibold disabled:opacity-50">
            <Save size={14} /> {saving ? "Saving..." : "Save Stat"}
          </button>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
        {stats.length === 0 ? (
          <div className="p-8 text-center text-white/40 text-sm">No stats added yet.</div>
        ) : (
          stats.map((stat: any) => (
            <div key={stat.id} className="p-5 flex items-center justify-between hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-400/10 flex items-center justify-center border border-sky-400/20">
                  <span className="text-sky-400 font-bold text-lg">{stat.value}{stat.suffix}</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">{stat.label}</h4>
                  <p className="text-xs text-white/40">Icon: {stat.icon}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(stat.id); setForm(stat); setIsAdding(false); }} className="p-2 text-white/40 hover:text-sky-400"><Edit size={16} /></button>
                <button onClick={() => handleDelete(stat.id, stat.label)} className="p-2 text-white/40 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
