"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, BookOpen, Zap } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa6";
import { cn } from "@/lib/utils";

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

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "badge-green",
  DRAFT: "badge-orange",
  ARCHIVED: "badge-purple",
};

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "Live",
  DRAFT: "In Progress",
  ARCHIVED: "Archived",
};

export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      <div
        className={cn(
          "glass-card rounded-3xl overflow-hidden transition-all duration-500 h-full flex flex-col",
          "hover:border-sky-400/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]",
          hovered && "border-sky-400/15"
        )}
      >
        {/* Glow effect on hover */}
        {hovered && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.05) 0%, transparent 70%)",
              zIndex: 0,
            }}
          />
        )}

        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-sky-900/30 to-indigo-900/30 overflow-hidden">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold gradient-text opacity-50">
                {project.title.slice(0, 2).toUpperCase()}
              </div>
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
          )}
          {/* Status badge overlay */}
          <div className="absolute top-3 right-3">
            <span className={cn("badge", STATUS_STYLES[project.status])}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {STATUS_LABELS[project.status]}
            </span>
          </div>
          {project.featured && (
            <div className="absolute top-3 left-3">
              <span className="badge badge-blue">
                <Zap size={10} />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col flex-1">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.category.slice(0, 3).map((cat) => (
              <span key={cat} className="text-xs text-sky-400/70 font-medium">
                {cat}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-3 flex-1">
            {project.shortDescription}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech.name}
                className="px-2 py-0.5 rounded-lg text-xs font-medium"
                style={{
                  background: `${tech.color || "#38bdf8"}15`,
                  color: tech.color || "#38bdf8",
                  border: `1px solid ${tech.color || "#38bdf8"}25`,
                }}
              >
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-medium text-white/30 bg-white/5 border border-white/5">
                +{project.technologies.length - 5}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-auto">
            <Link
              href={`/projects/${project.slug}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-400 to-indigo-500 text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all duration-300"
            >
              <BookOpen size={13} />
              Case Study
            </Link>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl glass border border-white/5 hover:border-white/15 text-white/50 hover:text-white transition-all duration-300"
              >
                <Github size={15} />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl glass border border-white/5 hover:border-sky-400/30 text-white/50 hover:text-sky-400 transition-all duration-300"
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
