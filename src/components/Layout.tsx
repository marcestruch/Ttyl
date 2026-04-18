import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../store/useAppStore';
import { CommandPalette } from './CommandPalette';
import { LayoutPanelLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onSettingsClick: () => void;
}

export function Layout({ children, onSettingsClick }: LayoutProps) {
  const { toggleSidebar, sidebarOpen } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background text-foreground">
      <Sidebar onSettingsClick={onSettingsClick} />
      
      <main className="flex-1 relative overflow-y-auto">
        {/* Toggle button when sidebar is closed */}
        {!sidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="absolute top-4 left-4 z-10 p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors"
            title="Expand Sidebar (Ctrl+B)"
          >
            <LayoutPanelLeft className="w-5 h-5" />
          </button>
        )}
        
        {children}
      </main>

      <CommandPalette />
    </div>
  );
}
