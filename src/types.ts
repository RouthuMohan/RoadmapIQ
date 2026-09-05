/**
 * RoadmapIQ - Types and Interfaces
 */

export type CareerGoalId =
  | 'sde'
  | 'web-dev'
  | 'data-analyst'
  | 'devops'
  | 'ai-ml'
  | 'mobile-dev';

export type SkillImportance = 'essential' | 'high' | 'recommended' | 'optional';

export type SkillCategory =
  | 'Core Fundamentals'
  | 'Language & Syntax'
  | 'Data Structures & Algorithms'
  | 'Frontend Engineering'
  | 'Backend & APIs'
  | 'Databases & Storage'
  | 'DevOps & Tooling'
  | 'Machine Learning'
  | 'System Architecture';

export type ResourceType = 'video' | 'docs' | 'course' | 'practice';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  platform: string;
  isFree: boolean;
  duration?: string;
}

export interface Skill {
  id: string;
  goalId: CareerGoalId;
  orderIndex: number;
  name: string;
  category: SkillCategory;
  description: string;
  importance: SkillImportance;
  estimatedWeeks: number;
  whyItMatters: string;
  placementRelevance: string;
  resources: Resource[];
  isCustom?: boolean;
}

export interface CareerGoal {
  id: CareerGoalId;
  title: string;
  role: string;
  badge: string;
  description: string;
  recommendedTimeline: string;
  targetCompanies: string[];
  tags: string[];
  skillsCount: number;
  iconName: string;
}

export interface UserProgress {
  completedSkills: Record<string, boolean>;
  userNotes: Record<string, string>;
  customResources: Record<string, Resource[]>;
  customSkills: Record<string, Skill[]>;
}

export interface StudyOrderItem {
  skillId: string;
  skillName: string;
  reason: string;
  priorityScore: number;
}

export interface AIAdviceResult {
  source: 'gemini-ai' | 'rule-based-engine';
  recommendedNextSkillId: string;
  recommendedNextSkillName: string;
  whyItMattersNow: string;
  placementTip: string;
  suggestedStudyOrder: StudyOrderItem[];
  readinessEvaluation: {
    completionRate: number;
    stage: string;
    actionableStep: string;
  };
}

export type ViewTab = 'roadmap' | 'analytics' | 'about';
