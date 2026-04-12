"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { questions } from "@/lib/questions";

type Phase = "intro" | "test" | "result";

export default function TestPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 mins
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUser({ id: user.id, name: user.user_metadata?.full_name || user.email!.split("@")[0] });
    });
  }, []);

  useEffect(() => {
    if (phase !== "test") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); submitTest(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const weakTopics = [...new Set(
    questions
      .filter((q, i) => answers[i] !== q.answer)
      .map((q) => q.topic)
  )];

  async function submitTest() {
    if (!user || saving) return;
    setSaving(true);
    await supabase.from("results").insert({
      user_id: user.id,
      score,
      total: questions.length,
      answers: answers,
      weak_topics: weakTopics,
    });
    setSaving(false);
    setPhase("result");
  }

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const pct = Math.round((score / questions.length) * 100);
  const timerColor = timeLeft < 120 ? "#E07060" : timeLeft < 300 ? "#E8A940" : "#6B8F71";

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-ink-200 border-t-ink-900 rounded-full animate-spin" /></div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar userName={user.name} />

      <main className="flex-1 overflow-auto p-8">
        {/* INTRO */}
        {phase === "intro" && (
          <div className="max-w-lg mx-auto mt-16 animate-fade-up">
            <div className="card p-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6" style={{ background: "rgba(232,169,64,0.08)" }}>
                📐
              </div>
              <h1 className="font-display text-3xl font-semibold text-ink-900 mb-3">NATA Practice Test</h1>
              <p className="text-ink-500 font-body leading-relaxed mb-6">
                This test has <strong className="text-ink-900">{questions.length} questions</strong> covering Mathematics, Drawing, Aesthetic Sensitivity, and Architecture. You have <strong className="text-ink-900">20 minutes</strong>.
              </p>
              <div className="space-y-2 mb-8">
                {["Mathematics — Algebra, Geometry, Mensuration", "Drawing — Techniques, Perspective, Media", "Aesthetic Sensitivity — Colour, Design, History", "Architecture — Landmarks, Concepts"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-ink-500">
                    <span className="w-1 h-1 rounded-full bg-amber flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
              <button onClick={() => setPhase("test")} className="btn-amber w-full">
                Begin Test →
              </button>
            </div>
          </div>
        )}

        {/* TEST */}
        {phase === "test" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Header bar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-ink-400 font-body uppercase tracking-wider mb-0.5">Question {current + 1} of {questions.length}</p>
                <span className="tag text-xs" style={{ background: "rgba(107,143,113,0.08)", color: "#4A6B50", border: "1px solid rgba(107,143,113,0.2)" }}>
                  {questions[current].topic}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-medium" style={{ background: `${timerColor}12`, color: timerColor, border: `1px solid ${timerColor}30` }}>
                ⏱ {formatTime(timeLeft)}
              </div>
            </div>

            {/* Progress */}
            <div className="progress-bar mb-6">
              <div className="progress-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>

            {/* Question dots */}
            <div className="flex gap-1.5 mb-6 flex-wrap">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-7 h-7 rounded-lg text-xs font-mono transition-all duration-150"
                  style={
                    i === current
                      ? { background: "#0D0D0D", color: "white" }
                      : answers[i] !== null
                      ? { background: "rgba(107,143,113,0.15)", color: "#4A6B50", border: "1px solid rgba(107,143,113,0.3)" }
                      : { background: "#F0EFEC", color: "#8A8A8A" }
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Question Card */}
            <div className="card p-7 mb-4">
              <p className="font-body text-ink-900 text-lg leading-relaxed mb-6">{questions[current].question}</p>
              <div className="space-y-3">
                {questions[current].options.map((opt, oi) => {
                  const selected = answers[current] === oi;
                  return (
                    <button
                      key={oi}
                      onClick={() => setAnswers((prev) => { const a = [...prev]; a[current] = oi; return a; })}
                      className="w-full text-left px-4 py-3.5 rounded-xl font-body text-sm transition-all duration-150 flex items-center gap-3"
                      style={selected
                        ? { background: "#0D0D0D", color: "white", border: "1px solid #0D0D0D" }
                        : { background: "white", color: "#2D2D2D", border: "1px solid #E8E7E3" }
                      }
                    >
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-mono"
                        style={selected ? { background: "rgba(255,255,255,0.15)" } : { background: "#F0EFEC", color: "#8A8A8A" }}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nav */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="btn-ghost text-sm py-2.5 px-5 disabled:opacity-30"
              >
                ← Previous
              </button>
              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent((c) => c + 1)} className="btn-primary text-sm py-2.5 px-5">
                  Next →
                </button>
              ) : (
                <button onClick={submitTest} disabled={saving} className="btn-amber text-sm py-2.5 px-6">
                  {saving ? "Saving…" : "Submit Test ✓"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && (
          <div className="max-w-2xl mx-auto animate-fade-up">
            <div className="card p-8 mb-6 text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{
                background: pct >= 70 ? "rgba(107,143,113,0.1)" : pct >= 50 ? "rgba(232,169,64,0.1)" : "rgba(224,112,96,0.1)",
                border: `3px solid ${pct >= 70 ? "#6B8F71" : pct >= 50 ? "#E8A940" : "#E07060"}`,
              }}>
                <span className="font-display text-3xl font-bold" style={{ color: pct >= 70 ? "#4A6B50" : pct >= 50 ? "#C4882A" : "#C4503A" }}>
                  {pct}%
                </span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-ink-900 mb-1">
                {pct >= 70 ? "Excellent work!" : pct >= 50 ? "Good effort!" : "Keep practising!"}
              </h2>
              <p className="text-ink-400 font-body">
                You scored <strong className="text-ink-900">{score}</strong> out of <strong className="text-ink-900">{questions.length}</strong> questions correctly.
              </p>
            </div>

            {/* Answer review */}
            <h3 className="section-title mb-4">Answer Review</h3>
            <div className="space-y-3 mb-6">
              {questions.map((q, i) => {
                const correct = answers[i] === q.answer;
                return (
                  <div key={i} className="card p-4" style={{ border: `1px solid ${correct ? "rgba(107,143,113,0.3)" : "rgba(224,112,96,0.3)"}` }}>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5" style={{ background: correct ? "rgba(107,143,113,0.12)" : "rgba(224,112,96,0.12)", color: correct ? "#4A6B50" : "#C4503A" }}>
                        {correct ? "✓" : "✗"}
                      </span>
                      <div className="flex-1">
                        <p className="font-body text-sm text-ink-900 mb-1">{q.question}</p>
                        {!correct && (
                          <p className="text-xs text-ink-400">
                            Your answer: <span className="text-coral">{answers[i] !== null ? q.options[answers[i]] : "Not answered"}</span>
                            {" · "}Correct: <span style={{ color: "#4A6B50" }}>{q.options[q.answer]}</span>
                          </p>
                        )}
                        <p className="text-xs text-ink-400 mt-1 italic">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => {
                setAnswers(Array(questions.length).fill(null));
                setCurrent(0);
                setTimeLeft(20 * 60);
                setPhase("intro");
              }} className="btn-ghost flex-1">
                Retake Test
              </button>
              <button onClick={() => router.push("/ai-tutor")} className="btn-amber flex-1">
                Analyse with AI →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
