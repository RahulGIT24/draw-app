import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Draw App",
  description: "A Collaborating Drawing App",
};

// className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg.jpg')"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* <NavBar /> */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
