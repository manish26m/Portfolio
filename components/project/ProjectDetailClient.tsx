"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ArrowLeft,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaGithub as Github } from "react-icons/fa6";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/utils";

interface Technology {
  id: string;
  name: string;
  color?: string | null;
}

interface ProjectImage {
  id: string;
  url: string;
  caption?: string | null;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  overview?: string | null;
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  challenges?: string | null;
  decisions?: string | null;
  performance?: string | null;
  lessons?: string | null;
  futureWork?: string | null;
  thumbnailUrl?: string | null;
  heroImageUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  status: string;
  featured: boolean;
  category: string[];
  technologies: Technology[];
  images: ProjectImage[];
}

const SECTIONS = [
  { key: "overview", title: "Overview" },
  { key: "problem", title: "The Problem" },
  { key: "solution", title: "The Solution" },
  { key: "architecture", title: "Architecture" },
  { key: "challenges", title: "Challenges" },
  { key: "decisions", title: "Engineering Decisions" },
  { key: "performance", title: "Performance" },
  { key: "lessons", title: "Lessons Learned" },
  { key: "futureWork", title: "Future Work" },
];

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const isInline = !match;
          return isInline ? (
            <code
              className="px-1.5 py-0.5 rounded-md bg-sky-400/10 text-sky-400 text-xs font-mono"
              {...(props as any)}
            >
              {children}
            </code>
          ) : (
            <SyntaxHighlighter
              style={oneDark as any}
              language={match[1]}
              PreTag="div"
              customStyle={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                fontSize: "13px",
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-white mt-6 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-white/90 mt-5 mb-2">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-white/60 leading-relaxed mb-4 text-sm">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-2 mb-4 ml-4">{children}</ul>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2 text-sm text-white/60">
            <span className="mt-2 w-1 h-1 rounded-full bg-sky-400 flex-shrink-0" />
            <span>{children}</span>
          </li>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-xs font-semibold text-sky-400 border-b border-white/10">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-xs text-white/60 border-b border-white/5">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function ProjectDetailClient({
  project,
  relatedProjects,
}: {
  project: Project;
  relatedProjects: Project[];
}) {
  const [imageIndex, setImageIndex] = useState(0);

  const activeSections = SECTIONS.filter(
    (s) => project[s.key as keyof Project] as string
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <div className="relative">
        {(project.heroImageUrl || project.thumbnailUrl) && (
          <div className="relative h-[45vh] overflow-hidden">
            <Image
              src={project.heroImageUrl || project.thumbnailUrl!}
              alt={project.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/50 via-transparent to-[#080808]" />
          </div>
        )}

        <div className="container-wide relative z-10 mt-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors mb-8 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Projects
          </Link>

          {/* Title area */}
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.category.map((cat) => (
                <span key={cat} className="badge badge-blue">
                  {cat}
                </span>
              ))}
              {project.featured && (
                <span className="badge badge-purple">Featured</span>
              )}
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-4">
              {project.title}
            </h1>

            <p className="text-lg text-white/55 leading-relaxed mb-8 max-w-2xl">
              {project.shortDescription}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all duration-300"
                >
                  <Github size={15} />
                  View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300"
                >
                  <ExternalLink size={15} />
                  Live Demo
                </a>
              )}
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech.id}
                  className="px-3 py-1 rounded-xl text-xs font-medium"
                  style={{
                    background: `${tech.color || "#38bdf8"}15`,
                    color: tech.color || "#38bdf8",
                    border: `1px solid ${tech.color || "#38bdf8"}25`,
                  }}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar TOC */}
          <div className="hidden lg:block">
            <div className="sticky top-28 space-y-1">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                Case Study
              </p>
              {activeSections.map((s) => (
                <a
                  key={s.key}
                  href={`#${s.key}`}
                  className="block text-sm text-white/40 hover:text-sky-400 py-1.5 border-l border-white/5 hover:border-sky-400/50 pl-3 transition-all duration-200"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {activeSections.map((s) => (
              <motion.div
                key={s.key}
                id={s.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-28"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="gradient-text text-sm font-semibold">
                    0{activeSections.indexOf(s) + 1}
                  </span>
                  {s.title}
                </h2>
                <div className="glass-card rounded-2xl p-6">
                  <MarkdownRenderer
                    content={project[s.key as keyof Project] as string}
                  />
                </div>
              </motion.div>
            ))}

            {/* Screenshots */}
            {project.images.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Screenshots</h2>
                <div className="relative glass-card rounded-2xl overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={project.images[imageIndex].url}
                      alt={
                        project.images[imageIndex].caption ||
                        `Screenshot ${imageIndex + 1}`
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                  {project.images.length > 1 && (
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
                      <button
                        onClick={() =>
                          setImageIndex((i) =>
                            (i - 1 + project.images.length) % project.images.length
                          )
                        }
                        className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setImageIndex((i) => (i + 1) % project.images.length)
                        }
                        className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                  {project.images[imageIndex].caption && (
                    <div className="p-4 text-center text-xs text-white/40">
                      {project.images[imageIndex].caption}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-white mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.id} project={p as any} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
