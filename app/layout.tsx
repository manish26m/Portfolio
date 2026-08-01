import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Manish Mishra — AI Engineer & Data Engineer",
    template: "%s | Manish Mishra",
  },
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
  authors: [{ name: "Manish Mishra" }],
  creator: "Manish Mishra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://manishmishra.dev",
    title: "Manish Mishra — AI Engineer & Data Engineer",
    description:
      "Building production-grade intelligent systems, LLM pipelines, and enterprise data platforms.",
    siteName: "Manish Mishra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manish Mishra — AI Engineer & Data Engineer",
    description: "Building intelligent systems that matter.",
    creator: "@manish26m",
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
};

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
