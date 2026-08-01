"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  category: string;
  name: string;
  proficiency: number;
  description?: string | null;
}

interface SkillsSectionProps {
  skills: Skill[];
}

const CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  "AI & Machine Learning": {
    text: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
  },
  "Data Engineering": {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  "Programming Languages": {
    text: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  "DevOps & Cloud": {
    text: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  "Frameworks & Tools": {
    text: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
  },
};

const DEFAULT_STYLE = {
  text: "text-sky-400",
  bg: "bg-sky-400/10",
  border: "border-sky-400/20",
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <section id="skills" ref={ref} className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sky-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Expertise
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Full-stack expertise across AI, data, cloud, and engineering disciplines.
          </p>
        </motion.div>

        {/* Skill Clusters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {categories.map((category, i) => {
            const color = CATEGORY_COLORS[category] || DEFAULT_STYLE;
            const isExpanded = expandedCategory === category;
            const catSkills = grouped[category];

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="glass-card rounded-2xl overflow-hidden">
                  {/* Category header */}
                  <button
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : category)
                    }
                    className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-2 h-8 rounded-full",
                          color.bg.replace("/10", "/70")
                        )}
                        style={{
                          background: `linear-gradient(180deg, ${
                            color.text.includes("sky")
                              ? "#38bdf8"
                              : color.text.includes("emerald")
                              ? "#34d399"
                              : color.text.includes("violet")
                              ? "#a78bfa"
                              : color.text.includes("orange")
                              ? "#fb923c"
                              : "#f472b6"
                          }, transparent)`,
                        }}
                      />
                      <div className="text-left">
                        <h3 className={cn("font-bold text-base", color.text)}>
                          {category}
                        </h3>
                        <p className="text-xs text-white/30 mt-0.5">
                          {catSkills.length} skills
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-white/30" />
                    </motion.div>
                  </button>

                  {/* Skills preview (always visible) */}
                  <div className="px-5 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {catSkills
                        .slice(0, isExpanded ? catSkills.length : 4)
                        .map((skill) => (
                          <motion.span
                            key={skill.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 hover:scale-105 cursor-default",
                              color.bg,
                              color.text,
                              color.border
                            )}
                          >
                            {skill.name}
                          </motion.span>
                        ))}
                      {!isExpanded && catSkills.length > 4 && (
                        <button
                          onClick={() => setExpandedCategory(category)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 text-white/30 border border-white/5 hover:bg-white/8 transition-all"
                        >
                          +{catSkills.length - 4} more
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded view */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-white/5 pt-4">
                          <p className="text-xs text-white/30 mb-3">
                            Proficiency ranking
                          </p>
                          <div className="space-y-2.5">
                            {catSkills
                              .sort((a, b) => b.proficiency - a.proficiency)
                              .map((skill) => (
                                <div key={skill.id} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-white/70">
                                      {skill.name}
                                    </span>
                                    <span className={cn("text-xs font-semibold", color.text)}>
                                      {skill.proficiency}%
                                    </span>
                                  </div>
                                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${skill.proficiency}%` }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                      className={cn("h-full rounded-full", color.bg.replace("/10", "/60"))}
                                      style={{
                                        background: `linear-gradient(90deg, ${
                                          color.text.includes("sky")
                                            ? "#38bdf8"
                                            : color.text.includes("emerald")
                                            ? "#34d399"
                                            : color.text.includes("violet")
                                            ? "#a78bfa"
                                            : color.text.includes("orange")
                                            ? "#fb923c"
                                            : "#f472b6"
                                        }, transparent)`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
