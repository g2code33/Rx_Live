import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Search, Bell, User, Home, Calendar, Trophy, Users, MoreHorizontal } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rx Live | Premium Live Scores",
  description: "Advanced Tournament Management & Live Score Platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rx Live",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/rx-live-logo.png",
    apple: "/rx-live-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-brand-bg text-white min-h-screen flex flex-col selection:bg-brand-green selection:text-black no-scrollbar`}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-[100] glass border-b border-brand-border h-16 flex items-center">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 relative">
                <img src="/rx-live-logo.png" alt="Rx Live" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-xl tracking-tighter italic uppercase hidden sm:block">Rx Live</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-brand-green/50 transition-all">
                <Search size={16} className="text-white/40" />
                <input type="text" placeholder="Search leagues, teams..." className="bg-transparent border-none outline-none text-sm ml-2 w-48 placeholder:text-white/20" />
              </div>
              <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full border-2 border-brand-bg"></span>
              </button>
              <Link href="/dashboard" className="w-8 h-8 rounded-full bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-all">
                <User size={18} />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-grow pb-32">
          {children}
        </main>

        {/* Bottom Navigation (Mobile & Tablet) */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-md glass rounded-[2rem] h-20 flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
          <Link href="/" className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-2xl group-hover:bg-brand-green/10 transition-all group-hover:-translate-y-1">
              <Home size={24} className="group-hover:text-brand-green transition-colors" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40 group-hover:opacity-100 group-hover:text-brand-green">Home</span>
          </Link>
          <Link href="/matches" className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-2xl group-hover:bg-brand-green/10 transition-all group-hover:-translate-y-1">
              <Calendar size={24} className="group-hover:text-brand-green transition-colors" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40 group-hover:opacity-100 group-hover:text-brand-green">Matches</span>
          </Link>
          <Link href="/standings" className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-2xl group-hover:bg-brand-green/10 transition-all group-hover:-translate-y-1">
              <Trophy size={24} className="group-hover:text-brand-green transition-colors" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40 group-hover:opacity-100 group-hover:text-brand-green">Tables</span>
          </Link>
          <Link href="/teams" className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-2xl group-hover:bg-brand-green/10 transition-all group-hover:-translate-y-1">
              <Users size={24} className="group-hover:text-brand-green transition-colors" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40 group-hover:opacity-100 group-hover:text-brand-green">Teams</span>
          </Link>
          <Link href="/draw" className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 rounded-2xl group-hover:bg-brand-green/10 transition-all group-hover:-translate-y-1">
              <MoreHorizontal size={24} className="group-hover:text-brand-green transition-colors" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40 group-hover:opacity-100 group-hover:text-brand-green">Draw</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
