"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) setError(error.message);
      else setMessage("Account created! Please check your email to confirm, then log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #F8F7F4 0%, #F0EFEC 50%, #E8E7E2 100%)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "#0D0D0D" }}>
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 20% 80%, rgba(232,169,64,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(107,143,113,0.12) 0%, transparent 50%)"
        }} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg" style={{ background: "linear-gradient(135deg, #E8A940, #F5D08A)" }} />
              <span className="font-mono text-sm font-medium tracking-widest text-white/60 uppercase">NATA-REVA</span>
            </div>
          </div>
          <div>
            <p className="text-white/40 text-sm font-body mb-4 uppercase tracking-widest">Architecture Entrance</p>
            <h1 className="font-display text-5xl text-white leading-tight mb-6">
              Design your<br />
              <em className="not-italic" style={{ color: "#E8A940" }}>future</em><br />
              here.
            </h1>
            <p className="text-white/50 font-body text-lg leading-relaxed max-w-sm">
              AI-powered NATA preparation. Practice tests, smart analytics, and personalized tutoring.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Questions", value: "500+" },
              { label: "Topics", value: "12" },
              { label: "Students", value: "2K+" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="font-display text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-white/40 text-xs font-body uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-6 h-6 rounded-md" style={{ background: "linear-gradient(135deg, #E8A940, #F5D08A)" }} />
            <span className="font-mono text-xs font-medium tracking-widest text-ink-600 uppercase">NATA-REVA</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold text-ink-900 mb-2">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-ink-400 font-body">
              {mode === "login" ? "Sign in to continue your preparation" : "Start your NATA journey today"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex p-1 rounded-xl mb-8" style={{ background: "#F0EFEC" }}>
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setMessage(""); }}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 capitalize"
                style={mode === m ? { background: "white", color: "#0D0D0D", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" } : { color: "#8A8A8A" }}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Arjun Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder={mode === "signup" ? "Min 6 characters" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(224,112,96,0.08)", color: "#C4503A", border: "1px solid rgba(224,112,96,0.2)" }}>
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(107,143,113,0.08)", color: "#4A6B50", border: "1px solid rgba(107,143,113,0.2)" }}>
                {message}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing…
                </span>
              ) : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-ink-400 mt-8 font-body">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
