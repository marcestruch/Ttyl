// types/skills.ts
export interface Skill {
  id: string;
  name: string;
  proficiency: number; // 0-100
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'soft' | 'other';
  lastUpdated: Date;
  history: SkillHistory[];
  notes?: string;
  targetProficiency?: number; // Meta a alcanzar
}

export interface SkillHistory {
  timestamp: Date;
  proficiency: number;
  sessionId?: string; // Link a sesión de focus
}

export interface SkillsState {
  skills: Skill[];
  addSkill: (skill: Omit<Skill, 'id' | 'history' | 'lastUpdated'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  recordProgress: (skillId: string, proficiency: number) => void;
  getSkillsByCategory: (category: Skill['category']) => Skill[];
  exportSkillsData: () => string;
}
