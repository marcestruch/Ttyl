import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useAppStore } from '../store/useAppStore';
import { Dialog, DialogContent } from './ui/dialog';
import { Task } from '../lib/storage';
import { CheckCircle2, Folder, Sun, Moon, Monitor, Plus, Hash } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { setTheme, addTask, projects, tasks, setActiveProject, activeProjectId } = useAppStore();
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
      projectId: activeProjectId || projects[0].id,
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
            placeholder="Escribe un comando o crea una tarea..." 
            value={input}
            onValueChange={setInput}
            className="w-full h-16 px-6 bg-transparent border-b border-border text-lg outline-none placeholder:text-muted-foreground"
          />
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm">No se encontraron resultados.</Command.Empty>
            
            {input.trim() && (
              <Command.Group heading="Acciones" className="text-muted-foreground px-2 py-1 text-xs font-semibold pb-2 pt-2">
                <Command.Item 
                  onSelect={handleCreateTask}
                  className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                  Crear tarea: "{input}"
                </Command.Item>
              </Command.Group>
            )}

            <Command.Group heading="Proyectos" className="text-muted-foreground px-2 py-1 text-xs font-semibold pb-2 pt-2">
              {projects.map(p => (
                <Command.Item 
                  key={p.id}
                  onSelect={() => { setActiveProject(p.id); setOpen(false); }}
                  className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
                >
                  <Folder className="w-4 h-4 text-muted-foreground" />
                  Ir a {p.name}
                </Command.Item>
              ))}
            </Command.Group>

            {tasks.length > 0 && (
              <Command.Group heading="Tareas" className="text-muted-foreground px-2 py-1 text-xs font-semibold pb-2 pt-2">
                {tasks.slice(0, 5).map(t => (
                  <Command.Item 
                    key={t.id}
                    onSelect={() => { setActiveProject(t.projectId); setOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
                  >
                    {t.completed ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Hash className="w-4 h-4 text-muted-foreground" />}
                    <span className="truncate">{t.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Tema" className="text-muted-foreground px-2 py-1 text-xs font-semibold pb-2 pt-2">
              <Command.Item 
                onSelect={() => { setTheme('light'); setOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
              >
                <Sun className="w-4 h-4 text-muted-foreground" />
                Tema Claro
              </Command.Item>
              <Command.Item 
                onSelect={() => { setTheme('dark'); setOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
              >
                <Moon className="w-4 h-4 text-muted-foreground" />
                Tema Oscuro
              </Command.Item>
              <Command.Item 
                onSelect={() => { setTheme('system'); setOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
              >
                <Monitor className="w-4 h-4 text-muted-foreground" />
                Tema del Sistema
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
