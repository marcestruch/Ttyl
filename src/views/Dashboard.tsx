import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import ReactMarkdown from 'react-markdown';
import { Checkbox } from '../components/ui/checkbox';
import { Play, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Dashboard({ onStartFocus }: { onStartFocus: (taskId: string) => void }) {
  const { user, tasks, toggleTask, addTask } = useAppStore();
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="flex min-h-screen flex-col p-8 md:p-16 xl:p-24 bg-background text-foreground animate-in fade-in duration-500">
      <header className="mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-primary tracking-tight">
          {greeting}, {user.name || 'User'}
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl">
          Your main goal: <span className="font-medium text-foreground">{user.mainGoal}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Press <kbd className="font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md text-xs mx-1 border border-border/50">Ctrl+K</kbd> to open the command palette.
        </p>
      </header>

      <main className="flex-1 space-y-12 shrink-0">
        <section>
          <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
            <h2 className="text-lg font-medium text-muted-foreground">Up Next</h2>
          </div>
          
          {pendingTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
              <p>No tasks remaining.</p>
              <p className="text-sm mt-2">Use Ctrl+K to create one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTasks.map(task => (
                <div key={task.id} className="group flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-border hover:bg-card/50 transition-all">
                  <div className="pt-1">
                    <Checkbox 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTask(task.id)} 
                      className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium tracking-tight text-lg leading-tight">{task.title}</p>
                    {task.description && (
                      <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert">
                        <ReactMarkdown>{task.description}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onStartFocus(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary rounded-full h-10 w-10 flex-shrink-0"
                    title="Focus on this task"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {completedTasks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 mt-12">
              <h2 className="text-base font-medium text-muted-foreground">Completed ({completedTasks.length})</h2>
            </div>
            <div className="space-y-2 opacity-50">
              {completedTasks.map(task => (
                <div key={task.id} className="flex items-start gap-4 p-4">
                  <div className="pt-1">
                    <Checkbox checked={true} onCheckedChange={() => toggleTask(task.id)} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium line-through">{task.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
