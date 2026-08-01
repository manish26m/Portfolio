"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeuralNetworkBackground } from "@/components/animations/NeuralNetworkBackground";
import { ChevronDown, Download, Send, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  hero: any;
  resume: any;
}

export function HeroSection({ hero, resume }: HeroProps) {
  const titles = hero?.titles?.length > 0 ? hero.titles : ["AI Engineer", "Data Engineer", "Software Developer"];
  const name = hero?.name || "Manish Mishra";
  const tagline = hero?.tagline || "Building production-grade intelligent systems.";
  const description = hero?.description || "Computer Science Engineer specializing in AI & Data Engineering.";
  const ctaPrimary = hero?.ctaPrimary || "Explore Projects";
  const ctaSecondary = hero?.ctaSecondary || "Download Resume";
  const ctaTertiary = hero?.ctaTertiary || "Contact";

  const [titleIndex, setTitleIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTitleIndex((i) => (i + 1) % titles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <NeuralNetworkBackground />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_60%,rgba(129,140,248,0.06),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 pt-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-sky-400/20 text-sky-400 text-sm font-medium">
            <Sparkles size={14} className="animate-pulse" />
            Available for opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none mb-4"
        >
          <span className="text-white">{name.split(" ")[0]}</span>
          <br />
          <span className="gradient-text">{name.split(" ").slice(1).join(" ")}</span>
        </motion.h1>

        {/* Rotating title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="h-12 sm:h-14 flex items-center justify-center mb-6"
        >
          <AnimatePresence mode="wait">
            {mounted && (
              <motion.span
                key={titleIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-xl sm:text-2xl lg:text-3xl font-medium text-white/70"
              >
                {titles[titleIndex]}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-2xl text-base sm:text-lg text-white/50 leading-relaxed mb-10"
        >
          <span className="text-white/80 font-medium">{tagline}</span>
          <br />
          {description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
        >
          {/* Primary CTA */}
          <button
            onClick={scrollToProjects}
            className="group relative px-7 py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-sky-400 to-indigo-500 text-white overflow-hidden shadow-[0_0_30px_rgba(56,189,248,0.35)] hover:shadow-[0_0_50px_rgba(56,189,248,0.55)] transition-all duration-300 hover:scale-[1.03]"
          >
            <span className="relative z-10 flex items-center gap-2">
              {ctaPrimary}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </span>
            {/* Shimmer */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>

          {/* Secondary CTA */}
          {resume?.url ? (
            <a
              href={resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-2xl font-semibold text-sm glass border border-white/10 hover:border-sky-400/30 text-white/80 hover:text-white flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:bg-white/5"
            >
              <Download size={15} />
              {ctaSecondary}
            </a>
          ) : (
            <a
              href="/resume.pdf"
              download
              className="px-7 py-3.5 rounded-2xl font-semibold text-sm glass border border-white/10 hover:border-sky-400/30 text-white/80 hover:text-white flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:bg-white/5"
            >
              <Download size={15} />
              {ctaSecondary}
            </a>
          )}

          {/* Tertiary CTA */}
          <button
            onClick={scrollToContact}
            className="px-7 py-3.5 rounded-2xl font-semibold text-sm text-white/50 hover:text-white/80 flex items-center gap-2 transition-all duration-300"
          >
            <Send size={14} />
            {ctaTertiary}
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/25 tracking-widest uppercase font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown size={16} className="text-white/25" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
