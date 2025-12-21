import type { Metadata } from "next";
import { Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Henry Denilson Huaraya Chipana | Full Stack Developer & Tech Innovator",
  description: "Portafolio profesional de Henry Denilson Huaraya Chipana. Desarrollador Full Stack especializado en crear experiencias web excepcionales, aplicaciones modernas y soluciones tecnológicas innovadoras.",
  keywords: [
    "Henry Denilson Huaraya Chipana",
    "Huaraya Chipana",
    "Full Stack Developer",
    "Desarrollador Web",
    "React",
    "Next.js",
    "TypeScript",
    "Supabase",
    "Portafolio",
    "Programador Perú"
  ],
  authors: [{ name: "Henry Denilson" }],
  creator: "Henry Denilson",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://mi-portafolio.vercel.app", // URL genérica, pero útil
    title: "Henry Denilson | Full Stack Developer",
    description: "Transformando ideas en realidad digital. Explora mis proyectos y experiencia técnica.",
    siteName: "Henry Denilson Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Henry Denilson | Full Stack Developer",
    description: "Transformando ideas en realidad digital. Explora mis proyectos.",
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
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${orbitron.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen">
            {children}
          </div>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
