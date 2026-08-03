"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Save, Plus, X, Move } from "lucide-react";

interface Hero {
  id?: string;
  name: string;
  titles: string[];
  tagline: string;
  description: string;
  photoUrl?: string;
  photoX?: number;
  photoY?: number;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
}

const EMPTY: Hero = {
  name: "", titles: [], tagline: "", description: "",
  photoUrl: "", photoX: 50, photoY: 50,
  ctaPrimary: "Explore Projects", ctaSecondary: "Download Resume", ctaTertiary: "Contact"
};

const inputClass = "w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 transition-all duration-300";
const labelClass = "block text-xs text-white/40 font-medium mb-1.5";

/** Draggable photo repositioner — drag inside circle to pan */
function PhotoPositioner({
  url,
  x,
  y,
  onChange,
}: {
  url: string;
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
}) {
  const dragging = useRef(false);
  const startPos = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startPos.current = { mx: e.clientX, my: e.clientY, ox: x, oy: y };

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        // Each 2px of drag = 1% shift (feels natural at circle size ~200px)
        const dx = ((ev.clientX - startPos.current.mx) / 2);
        const dy = ((ev.clientY - startPos.current.my) / 2);
        const nx = Math.min(100, Math.max(0, startPos.current.ox - dx));
        const ny = Math.min(100, Math.max(0, startPos.current.oy - dy));
        onChange(Math.round(nx * 10) / 10, Math.round(ny * 10) / 10);
      };

      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [x, y, onChange]
  );

  // Touch support
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      startPos.current = { mx: touch.clientX, my: touch.clientY, ox: x, oy: y };

      const onMove = (ev: TouchEvent) => {
        const t = ev.touches[0];
        const dx = ((t.clientX - startPos.current.mx) / 2);
        const dy = ((t.clientY - startPos.current.my) / 2);
        const nx = Math.min(100, Math.max(0, startPos.current.ox - dx));
        const ny = Math.min(100, Math.max(0, startPos.current.oy - dy));
        onChange(Math.round(nx * 10) / 10, Math.round(ny * 10) / 10);
      };

      const onEnd = () => {
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };

      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onEnd);
    },
    [x, y, onChange]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs text-white/40 flex items-center gap-1.5">
        <Move size={12} />
        Drag inside the circle to reposition your photo
      </p>

      {/* Circle preview */}
      <div
        className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-sky-400/30 cursor-grab active:cursor-grabbing select-none shadow-[0_0_30px_rgba(56,189,248,0.15)]"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{ touchAction: "none" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Profile preview"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${x}% ${y}%`,
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
        {/* Crosshair overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-px h-full bg-white/20 absolute" />
          <div className="h-px w-full bg-white/20 absolute" />
        </div>
      </div>

      {/* Numeric readout */}
      <p className="text-xs text-white/30 tabular-nums">
        Position: {x}% / {y}%
        <button
          onClick={() => onChange(50, 50)}
          className="ml-3 text-sky-400/60 hover:text-sky-400 transition-colors"
        >
          Reset
        </button>
      </p>
    </div>
  );
}

export function AdminHeroClient({ initialData }: { initialData?: Hero }) {
  const [form, setForm] = useState<Hero>({
    ...EMPTY,
    ...initialData,
    photoX: initialData?.photoX ?? 50,
    photoY: initialData?.photoY ?? 50,
  });
  const [titleInput, setTitleInput] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key: keyof Hero, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const setPos = useCallback((x: number, y: number) => {
    setForm((f) => ({ ...f, photoX: x, photoY: y }));
  }, []);

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

        {/* Drag-to-reposition preview — only shown when a photo URL is set */}
        {form.photoUrl && (
          <div className="pt-2">
            <PhotoPositioner
              url={form.photoUrl}
              x={form.photoX ?? 50}
              y={form.photoY ?? 50}
              onChange={setPos}
            />
          </div>
        )}

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
