"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

type Result = { score: number; total: number; created_at: string; weak_topics: string[] };

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser({ email: user.email!, name: user.user_metadata?.full_name || user.email!.split("@")[0] });

      const { data } = await supabase
        .from("results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setResults(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const avgScore = results.length
    ? Math.round(results.reduce((s, r) => s + (r.score / r.total) * 100, 0) / results.length)
    : 0;

  const allWeakTopics = results.flatMap((r) => r.weak_topics || []);
  const topicCounts = allWeakTopics.reduce<Record<string, number>>((acc, t) => {
    acc[t] = (acc[t] || 0) + 1; return acc;
  }, {});
  const weakTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);

  const cards = [
    {
      href: "/test",
      title: "Start Practice Test",
      desc: "15 curated NATA questions across all sections",
      icon: "📐",
      accent: "#E8A940",
      bg: "rgba(232,169,64,0.06)",
    },
    {
      href: "/ai-tutor",
      title: "AI Tutor",
      desc: "Get personalised analysis & improvement tips",
      icon: "✦",
      accent: "#6B8F71",
      bg: "rgba(107,143,113,0.06)",
    },
    {
      href: "/test",
      title: "Sample Questions",
      desc: "Browse topic-wise practice questions",
      icon: "📚",
      accent: "#8A7FCC",
      bg: "rgba(138,127,204,0.06)",
    },
    {
      href: "https://cetonline.karnataka.gov.in/kea/",
      title: "KEA Official Portal",
      desc: "Karnataka Examinations Authority website",
      icon: "🔗",
      accent: "#E07060",
      bg: "rgba(224,112,96,0.06)",
      external: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar userName={user?.name || "Student"} />

      <main className="flex-1 overflow-auto p-8">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="text-ink-400 text-sm font-body mb-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <h1 className="font-display text-4xl font-semibold text-ink-900">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
            <span style={{ color: "#E8A940" }}>{user?.name.split(" ")[0]}</span>
          </h1>
          <p className="text-ink-400 mt-1">Here's your preparation overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Tests Taken", value: results.length, suffix: "", color: "#0D0D0D" },
            { label: "Average Score", value: results.length ? avgScore : "—", suffix: results.length ? "%" : "", color: avgScore >= 70 ? "#6B8F71" : avgScore >= 50 ? "#E8A940" : "#E07060" },
            { label: "Best Score", value: results.length ? Math.max(...results.map((r) => Math.round((r.score / r.total) * 100))) : "—", suffix: results.length ? "%" : "", color: "#6B8F71" },
          ].map((stat, i) => (
            <div key={stat.label} className={`card p-6 animate-fade-up stagger-${i + 1}`} style={{ opacity: 0 }}>
              <p className="text-ink-400 text-xs font-body uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="font-display text-4xl font-bold" style={{ color: stat.color }}>
                {stat.value}<span className="text-2xl">{stat.suffix}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Weak topics */}
        {weakTopics.length > 0 && (
          <div className="card p-5 mb-8 animate-fade-up stagger-3" style={{ opacity: 0 }}>
            <p className="text-xs font-body uppercase tracking-wider text-ink-400 mb-3">Focus Areas</p>
            <div className="flex flex-wrap gap-2">
              {weakTopics.map((t) => (
                <span key={t} className="tag" style={{ background: "rgba(224,112,96,0.08)", color: "#C4503A", border: "1px solid rgba(224,112,96,0.2)" }}>
                  ⚠ {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="mb-8">
          <h2 className="section-title mb-4 animate-fade-up stagger-2" style={{ opacity: 0 }}>Quick Access</h2>
          <div className="grid grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <Link
                key={card.href}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className={`card p-6 group animate-fade-up stagger-${i + 2}`}
                style={{ opacity: 0 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: card.bg }}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-ink-900 mb-1 group-hover:text-ink-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-ink-400 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium transition-all duration-200 group-hover:gap-2" style={{ color: card.accent, gap: "6px" }}>
                  {card.external ? "Visit site" : "Get started"} →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="animate-fade-up stagger-5" style={{ opacity: 0 }}>
            <h2 className="section-title mb-4">Recent Tests</h2>
            <div className="card overflow-hidden p-0">
              <div className="divide-y divide-ink-100">
                {results.slice(0, 5).map((r, i) => {
                  const pct = Math.round((r.score / r.total) * 100);
                  return (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-ink-50 transition-colors">
                      <div>
                        <div className="font-body font-medium text-ink-900 text-sm">
                          {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <div className="text-ink-400 text-xs mt-0.5">{r.score}/{r.total} questions correct</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 70 ? "#6B8F71" : pct >= 50 ? "#E8A940" : "#E07060" }} />
                          </div>
                        </div>
                        <span className="font-mono text-sm font-medium w-10 text-right" style={{ color: pct >= 70 ? "#4A6B50" : pct >= 50 ? "#C4882A" : "#C4503A" }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
