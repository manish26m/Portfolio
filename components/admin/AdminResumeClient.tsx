"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, FileText, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminResumeClient({ currentResume }: { currentResume: any }) {
  const router = useRouter();
  const [url, setUrl] = useState(currentResume?.url || "");
  const [filename, setFilename] = useState(currentResume?.filename || "Resume.pdf");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!url || !filename) return toast.error("URL and Filename are required");
    setSaving(true);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, filename }),
      });
      if (res.ok) {
        toast.success("Resume updated successfully!");
        router.refresh();
      } else {
        toast.error("Failed to update resume");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Current Resume</h2>
            {currentResume?.url ? (
              <a href={currentResume.url} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-400 hover:underline flex items-center gap-1 mt-1">
                View current PDF <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-sm text-white/40 mt-1">No resume uploaded yet.</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-4">
          <div>
            <label className="block text-xs text-white/40 font-medium mb-1.5">Resume URL (Google Drive, Cloudinary, etc.)</label>
            <input 
              type="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80" 
              placeholder="https://..." 
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 font-medium mb-1.5">Display Filename</label>
            <input 
              type="text" 
              value={filename} 
              onChange={(e) => setFilename(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80" 
              placeholder="Manish_Mishra_Resume.pdf" 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300 disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}
