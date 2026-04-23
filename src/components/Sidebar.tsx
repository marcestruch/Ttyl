import { useAppStore } from '../store/useAppStore';
import { ProjectItem } from './ProjectItem';
import { Settings, Plus, LayoutPanelLeft, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Project } from '../lib/storage';
import { Target } from 'lucide-react'; // Or any other suitable icon like Award or BarChart

interface SidebarProps {
  onSettingsClick: () => void;
  onSkillsClick: () => void;
  onDashboardClick: () => void;
  activeView: 'dashboard' | 'settings' | 'skills';
}

export function Sidebar({ onSettingsClick, onSkillsClick, onDashboardClick, activeView }: SidebarProps) {
  const { projects, tasks, activeProjectId, setActiveProject, sidebarOpen, toggleSidebar, addProject } = useAppStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  if (!sidebarOpen) return null;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: newProjectName.trim(),
      color: '#c5614d', // Default color
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    addProject(newProject);
    setNewProjectName('');
    setShowNewProject(false);
  };

  return (
    <aside 
      style={{ '--sidebar-width': '288px' } as React.CSSProperties}
      className="w-72 h-screen flex-shrink-0 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border animate-slide-in"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
           <div className="w-7 h-7 rounded-sm bg-primary/20 flex flex-col items-center justify-center border border-primary/30">
             <div className="w-3 h-3 rounded-sm bg-primary" />
           </div>
           <span className="font-semibold tracking-tight text-lg text-foreground">Ttyl</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground h-8 w-8" title="Contraer lateral (Ctrl+B)">
          <LayoutPanelLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Proyectos</span>
            <button 
              onClick={() => setShowNewProject(true)}
              className="p-1 hover:bg-sidebar-accent rounded-md transition-colors" 
              title="Nuevo Proyecto"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            {showNewProject && (
              <form onSubmit={handleCreateProject} className="px-2 py-2 mb-2 bg-sidebar-accent/50 rounded-lg animate-in slide-in-from-top-2 duration-200">
                <input
                  autoFocus
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Nombre del proyecto..."
                  className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground mb-2"
                />
                <div className="flex justify-end gap-1">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewProject(false)} className="h-7 px-2 text-xs">
                    <X className="w-3 h-3 mr-1" /> Cancelar
                  </Button>
                  <Button type="submit" size="sm" className="h-7 px-2 text-xs">
                    Crear
                  </Button>
                </div>
              </form>
            )}
            
            {projects.map((project) => {
              const pendingCount = tasks.filter(t => t.projectId === project.id && !t.completed).length;
              return (
                <ProjectItem 
                  key={project.id} 
                  project={project} 
                  isActive={activeView === 'dashboard' && activeProjectId === project.id}
                  onSelect={() => {
                    setActiveProject(project.id);
                    if (activeView !== 'dashboard') {
                      onDashboardClick();
                    }
                  }}
                  pendingCount={pendingCount}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        <button 
          onClick={onDashboardClick}
          className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-sidebar-accent text-sidebar-foreground font-medium' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}
        >
          <LayoutPanelLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button 
          onClick={onSkillsClick}
          className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${activeView === 'skills' ? 'bg-sidebar-accent text-sidebar-foreground font-medium' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}
        >
          <Target className="w-4 h-4" />
          <span>Skills</span>
        </button>
        <button 
          onClick={onSettingsClick}
          className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${activeView === 'settings' ? 'bg-sidebar-accent text-sidebar-foreground font-medium' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}
        >
          <Settings className="w-4 h-4" />
          <span>Ajustes</span>
        </button>
      </div>
    </aside>
  );
}
