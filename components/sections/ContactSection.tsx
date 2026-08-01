"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Send, Calendar, CheckCircle, Phone } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin, FaXTwitter as Twitter } from "react-icons/fa6";
import { toast } from "sonner";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Twitter: Twitter,
};

interface SocialLink {
  platform: string;
  url: string;
  username?: string | null;
}

interface Settings {
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  calendarUrl?: string | null;
}

interface ContactSectionProps {
  socialLinks: SocialLink[];
  settings: Settings | null;
}

export function ContactSection({ socialLinks, settings }: ContactSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormState({ name: "", email: "", message: "" });
        toast.success("Message sent! I'll get back to you soon.");
      } else {
        toast.error("Failed to send. Try emailing directly.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="section-padding bg-[#0a0a0c]">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sky-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Let&apos;s Build Together
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Open to full-time roles, internships, and interesting collaborations. Let&apos;s connect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-6"
          >
            {/* Info cards */}
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-4 glass-card rounded-2xl p-5 hover:border-sky-400/20 hover:bg-sky-400/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/30 font-medium mb-0.5">Email</p>
                  <p className="text-sm text-white/80 font-semibold">{settings.email}</p>
                </div>
              </a>
            )}

            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-4 glass-card rounded-2xl p-5 hover:border-sky-400/20 hover:bg-sky-400/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/30 font-medium mb-0.5">Phone</p>
                  <p className="text-sm text-white/80 font-semibold">{settings.phone}</p>
                </div>
              </a>
            )}

            {settings?.location && (
              <div className="flex items-center gap-4 glass-card rounded-2xl p-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/30 font-medium mb-0.5">Location</p>
                  <p className="text-sm text-white/80 font-semibold">{settings.location}</p>
                </div>
              </div>
            )}

            {settings?.calendarUrl && (
              <a
                href={settings.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass-card rounded-2xl p-5 hover:border-indigo-400/20 hover:bg-indigo-400/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/30 font-medium mb-0.5">Schedule a Call</p>
                  <p className="text-sm text-white/80 font-semibold">Book a 30-min chat</p>
                </div>
              </a>
            )}

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.platform] || Github;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/5 hover:border-sky-400/20 hover:text-sky-400 text-white/50 text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    <Icon size={16} />
                    {link.platform}
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {submitted ? (
              <div className="glass-card rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                <p className="text-white/50 text-sm">I&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sky-400 text-sm underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card rounded-2xl p-6 space-y-4"
              >
                <div>
                  <label className="block text-xs text-white/40 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 placeholder:text-white/20 transition-all duration-300"
                    placeholder="Manish Mishra"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, email: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 placeholder:text-white/20 transition-all duration-300"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, message: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl glass border border-white/5 focus:border-sky-400/30 outline-none text-sm text-white/80 placeholder:text-white/20 transition-all duration-300 resize-none"
                    placeholder="I'd love to connect about..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
