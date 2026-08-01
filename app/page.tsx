import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { AboutSection } from "@/components/sections/AboutSection";
import prisma from "@/lib/db";

export const revalidate = 60; // Revalidate every 60 seconds

async function getData() {
  const [projects, stats, experiences, skills, socialLinks, settings, hero, journey, resume] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      include: { technologies: true },
    }),
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    prisma.settings.findFirst(),
    prisma.hero.findFirst(),
    prisma.journeyEvent.findMany({ orderBy: { order: "asc" } }),
    prisma.resume.findFirst({ orderBy: { createdAt: "desc" } }),
  ]);

  return { projects, stats, experiences, skills, socialLinks, settings, hero, journey, resume };
}

export default async function HomePage() {
  const { projects, stats, experiences, skills, socialLinks, settings, hero, journey, resume } =
    await getData();

  return (
    <main className="relative">
      <Navbar />

      {/* Hero */}
      <HeroSection hero={hero} resume={resume} />

      {/* Stats */}
      <StatsSection stats={stats} />

      {/* Projects */}
      <ProjectsSection projects={projects} />

      {/* About */}
      <AboutSection settings={settings} journey={journey} />

      {/* Experience */}
      <ExperienceSection experiences={experiences} />

      {/* Skills */}
      <SkillsSection skills={skills} />

      {/* Contact */}
      <ContactSection socialLinks={socialLinks} settings={settings} />

      {/* Footer */}
      <Footer socialLinks={socialLinks} />
    </main>
  );
}
