"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit, Trash2, Plus, X, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface Skill {
  id: string; name: string; category: string;
  proficiency: number; description?: string | null; order: number;
}

const CATEGORIES = ["Frontend", "Backend", "AI/ML", "DevOps", "Database", "Other"];
const EMPTY = { name: "", category: "Frontend", proficiency: 80, description: "", order: 0 };
const inputClass = "w-full px-3 py-2 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80";

export function AdminSkillsClient({ skills: initial }: { skills: Skill[] }) {
  const [skills, setSkills] = useState(initial);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Skill>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!form.name || !form.category) return toast.error("Name and Category required");
    setSaving(true);
    try {
      const url = editingId ? `/api/skills/${editingId}` : "/api/skills";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) {
        toast.success(editingId ? "Skill updated" : "Skill added");
        const updated = await res.json();
        setSkills((prev) => editingId ? prev.map((s) => s.id === editingId ? updated : s) : [...prev, updated]);
        setIsAdding(false);
        setEditingId(null);
        router.refresh();
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success("Deleted");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => { setIsAdding(true); setForm(EMPTY); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400/10 text-sky-400 text-sm font-medium hover:bg-sky-400/20 transition-colors">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="glass-card rounded-2xl p-5 border border-sky-400/20 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">{editingId ? "Edit Skill" : "New Skill"}</h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-white/40 hover:text-white"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Name</label>
              <input type="text" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="React" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Category</label>
              <select value={form.category || "Frontend"} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Proficiency (0-100)</label>
              <input type="number" value={form.proficiency || 0} onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Order</label>
              <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={inputClass} />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400 text-black text-sm font-semibold disabled:opacity-50">
            <Save size={14} /> {saving ? "Saving..." : "Save Skill"}
          </button>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm text-white/70">
          <thead className="bg-white/5 text-white/40 border-b border-white/5">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Proficiency</th>
              <th className="px-5 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {skills.map((s) => (
              <tr key={s.id} className="hover:bg-white/2 transition-colors">
                <td className="px-5 py-3 font-medium text-white/90">{s.name}</td>
                <td className="px-5 py-3"><span className="px-2 py-1 rounded-md bg-white/5 text-xs">{s.category}</span></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-sky-400 rounded-full" style={{ width: `${s.proficiency}%` }} /></div>
                    <span className="text-xs">{s.proficiency}%</span>
                  </div>
                </td>
                <td className="px-5 py-3 flex items-center gap-2">
                  <button onClick={() => { setEditingId(s.id); setForm(s); setIsAdding(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="p-1.5 text-white/40 hover:text-sky-400"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(s.id, s.name)} className="p-1.5 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
