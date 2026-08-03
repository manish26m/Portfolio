import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import prisma from "@/lib/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Fallback defaults used when admin settings fields are empty
const DEFAULTS = {
  title: "Manish Mishra — AI Engineer & Data Engineer",
  description:
    "Portfolio of Manish Mishra — AI Engineer, Data Engineer, and Full-Stack Developer specializing in production-grade intelligent systems, LLM pipelines, and enterprise data platforms.",
  keywords: [
    "AI Engineer",
    "Data Engineer",
    "Machine Learning",
    "Python",
    "LangChain",
    "FastAPI",
    "DevOps",
    "LLM",
    "Manish Mishra",
  ],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://manishmishra.dev",
};

export async function generateMetadata(): Promise<Metadata> {
  // Fetch live settings from DB (safe — layout is a Server Component)
  const settings = await prisma.settings.findFirst().catch(() => null);

  const title = settings?.siteTitle || DEFAULTS.title;
  const description = settings?.siteDescription || DEFAULTS.description;
  const keywords = settings?.metaKeywords
    ? settings.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : DEFAULTS.keywords;
  const ogImage = settings?.ogImage || undefined;

  return {
    title: {
      default: title,
      template: `%s | Manish Mishra`,
    },
    description,
    keywords,
    authors: [{ name: "Manish Mishra" }],
    creator: "Manish Mishra",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: DEFAULTS.siteUrl,
      title,
      description,
      siteName: "Manish Mishra",
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@manish26m",
      ...(ogImage && { images: [ogImage] }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#080808] text-white`}>
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(15, 15, 20, 0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
