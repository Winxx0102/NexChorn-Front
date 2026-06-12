import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexChron",
  description: "Plataforma de gestión de crónicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col relative text-white selection:bg-indigo-500/30">
        
        {/* Fondo Global */}
        <div className="fixed inset-0 -z-10 bg-gray-950 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/30 blur-[120px]" />
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-900/20 blur-[120px]" />
        </div>

        <AuthProvider>
          {/* La Navbar se encargará ella misma de ocultarse en el login */}
          <Navbar /> 
          
          <main className="flex-grow relative z-10">
            {children}
          </main>

          <Footer />
          <Toaster theme="dark" position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}