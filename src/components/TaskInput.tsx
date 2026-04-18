import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Task } from '../lib/storage';
import { Plus, Maximize2, Minimize2 } from 'lucide-react';

export function TaskInput() {
  const { addTask, activeProjectId } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [estimated, setEstimated] = useState('1');
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus input on slash
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activeProjectId) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
      estimatedPomodoros: parseInt(estimated) || 1,
      pomodoros: 0,
      createdAt: Date.now()
    };

    addTask(newTask);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setEstimated('1');
    setExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Enter' && e.shiftKey && !expanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <div className={`bg-card border border-border shadow-sm transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-md ${expanded ? 'rounded-xl' : 'rounded-full'}`}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center px-4 py-2">
          <Plus className="w-5 h-5 text-muted-foreground shrink-0 mr-2" />
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add task... (Press / to focus)"
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground py-1"
          />
          <button 
            type="button" 
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {expanded && (
          <div className="px-4 pb-4 pt-2 border-t border-border animate-accordion-down">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (Markdown supported)"
              className="w-full bg-transparent border-none outline-none resize-none text-sm min-h-[80px] mb-4"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Priority</span>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="text-xs bg-accent text-foreground border-none rounded p-1 outline-none appearance-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Pomodoros</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={estimated}
                    onChange={(e) => setEstimated(e.target.value)}
                    className="w-12 text-xs bg-accent text-foreground border-none rounded p-1 outline-none text-center"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
