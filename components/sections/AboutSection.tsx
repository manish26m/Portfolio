"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Globe, Trophy, Rocket, Briefcase, Code, Star } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  GraduationCap, Trophy, Globe, Rocket, Briefcase, Code, Star
};

const COLOR_MAP: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  sky: { text: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20", glow: "rgba(56,189,248,0.3)" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", glow: "rgba(52,211,153,0.3)" },
  violet: { text: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", glow: "rgba(167,139,250,0.3)" },
  orange: { text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", glow: "rgba(251,146,60,0.3)" },
  rose: { text: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20", glow: "rgba(244,63,94,0.3)" },
  amber: { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", glow: "rgba(251,191,36,0.3)" },
};

interface AboutProps {
  settings: any;
  journey: any[];
}

export function AboutSection({ settings, journey }: AboutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="section-padding bg-[#0a0a0c]">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20"
        >
          {/* Left — editorial text */}
          <div>
            <span className="inline-block text-sky-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              About
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight whitespace-pre-wrap">
              {settings?.aboutHeading || "Engineering\nIntelligence."}
            </h2>
            <div className="space-y-4 text-white/55 text-base leading-relaxed whitespace-pre-wrap">
              {settings?.aboutText || "I'm Manish Mishra, a Computer Science Engineering student specializing in AI and Data Engineering."}
            </div>
          </div>

          {/* Right — quick facts */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "University", value: "LPU Punjab", sub: "B.Tech CSE (AI & DE)" },
              { label: "Focus Areas", value: "AI · Data · Cloud", sub: "Multidisciplinary Engineer" },
              { label: "Certification", value: "Microsoft DP-900", sub: "Azure Data Fundamentals" },
              { label: "Achievement", value: "ITMO Scholar", sub: "Full Semester Scholarship" },
            ].map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className="glass-card rounded-2xl p-5"
              >
                <p className="text-xs text-white/30 font-medium mb-2">{fact.label}</p>
                <p className="text-base font-bold text-white mb-0.5">{fact.value}</p>
                <p className="text-xs text-white/40">{fact.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">The Journey</h3>
          <div className="relative">
            {/* Horizontal connector line (desktop) */}
            <div className="hidden lg:block absolute top-16 left-8 right-8 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

            <div className="relative border-l border-white/5 pl-8 ml-4 sm:ml-0 space-y-12">
            {(journey?.length > 0 ? journey : []).map((item, i) => {
              const Icon = ICON_MAP[item.icon] || GraduationCap;
              const color = COLOR_MAP[item.color] || COLOR_MAP.sky;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline dot */}
                  <div 
                    className={`absolute -left-[53px] top-1 w-10 h-10 rounded-full flex items-center justify-center border ${color.border} ${color.bg} ${color.text} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1`}
                    style={{ boxShadow: `0 0 20px ${color.glow}` }}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                    <span className={`inline-block text-sm font-bold ${color.text} mb-2`}>
                      {item.year}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
