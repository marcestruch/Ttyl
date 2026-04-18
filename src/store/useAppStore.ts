import { create } from 'zustand';
import { AppState, Task, UserData, loadState, saveState, Project, FocusSession, DEFAULT_PROJECT_ID } from '../lib/storage';

interface AppStore extends AppState {
  init: () => Promise<void>;
  setOnboarded: (user: UserData) => Promise<void>;
  updateUser: (user: Partial<UserData>) => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  
  addProject: (project: Project) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  setActiveProject: (projectId: string | null) => Promise<void>;
  
  addFocusSession: (session: FocusSession) => Promise<void>;
  toggleSidebar: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  hasOnboarded: false,
  user: { name: '', mainGoal: '', timeBlockDuration: 25 },
  projects: [],
  tasks: [],
  focusSessions: [],
  activeProjectId: null,
  sidebarOpen: true,
  theme: 'system',

  init: async () => {
    const state = await loadState();
    set(state);
    
    // Apply theme on load
    if (state.theme === 'dark' || (state.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setOnboarded: async (user: UserData) => {
    const state = get();
    const newState = { ...state, hasOnboarded: true, user };
    set(newState);
    await saveState(newState);
  },

  updateUser: async (updates: Partial<UserData>) => {
    const state = get();
    const newState = { ...state, user: { ...state.user, ...updates } };
    set(newState);
    await saveState(newState);
  },

  addTask: async (task: Task) => {
    const state = get();
    const newState = { ...state, tasks: [...state.tasks, task] };
    set(newState);
    await saveState(newState);
  },

  toggleTask: async (taskId: string) => {
    const state = get();
    const tasks = state.tasks.map(t => {
      if (t.id === taskId) {
        const completed = !t.completed;
        return { ...t, completed, completedAt: completed ? Date.now() : undefined };
      }
      return t;
    });
    const newState = { ...state, tasks };
    set(newState);
    await saveState(newState);
  },

  deleteTask: async (taskId: string) => {
    const state = get();
    const tasks = state.tasks.filter(t => t.id !== taskId);
    const newState = { ...state, tasks };
    set(newState);
    await saveState(newState);
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    const state = get();
    const tasks = state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
    const newState = { ...state, tasks };
    set(newState);
    await saveState(newState);
  },

  setTheme: async (theme: 'light' | 'dark' | 'system') => {
    const state = get();
    const newState = { ...state, theme };
    set(newState);
    await saveState(newState);

    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  addProject: async (project: Project) => {
    const state = get();
    const newState = { ...state, projects: [...state.projects, project] };
    set(newState);
    await saveState(newState);
  },

  updateProject: async (projectId: string, updates: Partial<Project>) => {
    const state = get();
    const projects = state.projects.map(p => p.id === projectId ? { ...p, ...updates } : p);
    const newState = { ...state, projects };
    set(newState);
    await saveState(newState);
  },

  deleteProject: async (projectId: string) => {
    const state = get();
    const projects = state.projects.filter(p => p.id !== projectId);
    const tasks = state.tasks.map(t => t.projectId === projectId ? { ...t, projectId: DEFAULT_PROJECT_ID } : t);
    let activeProjectId = state.activeProjectId;
    if (activeProjectId === projectId) {
      activeProjectId = projects.length > 0 ? projects[0].id : DEFAULT_PROJECT_ID;
    }
    const newState = { ...state, projects, tasks, activeProjectId };
    set(newState);
    await saveState(newState);
  },

  setActiveProject: async (projectId: string | null) => {
    const state = get();
    const newState = { ...state, activeProjectId: projectId };
    set(newState);
    await saveState(newState);
  },

  addFocusSession: async (session: FocusSession) => {
    const state = get();
    const newState = { ...state, focusSessions: [...state.focusSessions, session] };
    set(newState);
    await saveState(newState);
  },

  toggleSidebar: async () => {
    const state = get();
    const newState = { ...state, sidebarOpen: !state.sidebarOpen };
    set(newState);
    await saveState(newState);
  }
}));
