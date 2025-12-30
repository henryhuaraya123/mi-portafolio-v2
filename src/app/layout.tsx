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
  description: "Sitio web oficial de Henry Denilson Huaraya Chipana. Desarrollador Full Stack especializado en React, Next.js y soluciones tecnológicas innovadoras en Perú.",
  keywords: [
    "Henry Denilson Huaraya Chipana",
    "Henry Huaraya",
    "Huaraya Chipana",
    "Henry Denilson",
    "Full Stack Developer Perú",
    "Desarrollador Web Henry Huaraya",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Supabase",
    "Portafolio Henry Denilson"
  ],
  authors: [{ name: "Henry Denilson Huaraya Chipana" }],
  creator: "Henry Denilson Huaraya Chipana",
  alternates: {
    canonical: "https://mi-portafolio-v2-henna.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://mi-portafolio-v2-henna.vercel.app",
    title: "Henry Denilson Huaraya Chipana | Full Stack Developer",
    description: "Portafolio profesional de Henry Denilson Huaraya Chipana. Desarrollador Full Stack transformando ideas en realidad digital.",
    siteName: "Henry Denilson Huaraya Chipana",
    images: [
      {
        url: "/og-image.png", // Asegúrate de tener esta imagen en public o usa una genérica
        width: 1200,
        height: 630,
        alt: "Henry Denilson Huaraya Chipana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Henry Denilson Huaraya Chipana | Full Stack Developer",
    description: "Desarrollador Full Stack especializado en crear experiencias web excepcionales.",
    images: ["/og-image.png"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Henry Denilson Huaraya Chipana",
  "alternateName": "Henry Huaraya",
  "url": "https://mi-portafolio-v2-henna.vercel.app",
  "jobTitle": "Full Stack Developer",
  "description": "Desarrollador Full Stack especializado en React, Next.js y soluciones tecnológicas innovadoras.",
  "sameAs": [
    "https://github.com/henryhuaraya123", // Cambiar por tus redes reales si son diferentes
    "https://linkedin.com/in/henry-huaraya-chipana"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
