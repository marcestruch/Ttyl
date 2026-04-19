import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TaskCard } from '../components/TaskCard';
import { TaskInput } from '../components/TaskInput';
import { DEFAULT_PROJECT_ID } from '../lib/storage';

export default function Dashboard({ onStartFocus }: { onStartFocus: (taskId: string) => void }) {
  const { user, tasks, projects, activeProjectId } = useAppStore();
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const projectTasks = tasks.filter(t => t.projectId === activeProject?.id);
  
  const pendingTasks = projectTasks.filter(t => !t.completed).sort((a, b) => b.createdAt - a.createdAt);
  const completedTasks = projectTasks.filter(t => t.completed).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  if (!activeProject && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background animate-in fade-in duration-500">
        <h2 className="text-xl font-medium text-muted-foreground">No projects found. Create one to get started.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500 relative">
      <header className="px-8 pt-12 pb-6 shrink-0 border-b border-border/50">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {greeting}, {user.name || 'Usuario'}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          {activeProject?.id !== DEFAULT_PROJECT_ID ? (
            <>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeProject?.color || 'var(--primary)' }} />
              <span className="font-medium">{activeProject?.name}</span>
            </>
          ) : (
            <span>Aquí tienes tu enfoque para hoy.</span>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-8 pb-40">
        <div className="max-w-3xl mx-auto space-y-10">
          
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">A continuación</h2>
            </div>
            
            {pendingTasks.length === 0 ? (
              <div className="text-center py-16 px-4 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">No hay tareas pendientes en este proyecto.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} onFocus={() => onStartFocus(task.id)} />
                ))}
              </div>
            )}
          </section>

          {completedTasks.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completadas ({completedTasks.length})</h2>
              </div>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} onFocus={() => onStartFocus(task.id)} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 p-6 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" style={{ left: 'var(--sidebar-width, 0)', right: 0 }}>
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <TaskInput />
        </div>
      </div>
    </div>
  );
}
