import { CareerGoalId, Resource, Skill } from '../types';

const STORAGE_KEYS = {
  ACTIVE_GOAL: 'roadmap_active_goal',
  PROGRESS: 'roadmap_completed_skills',
  CUSTOM_RESOURCES: 'roadmap_custom_resources',
  NOTES: 'roadmap_skill_notes',
  STUDENT_YEAR: 'roadmap_student_year',
  CUSTOM_SKILLS: 'roadmap_custom_skills',
};

export const StorageService = {
  getActiveGoal(): CareerGoalId {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_GOAL);
      if (stored && ['sde', 'web-dev', 'data-analyst', 'devops', 'ai-ml', 'mobile-dev'].includes(stored)) {
        return stored as CareerGoalId;
      }
    } catch {
      // ignore
    }
    return 'sde';
  },

  setActiveGoal(goal: CareerGoalId): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_GOAL, goal);
    } catch {
      // ignore
    }
  },

  getStudentYear(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.STUDENT_YEAR) || 'Final Year';
    } catch {
      return 'Final Year';
    }
  },

  setStudentYear(year: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT_YEAR, year);
    } catch {
      // ignore
    }
  },

  getCompletedSkills(): Record<string, boolean> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  toggleSkillCompletion(skillId: string): boolean {
    const current = this.getCompletedSkills();
    const newState = !current[skillId];
    current[skillId] = newState;
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(current));
    } catch {
      // ignore
    }
    return newState;
  },

  setSkillCompletion(skillId: string, completed: boolean): void {
    const current = this.getCompletedSkills();
    current[skillId] = completed;
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(current));
    } catch {
      // ignore
    }
  },

  getCustomResources(): Record<string, Resource[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_RESOURCES);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  addCustomResource(skillId: string, resource: Omit<Resource, 'id'>): Resource {
    const all = this.getCustomResources();
    const list = all[skillId] || [];
    const newResource: Resource = {
      ...resource,
      id: `custom-r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    list.push(newResource);
    all[skillId] = list;
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_RESOURCES, JSON.stringify(all));
    } catch {
      // ignore
    }
    return newResource;
  },

  deleteCustomResource(skillId: string, resourceId: string): void {
    const all = this.getCustomResources();
    if (all[skillId]) {
      all[skillId] = all[skillId].filter((r) => r.id !== resourceId);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_RESOURCES, JSON.stringify(all));
      } catch {
        // ignore
      }
    }
  },

  getNotes(): Record<string, string> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  saveNote(skillId: string, note: string): void {
    const current = this.getNotes();
    current[skillId] = note;
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(current));
    } catch {
      // ignore
    }
  },

  getCustomSkills(): Record<string, Skill[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_SKILLS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  addCustomSkill(skill: Skill): void {
    const all = this.getCustomSkills();
    const list = all[skill.goalId] || [];
    list.push(skill);
    all[skill.goalId] = list;
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_SKILLS, JSON.stringify(all));
    } catch {
      // ignore
    }
  },

  resetAllProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_RESOURCES);
      localStorage.removeItem(STORAGE_KEYS.NOTES);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_SKILLS);
    } catch {
      // ignore
    }
  },

  seedDemoProgress(goalId: CareerGoalId): void {
    const demoProgress: Record<string, boolean> = {};
    if (goalId === 'sde') {
      demoProgress['sde-1'] = true;
      demoProgress['sde-2'] = true;
      demoProgress['sde-6'] = true;
    } else if (goalId === 'web-dev') {
      demoProgress['web-1'] = true;
      demoProgress['web-2'] = true;
      demoProgress['web-4'] = true;
    } else if (goalId === 'data-analyst') {
      demoProgress['da-1'] = true;
      demoProgress['da-2'] = true;
    } else if (goalId === 'devops') {
      demoProgress['devops-1'] = true;
      demoProgress['devops-2'] = true;
    } else if (goalId === 'ai-ml') {
      demoProgress['ai-1'] = true;
      demoProgress['ai-2'] = true;
    } else {
      demoProgress['mob-1'] = true;
      demoProgress['mob-2'] = true;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(demoProgress));
    } catch {
      // ignore
    }
  },
};
