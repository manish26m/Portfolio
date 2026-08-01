import Link from "next/link";
import { Terminal, Heart } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin, FaXTwitter as Twitter } from "react-icons/fa6";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
};

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterProps {
  socialLinks: SocialLink[];
}

export function Footer({ socialLinks }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-12 border-t border-white/5">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <Terminal size={14} className="text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight">
              Manish<span className="text-sky-400">.</span>
            </span>
          </Link>

          {/* Center */}
          <p className="text-xs text-white/25 flex items-center gap-1.5">
            Built with{" "}
            <Heart size={11} className="text-sky-400 fill-sky-400" />{" "}
            by Manish Mishra · {year}
          </p>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = SOCIAL_ICONS[link.platform] || Github;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl glass border border-white/5 hover:border-sky-400/20 flex items-center justify-center text-white/30 hover:text-sky-400 transition-all duration-300"
                  aria-label={link.platform}
                >
                  <Icon size={15} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
