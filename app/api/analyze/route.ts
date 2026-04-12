import { NextRequest, NextResponse } from "next/server";

async function callGroq(prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
      temperature: 0.8,
    }),
  });

  const data = await res.json();
  console.log("GROQ RESPONSE:", JSON.stringify(data, null, 2));

  if (!res.ok || data.error) throw new Error(data.error?.message || "Groq failed");
  return data.choices?.[0]?.message?.content || "";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { score, total, weakTopics, chatMode, prompt: customPrompt } = body;

    const prompt = chatMode && customPrompt
      ? customPrompt
      : `You are an expert NATA tutor. Analyze this student's performance.
Score: ${score}/${total} (${Math.round((score / total) * 100)}%)
Weak areas: ${weakTopics?.join(", ") || "none"}

Give:
1. Strengths (2 points)
2. Weaknesses (2 points)
3. 3 improvement tips

Be specific, practical, and encouraging. Keep it concise.`;

    let text = "";

    try {
      text = await callGroq(prompt);
      console.log("Used: Groq ✓");
    } catch (e) {
      console.log("Groq failed:", e);
    }

    if (chatMode) {
      return NextResponse.json({ reply: text || fallbackChat(customPrompt || "") });
    }

    if (text) {
      return NextResponse.json(parseAnalysis(text));
    }

    return NextResponse.json(mockAnalysis(score, total, weakTopics || []));
  } catch (error) {
    console.log("Route error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

function fallbackChat(prompt: string): string {
  const p = prompt?.toLowerCase() || "";
  if (p.includes("draw")) return "For Drawing, practice daily sketching — focus on proportions, shading with hatching, and 1-point perspective. Study real objects and architectural forms.";
  if (p.includes("math")) return "For Mathematics, focus on Mensuration, Coordinate Geometry, and Algebra. Practice formula recall under time pressure — solve 10 problems daily.";
  if (p.includes("colour") || p.includes("color") || p.includes("aesthetic")) return "Aesthetic Sensitivity tests your eye for design. Study colour theory, Gestalt principles, and iconic buildings.";
  if (p.includes("plan") || p.includes("schedule")) return "A good NATA study plan: 1 hour Maths daily, 30 min drawing practice, 20 min aesthetic/architecture reading. Take 1 full mock test per week.";
  if (p.includes("tip") || p.includes("strategy")) return "Top NATA tips: attempt all questions (no negative marking), manage time strictly, eliminate wrong options first, and practice sketching speed.";
  return "Focus on your weak topics first — consistent daily practice beats cramming. Review the NCA official syllabus and attempt previous years' NATA papers.";
}

function parseAnalysis(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const tips: string[] = [];
  let section: "strengths" | "weaknesses" | "tips" | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("strength")) { section = "strengths"; continue; }
    if (lower.includes("weakness") || lower.includes("improve") || lower.includes("area")) { section = "weaknesses"; continue; }
    if (lower.includes("tip") || lower.includes("suggest") || lower.includes("recommend")) { section = "tips"; continue; }
    const cleaned = line.replace(/^[\d\.\-\*•]+\s*/, "").trim();
    if (!cleaned || cleaned.length < 8) continue;
    if (section === "strengths") strengths.push(cleaned);
    else if (section === "weaknesses") weaknesses.push(cleaned);
    else if (section === "tips") tips.push(cleaned);
  }

  return {
    strengths: strengths.length ? strengths : ["You completed the test — consistency matters."],
    weaknesses: weaknesses.length ? weaknesses : ["Review incorrect answers carefully."],
    tips: tips.length ? tips.slice(0, 3) : ["Practice daily.", "Focus on weak topics.", "Time yourself."],
  };
}

function mockAnalysis(score: number, total: number, weakTopics: string[]) {
  const pct = Math.round((score / total) * 100);
  return {
    strengths: [
      pct >= 70 ? "Strong conceptual understanding across topics." : "Good attempt and full test completion.",
      "Consistent engagement with diverse question types.",
    ],
    weaknesses: [
      weakTopics.length > 0 ? `Key gaps in: ${weakTopics.join(", ")}.` : "Some inconsistencies under time pressure.",
      pct < 60 ? "Need more MCQ strategy practice." : "Minor errors in calculation-heavy questions.",
    ],
    tips: [
      `Spend 30 min daily on ${weakTopics[0] || "your weakest topic"}.`,
      "Take one timed mock test every alternate day.",
      "Review NCA official syllabus and past NATA papers.",
    ],
  };
}