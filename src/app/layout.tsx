import type { Metadata } from "next";
import { Space_Grotesk, Manrope, Inter, Rubik_Glitch, Silkscreen, Wallpoet, Turret_Road } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/app/providers";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { DataStreamBackground } from "@/components/ui/DataStreamBackground";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const rubikGlitch = Rubik_Glitch({
  weight: "400",
  variable: "--font-rubik-glitch",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  variable: "--font-silkscreen",
  subsets: ["latin"],
});

const wallpoet = Wallpoet({
  weight: "400",
  variable: "--font-wallpoet",
  subsets: ["latin"],
});

const turretRoad = Turret_Road({
  weight: ["400", "500", "700"],
  variable: "--font-turret-road",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOCS — Society of Cyber Security",
  description: "Society of Cyber Security Network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${inter.variable} ${rubikGlitch.variable} ${silkscreen.variable} ${wallpoet.variable} ${turretRoad.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body bg-background text-white" suppressHydrationWarning>
        <CustomCursor />
        <ClientProviders>
          <DataStreamBackground />
          <Navbar />
          <main className="flex-grow flex flex-col items-center">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}

