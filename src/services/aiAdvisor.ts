import { AIAdviceResult, Skill } from '../types';

export async function fetchPlacementAdvice(params: {
  careerGoal: string;
  studentYear: string;
  completedSkillIds: string[];
  skills: Skill[];
  customQuestion?: string;
}): Promise<AIAdviceResult> {
  const { careerGoal, studentYear, completedSkillIds, skills, customQuestion } = params;

  // Try calling the backend API endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch('/api/advisor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        careerGoal,
        studentYear,
        completedSkillIds,
        skills,
        customQuestion,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json && json.data && json.data.recommendedNextSkillName) {
        return json.data as AIAdviceResult;
      }
    }
  } catch {
    // Network or server error - gracefully fallback to local intelligent rules
  }

  // Pure client-side intelligent fallback (guaranteed to work offline, on static Vercel, or with 0 API keys)
  return getLocalPlacementAdvice(careerGoal, studentYear, completedSkillIds, skills, customQuestion);
}

export function getLocalPlacementAdvice(
  careerGoal: string,
  studentYear: string,
  completedSkillIds: string[] = [],
  skills: Skill[] = [],
  customQuestion?: string
): AIAdviceResult {
  const total = skills.length;
  const completedCount = completedSkillIds.length;
  const pendingSkills = skills.filter((s) => !completedSkillIds.includes(s.id));
  const nextSkill = pendingSkills[0] || skills[0] || null;

  let yearAdvice = '';
  if (studentYear?.includes('1st') || studentYear?.includes('2nd')) {
    yearAdvice =
      'In 1st/2nd year, do not chase multiple frameworks simultaneously. Master 1 core language, build solid DSA foundations, and keep your college GPA above 7.5.';
  } else if (studentYear?.includes('3rd')) {
    yearAdvice =
      '3rd year is the critical inflection point: aim for 150+ medium LeetCode/DSA problems solved and ship 2 polished, deployed portfolio projects before on-campus internship drives start.';
  } else {
    yearAdvice =
      'In Final Year, prioritize high-frequency interview patterns, company-specific past papers, resume screening optimization, and mock technical interviews.';
  }

  const roleTips: Record<string, string> = {
    sde: 'Campus recruiters for SDE heavily weigh clean coding, time-complexity analysis, and low-level OOP principles. Write clean, modular functions during tests.',
    'web-dev':
      'Interviewers want to see live deployed apps on Vercel with clean responsive layouts, proper state management, and real API integrations.',
    'data-analyst':
      'Be prepared to write multi-table SQL queries with window functions (RANK, ROW_NUMBER) and explain business metric implications on a live whiteboard.',
    devops:
      'Demonstrate reproducible infrastructure: push a GitHub repository with working Dockerfiles, GitHub Actions CI pipelines, and a live cloud deployment.',
    'ai-ml':
      'Focus on answering the "why" behind model selection: bias-variance tradeoff, precision vs recall trade-offs, and proper data validation splits.',
    'mobile-dev':
      'Show that you understand mobile constraints: offline caching, memory consumption during list scrolling, and smooth 60fps animations.',
  };

  const roleAdvice =
    roleTips[careerGoal] ||
    'Build practical competence step-by-step. A finished small project is worth more than five unfinished large ones.';

  const suggestedStudyOrder = skills.map((s, idx) => {
    const isDone = completedSkillIds.includes(s.id);
    return {
      skillId: s.id,
      skillName: s.name,
      reason: isDone
        ? 'Skill verified — Ready for interview questions.'
        : `Stage ${idx + 1}: Prerequisite building block for ${careerGoal.toUpperCase()} placement assessments.`,
      priorityScore: isDone ? 1 : Math.max(10 - idx, 2),
    };
  });

  let whyItMatters = '';
  if (nextSkill) {
    whyItMatters = `${nextSkill.name} is your immediate next milestone. ${nextSkill.whyItMatters}`;
  } else {
    whyItMatters =
      'You have marked all core roadmap skills as completed! Shift your full attention to mock interviews, behavioral rounds, and capstone deployment.';
  }

  if (customQuestion && customQuestion.trim().length > 0) {
    whyItMatters += ` (Regarding "${customQuestion.slice(0, 45)}...": Focus on consistency and deliberate practice over cramming.)`;
  }

  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return {
    source: 'rule-based-engine',
    recommendedNextSkillId: nextSkill ? nextSkill.id : (skills[0]?.id ?? ''),
    recommendedNextSkillName: nextSkill ? nextSkill.name : 'Comprehensive Placement Review',
    whyItMattersNow: whyItMatters,
    placementTip: `${yearAdvice} ${roleAdvice}`,
    suggestedStudyOrder,
    readinessEvaluation: {
      completionRate,
      stage:
        completedCount === 0
          ? 'Getting Started'
          : completionRate < 40
          ? 'Foundation Stage'
          : completionRate < 80
          ? 'Intermediate Builder'
          : 'Placement Interview Ready',
      actionableStep: nextSkill
        ? `Target completing "${nextSkill.name}" over the next ${nextSkill.estimatedWeeks} weeks using the attached free resources.`
        : 'Take 3 timed mock coding interviews and review your resume bullet points.',
    },
  };
}
