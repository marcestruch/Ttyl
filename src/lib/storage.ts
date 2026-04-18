import { writeTextFile, readTextFile, exists, BaseDirectory, mkdir } from '@tauri-apps/plugin-fs';

const FILE_NAME = 'ttyl_data.json';

export interface UserData {
  name: string;
  mainGoal: string;
  timeBlockDuration: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedPomodoros: number;
  pomodoros: number;
  subtasks?: SubTask[];
  createdAt: number;
  completedAt?: number;
}

export interface FocusSession {
  id: string;
  taskId: string;
  startedAt: number;
  endedAt: number;
  durationMinutes: number;
}

export interface AppState {
  hasOnboarded: boolean;
  user: UserData;
  projects: Project[];
  tasks: Task[];
  focusSessions: FocusSession[];
  activeProjectId: string | null;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
}

export const DEFAULT_PROJECT_ID = 'default-project';

const DEFAULT_STATE: AppState = {
  hasOnboarded: false,
  user: {
    name: '',
    mainGoal: '',
    timeBlockDuration: 25,
  },
  projects: [{
    id: DEFAULT_PROJECT_ID,
    name: 'Main Focus',
    color: '#c5614d',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }],
  tasks: [],
  focusSessions: [],
  activeProjectId: DEFAULT_PROJECT_ID,
  sidebarOpen: true,
  theme: 'system',
};

// We will attempt to use BaseDirectory.AppConfig
export async function initializeStorage(): Promise<void> {
  try {
    const dirExists = await exists('', { baseDir: BaseDirectory.AppConfig });
    if (!dirExists) {
      await mkdir('', { baseDir: BaseDirectory.AppConfig });
    }
  } catch (e) {
    console.error("Failed to initialize storage directory", e);
  }
}

export async function loadState(): Promise<AppState> {
  try {
    await initializeStorage();
    const fileExists = await exists(FILE_NAME, { baseDir: BaseDirectory.AppConfig });
    if (!fileExists) {
      await saveState(DEFAULT_STATE);
      return DEFAULT_STATE;
    }
    const content = await readTextFile(FILE_NAME, { baseDir: BaseDirectory.AppConfig });
    let state = JSON.parse(content) as AppState;
    
    // Migrations
    let needsSave = false;
    if (!state.projects) {
      state.projects = [...DEFAULT_STATE.projects];
      state.activeProjectId = DEFAULT_PROJECT_ID;
      needsSave = true;
    }
    if (!state.focusSessions) {
      state.focusSessions = [];
      needsSave = true;
    }
    if (typeof state.sidebarOpen === 'undefined') {
      state.sidebarOpen = true;
      needsSave = true;
    }
    if (state.tasks && state.tasks.length > 0 && !state.tasks[0].projectId) {
      state.tasks = state.tasks.map(t => ({
        ...t,
        projectId: DEFAULT_PROJECT_ID,
        priority: (t as any).priority || 'medium',
        estimatedPomodoros: (t as any).estimatedPomodoros || 1,
        createdAt: (t as any).createdAt || Date.now(),
      }));
      needsSave = true;
    }

    if (needsSave) {
      await saveState(state);
    }
    
    return state;
  } catch (error) {
    console.error('Failed to load state, using default:', error);
    return DEFAULT_STATE;
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await initializeStorage();
    await writeTextFile(FILE_NAME, JSON.stringify(state, null, 2), {
      baseDir: BaseDirectory.AppConfig,
    });
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}
