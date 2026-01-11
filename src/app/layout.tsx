import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/components/audio-player";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amoria | Our Story",
  description: "A digital memory box of our shared journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${nunito.variable} antialiased bg-background text-foreground`}
      >
        <div className="paper-texture" />
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
