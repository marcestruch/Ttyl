import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useAppStore } from '../store/useAppStore';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Task } from '../lib/storage';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { setTheme, theme, addTask } = useAppStore();

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

  const [input, setInput] = useState('');

  const handleCreateTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.trim(),
      description: '',
      completed: false,
      pomodoros: 0
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
            placeholder="Type a command or create a task..." 
            value={input}
            onValueChange={setInput}
            className="w-full h-16 px-6 bg-transparent border-b border-border text-lg outline-none placeholder:text-muted-foreground"
          />
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
            
            {input.trim() && (
              <Command.Group heading="Actions" className="text-muted-foreground px-2 py-1 text-xs font-semibold px-4 pb-2 pt-4">
                <Command.Item 
                  onSelect={handleCreateTask}
                  className="flex items-center px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
                >
                  Create task: "{input}"
                </Command.Item>
              </Command.Group>
            )}

            <Command.Group heading="Theme" className="text-muted-foreground px-2 py-1 text-xs font-semibold px-4 pb-2 pt-4">
              <Command.Item 
                onSelect={() => { setTheme('light'); setOpen(false); }}
                className="flex items-center px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
              >
                Light Theme
              </Command.Item>
              <Command.Item 
                onSelect={() => { setTheme('dark'); setOpen(false); }}
                className="flex items-center px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
              >
                Dark Theme
              </Command.Item>
              <Command.Item 
                onSelect={() => { setTheme('system'); setOpen(false); }}
                className="flex items-center px-4 py-3 text-sm rounded-lg aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer transition-colors text-foreground"
              >
                System Theme
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
