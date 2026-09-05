import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch {
      aiClient = null;
    }
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "RoadmapIQ",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Fallback intelligent rule-based engine (100% free, 0 cost, runs offline)
function generateRuleBasedAdvice(
  careerGoal: string,
  studentYear: string,
  completedSkillIds: string[] = [],
  skills: any[] = []
) {
  const total = skills.length;
  const completedCount = completedSkillIds.length;
  const pendingSkills = skills.filter((s) => !completedSkillIds.includes(s.id));
  const nextSkill = pendingSkills[0] || skills[0] || null;

  let yearSpecificAdvice = "";
  if (studentYear?.includes("1st") || studentYear?.includes("2nd")) {
    yearSpecificAdvice =
      "As an early-year student, focus deeply on core problem-solving, programming language fundamentals, and clean code before jumping into multiple frameworks.";
  } else if (studentYear?.includes("3rd")) {
    yearSpecificAdvice =
      "In your 3rd year, you need to balance Data Structures & Algorithms with 2 full-fledged portfolio projects to be ready for pre-placement internship drives.";
  } else {
    yearSpecificAdvice =
      "In your final year, prioritize high-frequency interview topics, mock interviews, placement-specific coding questions, and system design basics.";
  }

  const roleAdviceMap: Record<string, string> = {
    sde: "Top tech companies prioritize algorithmic efficiency (Time & Space complexity), strong object-oriented principles, and scalable system design basics.",
    "web-dev":
      "Focus on shipping end-to-end full-stack applications with authentication, responsive layouts, API integration, and clean deployment on platforms like Vercel.",
    "data-analyst":
      "Companies look for strong SQL querying ability, data cleaning with Pandas/Python, and actionable business storytelling via BI dashboards.",
    devops:
      "Master containerization (Docker), Linux shell scripting, and automated CI/CD pipelines before moving to cloud clusters.",
    "ai-ml":
      "Strengthen mathematical foundations (Linear Algebra, Calculus) and hands-on Scikit-Learn/PyTorch workflows over pre-trained API wrapper apps.",
  };

  const roleTip =
    roleAdviceMap[careerGoal] ||
    "Master the core fundamentals sequentially. True engineering craftsmanship beats rushing through shallow tutorials.";

  const suggestedStudyOrder = skills.map((s, idx) => {
    const isDone = completedSkillIds.includes(s.id);
    const priority = isDone ? 1 : 10 - Math.min(idx, 9);
    return {
      skillId: s.id,
      skillName: s.name,
      reason: isDone
        ? "Completed — Keep refreshing through periodic practice."
        : `Sequential stage ${idx + 1}: Essential prerequisite for upcoming placement assessments.`,
      priorityScore: priority,
    };
  });

  return {
    source: "rule-based-engine",
    recommendedNextSkillId: nextSkill ? nextSkill.id : (skills[0]?.id ?? ""),
    recommendedNextSkillName: nextSkill ? nextSkill.name : "Foundation Review",
    whyItMattersNow: nextSkill
      ? `${nextSkill.name} is your immediate next placement bottleneck. Mastering it unlocks the next milestone in your ${careerGoal.toUpperCase()} preparation roadmap.`
      : "You have completed all primary roadmap milestones! Focus on mock interviews and real-world system implementations.",
    placementTip: `${yearSpecificAdvice} ${roleTip}`,
    suggestedStudyOrder,
    readinessEvaluation: {
      completionRate: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      stage:
        completedCount === 0
          ? "Getting Started"
          : completedCount < total * 0.4
          ? "Foundation Stage"
          : completedCount < total * 0.8
          ? "Intermediate Competency"
          : "Placement Interview Ready",
      actionableStep: nextSkill
        ? `Dedicate 90 minutes today to ${nextSkill.name} using the curated free tutorials and documentation.`
        : "Build an end-to-end capstone project and review top 50 interview questions.",
    },
  };
}

// AI Advisor API route
app.post("/api/advisor", async (req, res) => {
  const { careerGoal, studentYear = "Final Year", completedSkillIds = [], skills = [], customQuestion } = req.body;

  const ai = getGenAI();

  if (!ai) {
    // Return high-quality rule-based advice instantly
    const result = generateRuleBasedAdvice(careerGoal, studentYear, completedSkillIds, skills);
    return res.json({
      success: true,
      data: result,
      note: "Generated using built-in intelligent CSE placement rules (Free & Open Source mode).",
    });
  }

  try {
    const prompt = `You are a Senior CSE Placement Mentor and Technical Interview Evaluator.
Analyze the following engineering student's progress and provide practical, concrete placement advice in structured JSON format.

Student Profile:
- Target Career Role: ${careerGoal}
- College Year: ${studentYear}
- Total Skills in Roadmap: ${skills.length}
- Completed Skills (${completedSkillIds.length}): ${skills
      .filter((s: any) => completedSkillIds.includes(s.id))
      .map((s: any) => s.name)
      .join(", ") || "None yet"}
- Pending Skills: ${skills
      .filter((s: any) => !completedSkillIds.includes(s.id))
      .map((s: any) => s.name)
      .join(", ")}
${customQuestion ? `- Student Question: "${customQuestion}"` : ""}

Return ONLY valid JSON with this exact schema:
{
  "source": "gemini-ai",
  "recommendedNextSkillId": "id of best next skill to focus on",
  "recommendedNextSkillName": "name of that skill",
  "whyItMattersNow": "2-3 crisp sentences explaining why this skill is critical for placement right now",
  "placementTip": "Actionable placement guidance tailored to their college year and role",
  "suggestedStudyOrder": [
    { "skillId": "skill_id", "skillName": "skill_name", "reason": "why in this order", "priorityScore": 9 }
  ],
  "readinessEvaluation": {
    "completionRate": 50,
    "stage": "Foundation Stage / Intermediate / Placement Ready",
    "actionableStep": "concrete step to take this week"
  }
}`;

    const fallback = generateRuleBasedAdvice(careerGoal, studentYear, completedSkillIds, skills);

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text?.trim() || "{}";
    const cleanedJson = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(cleanedJson);
    } catch {
      parsedData = {};
    }

    const safeData = {
      source: "gemini-ai",
      recommendedNextSkillId: parsedData.recommendedNextSkillId || fallback.recommendedNextSkillId,
      recommendedNextSkillName: parsedData.recommendedNextSkillName || fallback.recommendedNextSkillName,
      whyItMattersNow: parsedData.whyItMattersNow || fallback.whyItMattersNow,
      placementTip: parsedData.placementTip || fallback.placementTip,
      suggestedStudyOrder: Array.isArray(parsedData.suggestedStudyOrder) && parsedData.suggestedStudyOrder.length > 0
        ? parsedData.suggestedStudyOrder
        : fallback.suggestedStudyOrder,
      readinessEvaluation: {
        completionRate: typeof parsedData.readinessEvaluation?.completionRate === "number"
          ? parsedData.readinessEvaluation.completionRate
          : fallback.readinessEvaluation.completionRate,
        stage: parsedData.readinessEvaluation?.stage || fallback.readinessEvaluation.stage,
        actionableStep: parsedData.readinessEvaluation?.actionableStep || fallback.readinessEvaluation.actionableStep,
      },
    };

    return res.json({
      success: true,
      data: safeData,
      note: "Generated with Gemini Flash AI model.",
    });
  } catch {
    const fallback = generateRuleBasedAdvice(careerGoal, studentYear, completedSkillIds, skills);
    return res.json({
      success: true,
      data: fallback,
      note: "Seamless fallback to intelligent placement engine.",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RoadmapIQ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
