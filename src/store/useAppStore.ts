import { create } from 'zustand';
import { AppState, Task, UserData, loadState, saveState } from '../lib/storage';

interface AppStore extends AppState {
  init: () => Promise<void>;
  setOnboarded: (user: UserData) => Promise<void>;
  updateUser: (user: Partial<UserData>) => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  hasOnboarded: false,
  user: { name: '', mainGoal: '', timeBlockDuration: 25 },
  tasks: [],
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
    const tasks = state.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
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
  }
}));
