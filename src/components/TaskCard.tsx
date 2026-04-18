import React, { useState } from 'react';
import { Task } from '../lib/storage';
import { useAppStore } from '../store/useAppStore';
import { Checkbox } from './ui/checkbox';
import { Play, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import ReactMarkdown from 'react-markdown';

interface TaskCardProps {
  task: Task;
  onFocus: () => void;
}

export function TaskCard({ task, onFocus }: TaskCardProps) {
  const { toggleTask, deleteTask } = useAppStore();
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  return (
    <div className={`group flex flex-col border border-border rounded-xl transition-all ${
      task.completed ? 'opacity-50 grayscale bg-muted/30' : 'bg-card hover:border-sidebar-border hover:shadow-sm'
    }`}>
      <div className="flex items-start gap-3 p-4">
        <div className="pt-0.5">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => toggleTask(task.id)} 
            className="w-5 h-5 rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
        
        <div className="flex-1 flex flex-col min-w-0 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} title={`${task.priority} priority`} />
            <h3 className={`font-medium text-base truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
             <span>{task.pomodoros} / {task.estimatedPomodoros} pomodoros</span>
             {task.description && (
               <span className="flex items-center gap-1">
                 {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                 Details
               </span>
             )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!task.completed && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); onFocus(); }}
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-full"
              title="Focus on this task"
            >
              <Play className="w-4 h-4 fill-current" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {expanded && task.description && (
        <div className="px-12 pb-4 text-sm text-foreground/80 prose prose-sm dark:prose-invert">
          <ReactMarkdown>{task.description}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
