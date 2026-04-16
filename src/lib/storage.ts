import { writeTextFile, readTextFile, exists, BaseDirectory, mkdir } from '@tauri-apps/plugin-fs';

const FILE_NAME = 'ttyl_data.json';

export interface UserData {
  name: string;
  mainGoal: string;
  timeBlockDuration: number;
}

export interface Task {
  id: string;
  title: string;
  description: string; // Markdown
  completed: boolean;
  pomodoros: number;
}

export interface AppState {
  hasOnboarded: boolean;
  user: UserData;
  tasks: Task[];
  theme: 'light' | 'dark' | 'system';
}

const DEFAULT_STATE: AppState = {
  hasOnboarded: false,
  user: {
    name: '',
    mainGoal: '',
    timeBlockDuration: 25,
  },
  tasks: [],
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
    return JSON.parse(content) as AppState;
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
