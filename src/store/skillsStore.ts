// store/skillsStore.ts
import { create } from 'zustand';
import { Skill, SkillsState } from '../types/skills';
import { v4 as uuidv4 } from 'uuid';

export const useSkillsStore = create<SkillsState>((set, get) => ({
  skills: [],

  addSkill: (skill) =>
    set((state) => ({
      skills: [
        ...state.skills,
        {
          ...skill,
          id: uuidv4(),
          history: [
            {
              timestamp: new Date(),
              proficiency: skill.proficiency,
            },
          ],
          lastUpdated: new Date(),
        } as Skill,
      ],
    })),

  updateSkill: (id, updates) =>
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === id
          ? { ...skill, ...updates, lastUpdated: new Date() }
          : skill
      ),
    })),

  deleteSkill: (id) =>
    set((state) => ({
      skills: state.skills.filter((skill) => skill.id !== id),
    })),

  recordProgress: (skillId, proficiency) =>
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === skillId
          ? {
              ...skill,
              proficiency,
              lastUpdated: new Date(),
              history: [
                ...skill.history,
                {
                  timestamp: new Date(),
                  proficiency,
                },
              ],
            }
          : skill
      ),
    })),

  getSkillsByCategory: (category) => {
    return get().skills.filter((skill) => skill.category === category);
  },

  exportSkillsData: () => {
    const skills = get().skills;
    return JSON.stringify(skills, null, 2);
  },
}));
