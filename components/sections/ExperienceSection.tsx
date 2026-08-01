"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { MapPin, ExternalLink, Briefcase, FlaskConical } from "lucide-react";

interface Experience {
  id: string;
  company: string;
  role: string;
  type: string;
  location?: string | null;
  startDate: string | Date;
  endDate?: string | Date | null;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  logoUrl?: string | null;
  companyUrl?: string | null;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" ref={ref} className="section-padding bg-[#0a0a0c]">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sky-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Career
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Experience
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Building real-world systems across AI, data engineering, and research.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sky-400/30 via-indigo-400/20 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              const Icon = exp.type === "Research" ? FlaskConical : Briefcase;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-[0_0_12px_rgba(56,189,248,0.5)] z-10" />

                  {/* Card */}
                  <div
                    className={`ml-16 md:ml-0 ${
                      isLeft ? "md:pr-12 md:w-1/2" : "md:pl-12 md:w-1/2"
                    }`}
                  >
                    <div className="glass-card rounded-2xl p-6 hover:border-sky-400/15 transition-all duration-300 group">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="badge badge-blue text-xs">
                              <Icon size={10} />
                              {exp.type}
                            </span>
                            {exp.current && (
                              <span className="badge badge-green text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Current
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                            {exp.role}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {exp.companyUrl ? (
                              <a
                                href={exp.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-400 font-semibold text-sm hover:underline flex items-center gap-1"
                              >
                                {exp.company}
                                <ExternalLink size={11} />
                              </a>
                            ) : (
                              <span className="text-sky-400 font-semibold text-sm">
                                {exp.company}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-4">
                        <span>
                          {formatDate(exp.startDate)} —{" "}
                          {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {exp.location}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-white/55 leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      {exp.achievements.length > 0 && (
                        <ul className="space-y-2 mb-4">
                          {exp.achievements.map((a, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-white/60">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-sky-400 flex-shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Technologies */}
                      {exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-lg text-xs font-medium bg-sky-400/10 text-sky-400 border border-sky-400/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
