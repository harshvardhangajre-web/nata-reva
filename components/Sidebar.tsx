"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/test",
    label: "Practice Test",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/ai-tutor",
    label: "AI Tutor",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-60 min-h-screen flex flex-col" style={{ background: "#0D0D0D", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Logo */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: "linear-gradient(135deg, #E8A940, #F5D08A)" }} />
          <div>
            <div className="font-mono text-xs font-medium tracking-widest text-white uppercase">NATA-REVA</div>
            <div className="text-white/30 text-xs font-body">Architecture Prep</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={active
                ? { background: "rgba(232,169,64,0.12)", color: "#E8A940" }
                : { color: "rgba(255,255,255,0.45)", background: "transparent" }
              }
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
            >
              <span className={active ? "text-amber" : ""}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* KEA link */}
        <a
          href="https://cetonline.karnataka.gov.in/kea/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          style={{ color: "rgba(255,255,255,0.45)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          KEA Official
          <span className="ml-auto text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>↗</span>
        </a>
      </nav>

      {/* User */}
      <div className="p-4 m-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium font-mono" style={{ background: "rgba(232,169,64,0.2)", color: "#E8A940" }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{userName}</div>
            <div className="text-white/30 text-xs">Student</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-xs py-1.5 rounded-lg transition-all duration-150 text-left px-2"
          style={{ color: "rgba(255,255,255,0.3)", background: "transparent" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#E07060"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
