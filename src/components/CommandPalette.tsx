import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useAppStore } from '../store/useAppStore';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Task } from '../lib/storage';
import { CheckCircle2, Folder, Sun, Moon, Monitor, Plus, Hash } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { setTheme, addTask, projects, tasks, setActiveProject } = useAppStore();
  const [input, setInput] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleCreateTask = () => {
    if (!input.trim() || projects.length === 0) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      projectId: projects[0].id,
      title: input.trim(),
      description: '',
      completed: false,
      priority: 'medium',
      estimatedPomodoros: 1,
      pomodoros: 0,
      createdAt: Date.now()
    };
    addTask(newTask);
    setInput('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden border-none shadow-2xl rounded-2xl max-w-2xl bg-card text-card-foreground">
        <Command className="flex flex-col w-full bg-transparent overflow-hidden h-full rounded-2xl">
          <Command.Input 
            autoFocus 
            placeholder="Type a command or create a task..." 
            value={input}
            onValueChange={setInput}
            className="w-full h-16 px-6 bg-transparent border-b border-border text-lg outline-none placeholder:text-muted-foreground"
          />
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
            
            {input.trim() && (
              <Command.Group heading="Actions" className="text-muted-foreground px-2 py-1 text-xs font-semibold pb-2 pt-2">
                <Command.Item 
                  onSelect={handleCreateTask}
                  className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                  Create task: "{input}"
                </Command.Item>
              </Command.Group>
            )}

            <Command.Group heading="Projects" className="text-muted-foreground px-2 py-1 text-xs font-semibold pb-2 pt-2">
              {projects.map(p => (
                <Command.Item 
                  key={p.id}
                  onSelect={() => { setActiveProject(p.id); setOpen(false); }}
                  className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
                >
                  <Folder className="w-4 h-4 text-muted-foreground" />
                  Go to {p.name}
                </Command.Item>
              ))}
            </Command.Group>

            {tasks.length > 0 && (
              <Command.Group heading="Tasks" className="text-muted-foreground px-2 py-1 text-xs font-semibold pb-2 pt-2">
                {tasks.slice(0, 5).map(t => (
                  <Command.Item 
                    key={t.id}
                    onSelect={() => { /* future toggle/focus action */ }}
                    className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
                  >
                    {t.completed ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Hash className="w-4 h-4 text-muted-foreground" />}
                    <span className="truncate">{t.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Theme" className="text-muted-foreground px-2 py-1 text-xs font-semibold pb-2 pt-2">
              <Command.Item 
                onSelect={() => { setTheme('light'); setOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
              >
                <Sun className="w-4 h-4 text-muted-foreground" />
                Light Theme
              </Command.Item>
              <Command.Item 
                onSelect={() => { setTheme('dark'); setOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
              >
                <Moon className="w-4 h-4 text-muted-foreground" />
                Dark Theme
              </Command.Item>
              <Command.Item 
                onSelect={() => { setTheme('system'); setOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
              >
                <Monitor className="w-4 h-4 text-muted-foreground" />
                System Theme
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
