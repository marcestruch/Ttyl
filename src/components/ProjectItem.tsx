import { Project } from '../lib/storage';

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  pendingCount?: number;
}

export function ProjectItem({ project, isActive, onSelect, pendingCount }: ProjectItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`group flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors ${
        isActive 
          ? 'bg-sidebar-accent text-sidebar-foreground font-medium' 
          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
      }`}
    >
      <div className="flex items-center gap-3 truncate">
        <div 
          className="w-2.5 h-2.5 rounded-full shrink-0" 
          style={{ backgroundColor: project.color || 'var(--primary)' }} 
        />
        <span className="truncate">{project.name}</span>
      </div>
      
      {pendingCount !== undefined && pendingCount > 0 && (
        <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold min-w-[1.25rem] ${
          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-sidebar-accent'
        }`}>
          {pendingCount}
        </span>
      )}
    </button>
  );
}
