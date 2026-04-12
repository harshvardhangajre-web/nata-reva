"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

type Message = { role: "user" | "ai"; text: string };
type Result = { id: string; score: number; total: number; created_at: string; weak_topics: string[] };

export default function AITutorPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser({ id: user.id, name: user.user_metadata?.full_name || user.email!.split("@")[0] });
      const { data } = await supabase
        .from("results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setResults(data || []);
      if (data && data.length > 0) {
        setSelectedResult(data[0]);
        setMessages([{
          role: "ai",
          text: `Hi! I'm your NATA AI Tutor. I can see your latest test — you scored **${data[0].score}/${data[0].total}** (${Math.round((data[0].score / data[0].total) * 100)}%).${data[0].weak_topics?.length ? ` Your weak areas are: **${data[0].weak_topics.join(", ")}**.` : ""} Ask me anything — about your performance, NATA topics, drawing techniques, or how to improve!`,
        }]);
      } else {
        setMessages([{
          role: "ai",
          text: "Hi! I'm your NATA AI Tutor. You haven't taken a test yet, but you can still ask me anything about NATA — Mathematics, Drawing, Aesthetic Sensitivity, Architecture, or exam strategy!",
        }]);
      }
      setFetching(false);
    }
    load();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const context = selectedResult
        ? `Student context: Score ${selectedResult.score}/${selectedResult.total} (${Math.round((selectedResult.score / selectedResult.total) * 100)}%). Weak topics: ${selectedResult.weak_topics?.join(", ") || "none"}.`
        : "Student hasn't taken a test yet.";

      const conversationHistory = messages.map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.text}`).join("\n");

      const prompt = `You are an expert NATA (National Aptitude Test in Architecture) tutor for Indian students. You are helpful, encouraging, and knowledgeable about all NATA subjects: Mathematics, Drawing, Aesthetic Sensitivity, and Architecture awareness.

${context}

Conversation so far:
${conversationHistory}

Student: ${userMsg}

Respond as a warm, knowledgeable tutor. Be specific, practical, and concise (2-4 sentences unless a detailed explanation is needed). If the student asks about weak topics, give targeted advice. Never use generic filler.`;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: selectedResult?.score ?? 0,
          total: selectedResult?.total ?? 15,
          answers: [],
          weakTopics: selectedResult?.weak_topics ?? [],
          chatMode: true,
          prompt,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't process that. Try asking again!";
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  const quickPrompts = [
    "What are my weak areas?",
    "How do I improve in Drawing?",
    "Explain the Golden Ratio",
    "Give me a study plan",
    "NATA exam tips",
  ];

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar userName={user?.name || "Student"} />
      <main className="flex-1 flex flex-col" style={{ height: "100vh" }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #F0EFEC", background: "rgba(248,247,244,0.9)", backdropFilter: "blur(12px)" }}>
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-900">AI Tutor</h1>
            <p className="text-ink-400 text-xs font-body">Powered by Gemini · Ask anything about NATA</p>
          </div>
          {selectedResult && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-400 font-body">Context:</span>
              <span className="tag text-xs" style={{ background: "rgba(232,169,64,0.1)", color: "#C4882A", border: "1px solid rgba(232,169,64,0.25)" }}>
                {Math.round((selectedResult.score / selectedResult.total) * 100)}% — Latest Test
              </span>
              {selectedResult.weak_topics?.slice(0, 2).map((t) => (
                <span key={t} className="tag text-xs" style={{ background: "rgba(224,112,96,0.08)", color: "#C4503A", border: "1px solid rgba(224,112,96,0.2)" }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}>
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg, #E8A940, #F5D08A)", color: "#0D0D0D" }}>
                  ✦
                </div>
              )}
              <div
                className="max-w-xl px-4 py-3 rounded-2xl text-sm font-body leading-relaxed"
                style={msg.role === "user"
                  ? { background: "#0D0D0D", color: "white", borderBottomRightRadius: "4px" }
                  : { background: "white", color: "#2D2D2D", border: "1px solid #F0EFEC", borderBottomLeftRadius: "4px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }
                }
              >
                {msg.text.split("\n").map((line, j) => {
                  const formatted = line
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>");
                  return <p key={j} className={j > 0 ? "mt-2" : ""} dangerouslySetInnerHTML={{ __html: formatted }} />;
                })}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs ml-2 flex-shrink-0 mt-0.5 font-mono" style={{ background: "#2D2D2D", color: "white" }}>
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0" style={{ background: "linear-gradient(135deg, #E8A940, #F5D08A)", color: "#0D0D0D" }}>✦</div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-ink-100" style={{ borderBottomLeftRadius: "4px" }}>
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-ink-300" style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-6 pb-3 flex gap-2 flex-wrap">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => { setInput(p); }}
                className="text-xs px-3 py-1.5 rounded-full font-body transition-all duration-150"
                style={{ background: "#F0EFEC", color: "#4A4A4A", border: "1px solid #E0DFDB" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0D0D0D"; e.currentTarget.style.color = "#0D0D0D"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E0DFDB"; e.currentTarget.style.color = "#4A4A4A"; }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4" style={{ borderTop: "1px solid #F0EFEC", background: "rgba(248,247,244,0.9)" }}>
          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your results, NATA topics, drawing tips…"
              rows={1}
              className="flex-1 resize-none input-field py-3 text-sm"
              style={{ minHeight: "44px", maxHeight: "120px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 disabled:opacity-30"
              style={{ background: "#0D0D0D", color: "white" }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-ink-300 mt-2 font-body">Enter to send · Shift+Enter for new line</p>
        </div>
      </main>

      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}