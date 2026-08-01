"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FolderCode,
  Calendar,
  Layers,
  Briefcase,
  Award,
} from "lucide-react";
import { FaGithub as Github } from "react-icons/fa6";

const ICON_MAP: Record<string, React.ElementType> = {
  FolderCode,
  Calendar,
  Layers,
  Briefcase,
  Award,
  Github,
};

interface Stat {
  label: string;
  value: string;
  suffix?: string | null;
  icon?: string | null;
}

interface StatsProps {
  stats: Stat[];
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection({ stats }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-16 overflow-hidden">
      {/* Gradient divider top */}
      <div className="gradient-divider mb-16" />

      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {stats.map((stat, i) => {
            const Icon = ICON_MAP[stat.icon || "FolderCode"] || FolderCode;
            const numericValue = parseInt(stat.value, 10);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 text-center group hover:border-sky-400/20 hover:bg-sky-400/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20 border border-sky-400/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={18} />
                </div>
                <div className="text-2xl font-bold text-white tabular-nums">
                  <AnimatedCounter
                    target={numericValue}
                    suffix={stat.suffix || ""}
                  />
                </div>
                <div className="text-xs text-white/40 font-medium leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="gradient-divider mt-16" />
    </section>
  );
}
