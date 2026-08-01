"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Search, SlidersHorizontal } from "lucide-react";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "AI", value: "AI" },
  { label: "Machine Learning", value: "Machine Learning" },
  { label: "Data Engineering", value: "Data Engineering" },
  { label: "Backend", value: "Backend" },
  { label: "DevOps", value: "DevOps" },
  { label: "Cloud", value: "Cloud" },
  { label: "LLMs", value: "LLMs" },
  { label: "Analytics", value: "Analytics" },
  { label: "Python", value: "Python" },
];

interface Technology {
  name: string;
  color?: string | null;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  thumbnailUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  status: string;
  featured: boolean;
  category: string[];
  technologies: Technology[];
}

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const filtered = projects.filter((p) => {
    const matchFilter =
      activeFilter === "all" || p.category.includes(activeFilter);
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      );
    return matchFilter && matchSearch;
  });

  return (
    <section id="projects" ref={ref} className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sky-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Work
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Production-grade systems spanning AI, data engineering, DevOps, and backend development.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-10 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search projects or technologies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 placeholder:text-white/25 transition-all duration-300"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeFilter === filter.value
                    ? "bg-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.35)]"
                    : "glass text-white/50 hover:text-white/80 hover:bg-white/5 border border-white/5"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <SlidersHorizontal size={40} className="mx-auto mb-4 opacity-50" />
            <p>No projects match your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
