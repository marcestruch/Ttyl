import { useState } from 'react';
import { Task } from '../lib/storage';
import { useAppStore } from '../store/useAppStore';
import { Checkbox } from './ui/checkbox';
import { Play, Trash2, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import ReactMarkdown from 'react-markdown';

interface TaskCardProps {
  task: Task;
  onFocus: () => void;
}

export function TaskCard({ task, onFocus }: TaskCardProps) {
  const { toggleTask, deleteTask, updateTask } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit State
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  const handleToggle = () => {
    if (!task.completed) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
    toggleTask(task.id);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteTask(task.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handleSaveEdit = () => {
    updateTask(task.id, {
      title: editTitle,
      description: editDesc,
      priority: editPriority
    });
    setIsEditing(false);
  };

  return (
    <>
      <div className={`group flex flex-col border border-border rounded-xl transition-all duration-300 ${
        justCompleted ? 'scale-[0.98]' : 'scale-100'
      } ${
        task.completed ? 'opacity-50 grayscale bg-muted/30' : 'bg-card hover:border-sidebar-border hover:shadow-sm'
      }`}>
        <div className="flex items-start gap-3 p-4">
          <div className="pt-0.5">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={handleToggle}
              className="w-5 h-5 rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200"
            />
          </div>
          
          <div className="flex-1 flex flex-col min-w-0 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} title={`${task.priority} prioridad`} />
              <h3 className={`font-medium text-base truncate transition-all duration-200 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
               <span>{task.pomodoros} / {task.estimatedPomodoros} pomodoros</span>
               {(task.description || expanded) && (
                 <span className="flex items-center gap-1">
                   {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                   Detalles
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
                title="Enfocarse en esta tarea"
              >
                <Play className="w-4 h-4 fill-current" />
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
              title="Editar tarea"
            >
              <Pencil className="w-4 h-4" />
            </Button>

            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"
                  title="Confirmar borrar"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                  className="h-8 w-8 text-muted-foreground hover:bg-accent rounded-full text-xs"
                  title="Cancelar"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                title="Borrar tarea"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {expanded && task.description && (
          <div className="px-12 pb-4 text-sm text-foreground/80 prose prose-sm dark:prose-invert">
            <ReactMarkdown>{task.description}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <input 
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción (Markdown)</label>
              <textarea 
                value={editDesc} 
                onChange={e => setEditDesc(e.target.value)}
                rows={4}
                className="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prioridad</label>
              <div className="flex gap-2">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setEditPriority(p as any)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                      editPriority === p 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : 'Alta'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
