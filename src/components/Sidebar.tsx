import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ProjectItem } from './ProjectItem';
import { Settings, Plus, LayoutPanelLeft } from 'lucide-react';
import { Button } from './ui/button';

export function Sidebar({ onSettingsClick }: { onSettingsClick: () => void }) {
  const { projects, activeProjectId, setActiveProject, sidebarOpen, toggleSidebar } = useAppStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="w-72 h-screen flex-shrink-0 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border animate-slide-in">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
           <div className="w-7 h-7 rounded-sm bg-primary/20 flex flex-col items-center justify-center border border-primary/30">
             <div className="w-3 h-3 rounded-sm bg-primary" />
           </div>
           <span className="font-semibold tracking-tight text-lg text-foreground">Ttyl</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground h-8 w-8" title="Collapse Sidebar (Ctrl+B)">
          <LayoutPanelLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Projects</span>
            <button className="p-1 hover:bg-sidebar-accent rounded-md transition-colors" title="New Project">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            {projects.map((project) => (
              <ProjectItem 
                key={project.id} 
                project={project} 
                isActive={activeProjectId === project.id}
                onSelect={() => setActiveProject(project.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button 
          onClick={onSettingsClick}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
