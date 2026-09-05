# RoadmapIQ — CSE Career Skill Roadmaps & Progress Tracker

> A structured, placement-ready learning roadmap and progress tracking web application for Computer Science Engineering students. Built using free and open-source technologies, demonstrable with zero paid API keys, and ready for deployment on Vercel.

---

## 1. Project Overview

**RoadmapIQ** helps engineering students know exactly what skills to learn and in what order for their chosen career goal (e.g., Software Development Engineer, Full-Stack Web Developer, Data Analyst, DevOps Engineer, AI/ML Specialist, Mobile App Developer), instead of guessing randomly from scattered YouTube tutorials and seniors' ad-hoc advice.

It tracks skill mastery stage-by-stage so students know their placement readiness percentage, provides curated free learning materials (docs, tutorials, courses, and practice problems), and includes an AI Placement Advisor that suggests what to learn next based on college year and current progress.

---

## 2. The 5 Core Features

1. **Feature 1: Select Career Goal**
   - Choose a target role (Software Development Engineer, Full-Stack Web Developer, Data Analyst, DevOps & Cloud Engineer, AI/ML Engineer, Mobile App Developer).
   - Dynamic profile tagging by college year (1st Year, 2nd Year, 3rd Year, Final Year).
   - Target company indicators, timeline estimates, and role-specific milestone counters.

2. **Feature 2: Display Skill Roadmap**
   - Chronologically ordered path of skills divided into logical stages.
   - Comprehensive descriptions, importance badges (*Core Essential*, *High Priority*, *Recommended*), estimated study weeks, and placement relevance insights.
   - "Why this skill matters" guidance for every single milestone.

3. **Feature 3: Mark Skills as Completed**
   - Interactive checkbox and toggle on every skill card.
   - Instant visual update with strike-through, completion badges, and real-time calculation.
   - State persisted across browser sessions via HTML5 LocalStorage.

4. **Feature 4: Track Progress**
   - High-contrast animated progress bar with exact completion percentages.
   - Milestone stage badges (*Getting Started*, *Foundation Stage*, *Intermediate Competency*, *Placement Ready*).
   - Remaining study weeks countdown and placement readiness metrics.

5. **Feature 5: Add & Curate Learning Resources**
   - Pre-curated with 100% free, trusted learning resources (MDN, freeCodeCamp, LeetCode, NeetCode, CS50, GitHub, official documentation).
   - Interactive modal form to attach custom learning links (Video, Docs, Course, Practice).
   - Personal study notes and practice problem scratchpad for each skill.

---

## 3. Technologies Used

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React (vector icons), Motion.
- **Backend & Middleware:** Node.js, Express, Vite middleware mode.
- **AI Integration:** `@google/genai` (Gemini 3.8 Flash) with a resilient, built-in intelligent rule-based CSE placement engine fallback that runs 100% offline and cost-free.
- **Storage:** HTML5 LocalStorage (0 database cost, 0 setup friction).
- **Deployment:** Vercel / Cloud Run compatible.

---

## 4. Free & Open-Source Verification (Cost Check)

This is an academic student project. The system strictly adheres to the zero-cost mandate:
- **No paid subscriptions**
- **No credit card required**
- **No paid APIs required** (works with or without Gemini API key; built-in placement rule engine provides instant smart guidance offline)
- **No paid databases** (uses browser LocalStorage)
- **No paid hosting** (Vercel Free Hobby Tier compatible)

---

## 5. AI Implementation

The AI layer is architected as an independent placement advisory service:

```
[Student Profile & Progress]
           ↓
[/api/advisor Backend Endpoint]
           ↓
[Gemini 3.8 Flash OR Intelligent Rule-Based Fallback]
           ↓
[Structured JSON Response]
           ↓
[UI: Next Focus Milestone + Why It Matters + Year-Specific Strategy]
```

- **Structured Output:**
  - `recommendedNextSkillId` & `recommendedNextSkillName`
  - `whyItMattersNow`
  - `placementTip` (contextualized for 1st/2nd/3rd/Final year CSE students)
  - `suggestedStudyOrder` with priority scores
  - `readinessEvaluation` (completion rate, stage, actionable weekly step)

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v18 or v20+)
- npm or pnpm

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/RoadmapIQ.git
cd RoadmapIQ

# 2. Install dependencies
npm install

# 3. (Optional) Set your free Gemini API key in .env
# If omitted, RoadmapIQ automatically uses its built-in rule-based placement engine with 0 cost!
cp .env.example .env

# 4. Start the development server
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 7. How to Push to GitHub

```bash
git init
git add .
git commit -m "feat: complete RoadmapIQ MVP with all 5 core features and AI advisor"
git branch -M main
git remote add origin https://github.com/your-username/RoadmapIQ.git
git push -u origin main
```

---

## 8. How to Deploy to Vercel

1. Push your code to your GitHub account.
2. Sign in to [vercel.com](https://vercel.com) using your GitHub account (Free Hobby Plan).
3. Click **"Add New"** → **"Project"** and select the `RoadmapIQ` repository.
4. Vercel automatically detects Vite as the framework preset.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. (Optional) In Project Settings → Environment Variables, add `GEMINI_API_KEY` if you have one.
6. Click **Deploy**. Your application will be live globally in under 60 seconds!
