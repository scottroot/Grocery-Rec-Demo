import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";
import Footer from "@/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-monty",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Grocery Basket Demo",
  description: "Interactive demo showcasing various shopping cart recommendations.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}>
      <body className="flex flex-col min-h-screen pt-16">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        <main className="flex flex-1 flex-col items-center">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
