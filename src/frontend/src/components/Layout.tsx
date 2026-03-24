import { Bell, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import AppSidebar from "./AppSidebar";

export default function Layout({
  children,
  title,
}: { children: ReactNode; title?: string }) {
  const { profile } = useAuth();
  const initials =
    profile?.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <AppSidebar />
      <div className="ml-60 min-h-screen">
        <header className="sticky top-0 z-20 bg-[#0B1220]/80 backdrop-blur-sm border-b border-[#223047] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#151F2E] border border-[#223047] rounded-lg px-3 py-2 w-64">
            <Search className="w-4 h-4 text-[#94A3B8]" />
            <input
              placeholder="Search..."
              className="bg-transparent text-[#EAF0FF] text-sm placeholder:text-[#94A3B8] outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative w-9 h-9 rounded-lg bg-[#151F2E] border border-[#223047] flex items-center justify-center text-[#94A3B8] hover:text-[#EAF0FF] transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              {initials}
            </div>
          </div>
        </header>
        <main className="p-6">
          {title && (
            <h1 className="text-2xl font-bold text-[#EAF0FF] mb-6">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
